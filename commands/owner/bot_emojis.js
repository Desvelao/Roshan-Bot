const { Guild } = require('erisjs-utils')

module.exports = {
  name: 'emojis',
  childOf : 'bot',
  category : 'Owner',
  help : 'Reset and show the bot emojis',
  args : '<reset,show>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    if(args[2] == 'reset'){
      client.config.emojis.bot = Guild.loadEmojis(client.guilds.get(client.config.guild.id));
      return msg.addReaction(config.emojis.default.accept);
    }else if(args[2] == 'show'){
      return msg.reply('__**Emojis Bot**__\n\n' + Object.keys(client.config.emojis.bot).sort().map(emoji => client.config.emojis.bot[emoji]).join(', '));
    }
  }
}
