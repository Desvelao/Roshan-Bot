const { Datee } = require('erisjs-utils')

module.exports = {
  name: 'newserver',
  category : 'Owner',
  help : 'Add a new guild',
  args : '<guildID>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const guild = client.guilds.get(args[1])
    if(!guild){return msg.addReaction(client.config.emojis.default.error)}
  }
}
