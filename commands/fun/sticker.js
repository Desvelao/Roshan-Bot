
const links = require('../../containers/stickers.json')

module.exports = {
  name: 'sticker',
  category: 'Fun',
  help: 'Dota 2 sticker',
  args: '<sticker>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
