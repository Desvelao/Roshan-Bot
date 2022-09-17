module.exports = {
  name: 'setpatch',
  category : 'Owner',
  help : 'Updates the `r!patch` message',
  args : '<mmessage>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const patch = args.from(1)
    return client.db.child('bot').update({patch : patch}).then(() => {
      client.cache.dota2Patch = patch
      return msg.addReaction(client.config.emojis.default.accept)
    })
  }
}
