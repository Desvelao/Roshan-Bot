
const links = require('../../containers/charms.json')

module.exports = {
  name: 'anicharm',
  category: 'Fun',
  help: 'Foil animate emoji of Dota 2',
  args: '<emoji>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
