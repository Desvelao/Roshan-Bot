const { Command } = require('aghanim')
const links = require('../../containers/emojis.json')

module.exports = new Command('animoji',{
  category : 'Fun', help : 'Emojis animados de Dota 2', args : '<emoji>'},
  async function(msg, args, client){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
