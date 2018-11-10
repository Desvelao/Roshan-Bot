const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const links = require('../../containers/stickers.json')

module.exports = new Command('sticker',{
  category : 'Fun', help : 'Pegatinas de Dota 2', args : '<sticker>'},
  function(msg, args, command){
    return basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
