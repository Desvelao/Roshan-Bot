const { Command } = require('drow')
// const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
// const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('leaderboard',{
  category : 'Dota 2', help : 'Tabla de líderes de Roshan', args : ''},
  function(msg, args, command){
    let self = this
    msg.reply(this.replace.do(lang.leaderboard,{link : this.config.links.leaderboard}))
  })
