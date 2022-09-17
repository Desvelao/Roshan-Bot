const links = require('../../containers/memes.json')

module.exports = {
  name: 'meme',
  category: 'Fun',
  help : 'Dota 2 meme',
  args : '<meme>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
