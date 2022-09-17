module.exports = {
  name: 'svleave',
  category : 'Owner',
  help : 'Roshan leaves from a guild',
  args : '<serverID>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const guild = client.guilds.get(args[1])
    if(!guild){return}
    client.leaveGuild(guild.id)
    msg.addReaction(client.config.emojis.default.accept)
    client.logger.info('svleave: ' + `Guild left: ${guild.id}`)
  }
}
