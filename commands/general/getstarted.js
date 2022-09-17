module.exports = {
  name: 'getstarted',
  category: 'Server',
  run: async function (msg, args, client, command){
    return msg.reply('getstarted.text')
  }
}
