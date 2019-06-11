const { Command } = require('aghanim')

module.exports = new Command('setpatch',{
  category : 'Owner', help : 'Actualiza el mensaje de `r!patch`', args : '<mensaje del parche>',
  ownerOnly : true},
  async function(msg, args, client){
    const patch = args.from(1)
    return client.db.child('bot').update({patch : patch}).then(() => {
      client.cache.dota2Patch = patch
      return msg.addReaction(client.config.emojis.default.accept)
    })
  })
