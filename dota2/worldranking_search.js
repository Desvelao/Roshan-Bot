const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
const lang = require('../lang.json')
const util = require('erisjs-utils')
const api = require('../helpers/worldranking-api')

module.exports = new Command('search',{
  subcommandFrom : 'worldranking',
  category : 'Dota 2', help : 'Clasificación mundial', args : '<zona>'},
  function(msg, args, command){
    // let self = this
    if(!args[2]){return msg.reply(lang.errorWorldBoardSearchPlayerQuery)}
    const query = args.from(2)
    api.searchPlayerInWorld(query).then(r => {
      // console.log(r);
      const table = new util.table.new([lang.region,lang.position],['8','8r'])
      r.forEach(d => table.addRow([d.division,d.pos]))
      msg.reply({embed : {
        title : lang.worldboardSeachPlayer,
        description : lang.search + ': ' + `\`${query}\`\n\n${table.do()}`,
        color : this.config.color
      }})
    }).catch(err => msg.reply(this.replace.do('errorWorldBoardSearchPlayer',{query : `\`${query}\``},true)))
  })

const replace = (text) => text.replace(/`/g,'')