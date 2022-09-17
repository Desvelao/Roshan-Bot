module.exports = {
  name: ['donate', 'kofi'],
  category: 'General',
  run: async function(msg, args, client, command){
    return msg.reply('donate.text')
  }
}
