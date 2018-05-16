const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('logs',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Ve el registro de eventos del bol', args : '',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    this.logger.overview(msg);
  })
