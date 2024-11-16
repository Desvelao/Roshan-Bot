const { Component } = require('aghanim');
const { inspect } = require('util');
const { registerREPLCommands } = require('../repl-commands');

function createReply(client, msg) {
  function response(message) {
    return client.createMessage(msg.channel.id, message);
  }
  response.table = (head, array) =>
    response(
      head.join(' | ') + '\n' + array.map((el) => el.join(' | ')).join('\n')
    );
  response.object = (obj) => response(`\`\`\`js\n${inspect(obj)}\`\`\``);
  response.keyval = (obj) =>
    response(
      Object.keys(obj)
        .map((key) => `${key}: ${obj[key]}`)
        .join('\n')
    );
  response.js = (obj) => response(`\`\`\`js\n${inspect(obj)}\`\`\``);
  return response;
}

module.exports = class Repl extends Component {
  constructor(client, options) {
    super(client, options);
    this.enable = true;
    this.replChannel = process.env.DISCORD_MANAGEMENT_SERVER_CHANNEL_ID_REPL;
    this.scriptsChannel =
      process.env.DISCORD_MANAGEMENT_SERVER_CHANNEL_ID_REPL_SCRIPTS;
  }
  ready(client) {
    this.update();
  }
  messageCreate(msg, client) {
    if (
      msg.channel.id === this.replChannel &&
      !msg.author.bot &&
      (msg.author.id === msg.author.id) !== this.client.owner.id
    ) {
      this.client.logger.debug('Running REPL');
      const response = createReply(this.client, msg);

      const input = msg.content.split(' ');
      const { command, ctx } = parse(this.repl.commands, input);
      if (command) {
        return Promise.resolve(
          command.run(ctx, client, response, command)
        ).catch(console.log);
      } else {
        const client = this.client;
        const evalMessage = `return ${msg.content}`;
        const f = new Function('ctx', evalMessage);
        Promise.resolve(f({ client, msg }))
          .then((res) => {
            const result = String(
              typeof res === 'object' ? inspect(res) : res
            ).slice(0, 1000);
            this.client.logger.eval(`Eval [${evalMessage}]: ${result}`);
            return this.client.createMessage(
              msg.channel.id,
              `**${this.client.config.emojis.default.accept} Result**\n\`\`\`js\n${result}\`\`\``
            );
          })
          .catch((err) => {
            this.client.logger.eval(`Eval error [${evalMessage}]: ${err}`);
            return this.client.createMessage(
              msg.channel.id,
              `**${this.client.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``
            );
          });
      }
    }
  }
  update() {
    this.repl = new CommandRepl();
    this.repl.register('refresh', (_, client, response) =>
      this.update().then(() => response('Done refresh'))
    );
    this.repl.register('help', (_, client, response) =>
      response.table(
        ['Command', 'Description'],
        this.repl.commands.map((cmd) => [cmd.name, ''])
      )
    );
    registerREPLCommands({
      register: this.repl.register.bind(this.repl),
      CommandRepl,
      helpfunction
    });
    // Load REPL commands from channel
    return this.client.getMessages(this.scriptsChannel).then((messages) => {
      const { exists, notExists } = messages
        .filter((m) => m.content.startsWith('🇷'))
        .map((m) => ({
          tag: m.content.match(/\*\*(\w+)\*\*/)[1],
          description: m.content.match(/\*\* - ([^\n]+)/)[1] || '',
          src: m.content.match(/\`\`\`js\n?([^]+)\n?\`\`\`/)[1]
        }))
        .reduce(
          (sum, cmd) => {
            sum[this.repl.has(cmd.tag) ? 'exists' : 'notExists'].push(cmd);
            return sum;
          },
          { exists: [], notExists: [] }
        );
      exists.forEach((c) => {
        try {
          const command = this.repl.commands.find((cmd) => cmd.name === c.tag);
          const src = eval(`const obj = ${c.src};obj`);
          Object.keys(src).map((key) => command.register(key, src[key]));
        } catch (err) {
          console.error(err);
        }
      });
      notExists.forEach((c) => {
        const command = new CommandRepl(c.tag, helpfunction);
        const src = eval(`const obj = ${c.src};obj`);
        Object.keys(src).map((key) => command.register(key, src[key]));
        this.repl.register(command);
      });
      return this.client.logger.ready('Scripts Repl loaded');
    });
  }
};

class CommandRepl {
  constructor(name, fn) {
    this.name = name;
    this.run = fn;
    this.commands = [];
  }
  register(name, fn) {
    if (name instanceof CommandRepl) {
      this.commands.push(name);
    } else {
      this.commands.push(new CommandRepl(name, fn));
    }
    return this;
  }
  run(ctx, client, response) {}
  render() {
    console.log(render(this, '', 0));
  }
  has(command_name) {
    return this.commands.find((c) => c.name === command_name);
  }
}

function render(cmd, sum = '', lvl) {
  return cmd.commands.reduce((c, s) => {}, '');
  if (cmd.commands.length) {
    return (
      sum + ' '.repeat(lvl) + '\n' + render(cmd.commands, sum, lvl + 1) + '\n'
    );
  } else {
    return sum + cmd.name + '\n';
  }
}
function parse(commands, ctx) {
  const command = commands.find((command) => command.name === ctx[0]);
  const [_, ...restargs] = ctx;
  if (command && command.commands.length) {
    const parsed = parse(command.commands, restargs);
    return parsed.command ? parsed : { command, ctx: restargs };
  } else {
    return { command, ctx: restargs };
  }
}

const helpfunction = (_, client, response, command) =>
  response.table(
    ['Command', 'Description'],
    command.commands.map((cmd) => [cmd.name, cmd.description])
  );
