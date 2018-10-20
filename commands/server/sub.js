const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')
const FirebaseArraySet = require('../../classes/firebasearrayset')

module.exports = new Command(['subscribe','sub'],{subcommandFrom : 'server',
  category : 'Server', help : 'Subscripción de feeds', args : '<feeds separados por un espacio>',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    // let self = this
    const content = args.from(2)
    if(!content){return}
    const subs = content.split(' ')
    if(!subs.length){return}
    const server = this.cache.servers.get(msg.channel.guild.id)
    if(!server){return}
    const serversSubs = new FirebaseArraySet(server.feeds.subs,enumFeeds.toArray().map(e => e.key))
    const subsKey = []
    subs.forEach(sub => {
      const s = enumFeeds.getKey(sub)
      if(s){serversSubs.addVal(s);subsKey.push(s)}
    })
    if(!subsKey.length){return}
    return this.cache.servers.modify(msg.channel.guild.id,{feeds : {subs : serversSubs.tostring}}).then(() =>
      msg.reply(this.replace.do('serverSubscription',{subs : subsKey.map(s => `**${enumFeeds.getValue(s)}**`).join(', ')},true))
    )
  })
