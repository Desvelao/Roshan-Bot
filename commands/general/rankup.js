const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'rankup',
  category: 'General',
  run: async function (msg, args, client, command){
    client.sendChannelTyping(msg.channel.id)
    return fs.promises.readFile(path.join(__dirname, '../..', '/img/rankup.png'))
      .then(data => msg.reply('RankUp', {}, {file : data, name :'rankup.png'}))
  }
}