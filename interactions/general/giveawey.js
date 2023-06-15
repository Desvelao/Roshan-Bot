const Aghanim = require('aghanim')

//TODO: review

module.exports = {
  name: 'giveaway',
  category: 'General',
  description: 'Get started information',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  rolesCanUse: 'aegis',
  requirements: [
    'guild.only'
  ],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DEV_SERVER_ID]
  },
  run: async function (msg, args, client, command){
    const guild = msg.channel.guild
    const re = /<@&([\d^>]+)>/g
    let myArray
    const roles = []
    let members = new Set()
    if(re.test(msg.content)){
      re.lastIndex = 0
      while(myArray = re.exec(msg.content)){
        const membersFound = guild.members.filter(m => m.roles.includes(myArray[1]) && !m.bot)
        roles.push(myArray[1])
        if(membersFound.length){membersFound.forEach(m => members.add(m.id))}
      }
      if(members.size){
        members = Array.from(members)
        return fn(msg, args, members, guild, roles, client)
      }
    }else{
      members = guild.members.filter(m => !m.bot).map(m => m.id)
      return fn(msg, args, members, guild, roles, client)
    }
  }
}

function fn(msg,args,members,guild,roles,bot){
  const winner = guild.members.get(members[Math.floor(Math.random()*members.length)])
  const title = msg.author.locale('giveaway.title',{members : members.length})
  const waittime = 2*1000
  roles = roles.map(r => guild.roles.get(r).name)
  const embed = {
    content : '',
    embed : {
      title : `${title}`,
      description: msg.author.locale('giveaway.winner',{winner : winner.username}),
      thumbnail : {url : winner.avatarURL},
      color : bot.config.color
    }
  }
  if(roles.length){embed.embed.fields = [{name : msg.author.locale('giveaway.roles'), value : roles.join(', '), inline : false}]}
  return msg.reply(`${title}...${roles.length ? `\n%%giveaway.roles%%: ${roles.join(', ')}` : ''}`)
    .then(m => setTimeout(() => m.edit(embed)
      ,waittime))
}
