module.exports = {
  name: 'leaderboard',
  category: 'Dota 2',
  run: async function (msg, args, client, command){
    return msg.reply('leaderboard.text')
  }
}
