const { Guild } = require('erisjs-utils')

module.exports = {
  name: 'svmsg',
  category : 'Owner',
  help : 'Send a message to a guild',
  args : '<id> <message>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    if(!args[1]){return}
    const id = args[1];
    const guild = client.guilds.get(id);
    if(!guild){return}
    const owner = guild.members.get(guild.ownerID);
    const message = args.from(2)
    const embed = {
      author : {name : `Server message: ${guild.name}`, icon_url : guild.iconURL},
      description : message,
      footer : {text : client.user.username ,icon_url : client.user.avatarURL},
      color : client.config.colors.sendMsg.server
    }
    Guild.getDefaultChannel(guild,client,true).createMessage({embed}).then(() => client.createMessage(client.config.guild.notifications,{embed}))
  }
}
