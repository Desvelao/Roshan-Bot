const { Logger } = require('aghanim');

module.exports = {
  name: 'Logger',
  constructor: (client, options) => {
    // do something when create component instance
    this.channelID = process.env.DISCORD_PIT_SERVER_CONSOLE_CHANNEL_ID;
    this.client = client;
    this.colors = {
      red: 16711680
    };
    this.logger = new Logger({
      label: 'Roshan',
      timestamps: true,
      levels: {
        ready: { style: 'cyan' },
        cmd: { style: 'cyan' },
        dev: { style: 'magenta' },
        eval: { style: 'cyan' }
      }
    });
    this.client.logger = this.logger;
    this.client.on('aghanim:command:prereq', (msg, args, client, command) => {
      this.logger.cmd(
        `${command.name} - ${msg.author.username} (${msg.author.id})`
      );
      client
        .createMessage(this.channelID, {
          embed: {
            title: `cmd: ${command.name}`,
            author: {
              name: `${msg.author.username} - ${msg.author.id}`,
              icon_url: msg.author.avatarURL
            },
            description: `${
              msg.channel.guild
                ? `**guild**: \`${msg.channel.guild.name}\` (\`${msg.channel.guild.id}\`)\n`
                : ''
            }**channel**: \`${msg.channel.name}\` (\`${
              msg.channel.id
            }\`)\n**content**: \`${args.content}\``
          }
        })
        .catch(this.logger.error);
    });
    this.client.on(
      'aghanim:command:error',
      (error, msg, args, client, command) => {
        this.logger.error(
          `cmd: ${command.name} - ${msg.author.username} (${msg.author.id})\n${
            error.message || error
          }`
        );
        client
          .createMessage(this.channelID, {
            content: process.env.DISCORD_PIT_SERVER_ROLE_MENTION_DEV_ERRORS,
            embed: {
              title: `cmd: ${command.name}`,
              author: {
                name: `${msg.author.username} - ${msg.author.id}`,
                icon_url: msg.author.avatarURL
              },
              description: `${
                msg.channel.guild
                  ? `**guild**: \`${msg.channel.guild.name}\` (\`${msg.channel.guild.id}\`)\n`
                  : ''
              }**channel**: \`${msg.channel.name}\` (\`${msg.channel.id}\`)`,
              fields: [
                {
                  name: 'Command content',
                  value: toCode(msg.content),
                  inline: false
                },
                {
                  name: 'Error message',
                  value: toCode(error.message),
                  inline: false
                }
              ],
              color: this.colors.red
            }
          })
          .catch(this.logger.error);
        msg.reply('error.unknown');
      }
    );
    this.client.on(
      'aghanim:component:error',
      (error, event, client, component) => {
        this.logger.error(
          `component: ${component.name}\n${error.message || error}`
        );
        client
          .createMessage(this.channelID, {
            content: process.env.DISCORD_PIT_SERVER_ROLE_MENTION_DEV_ERRORS,
            embed: {
              title: `component: ${component.constructor.name}`,
              fields: [
                {
                  name: 'Error Message',
                  value: toCode(error.message),
                  inline: false
                },
                {
                  name: 'Error Stack',
                  value: toCode(error.stack),
                  inline: false
                }
              ],
              color: this.colors.red
            }
          })
          .catch(this.logger.error);
      }
    );
    this.client.on('aghanim:error', (error, client) => {
      this.logger.error(`error: ${error.message || error}`);
      client
        .createMessage(this.channelID, {
          content: process.env.DISCORD_PIT_SERVER_ROLE_MENTION_DEV_ERRORS,
          embed: {
            title: `:x: Bot Error: ${error.message}`,
            fields: [
              {
                name: 'Error Message',
                value: toCode(error.message),
                inline: false
              },
              ...(error.stack
                ? [
                    {
                      name: 'Error Stack',
                      value: toCode(error.stack),
                      inline: false
                    }
                  ]
                : [])
            ],
            color: this.colors.red
          }
        })
        .catch(this.logger.error);
    });
  }
};

const toCode = (str) => {
  str = typeof str !== 'string' ? String(str) : str;
  return `\`\`\`${str.substring(0, 1000)}\`\`\``;
};
