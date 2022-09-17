module.exports = {
  name: 'invite',
  category: 'General',
  run: async function(msg, args, client, command){
    return msg.reply('invite.text')
  }
}
