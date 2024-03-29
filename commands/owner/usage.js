const { Os, Number } = require('erisjs-utils')
const util = require('erisjs-utils')
const os = require('os')

module.exports = {
  name: 'usage',
  category : 'Owner',
  help : 'Bot usage stats',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    Os.getCPUUsage(cpuusage => {
      msg.reply({embed : {
        title : `Rendimiento - ${os.platform()}`,
        fields : [
          {name : 'CPU', value : `${(cpuusage*100).toFixed(2)}%`, inline : true},
          {name : 'RAM', value : `${Os.bytesConvert(os.totalmem()-os.freemem(),'MB')} / ${Os.bytesConvert(os.totalmem(),'MB')} MB`, inline : true}
          // {name : , value : , inline : true}
        ],
        footer : {text : `Despierto ${secondsTohms(Math.floor(process.uptime()))}`, icon_url : client.user.avatarURL},
        color : client.config.color
      }})
    })
  }
}


function secondsTohms(seconds) {
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${Number.zerofication(hours)}:${Number.zerofication(minutes)}:${Number.zerofication(seconds)}`
}