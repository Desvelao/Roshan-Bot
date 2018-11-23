const { Command } = require('aghanim')
const on = 'on'
const off = 'off'

module.exports = new Command('notifications',{subcommandFrom : 'server',
  category : 'Server', help : 'Configuración de notificaciones', args : '<on,off,[channel]>',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    // let self = this
    if(args[2] === on){
      return this.cache.servers.save(msg.channel.guild.id,{notifications : {enable : true}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }else if(args[2] === off){
      return this.cache.servers.save(msg.channel.guild.id,{notifications : {enable : false}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }else{
      const match = msg.content.match(new RegExp('<#(\\d*)>'));
      if(!match){return};
      const channel = msg.channel.guild.channels.get(match[1]);
      if(!channel){return};
      return this.cache.servers.save(msg.channel.guild.id,{notifications : {channel : match[1]}}).then((newElement) => msg.addReaction(this.config.emojis.default.accept))
    }
  })
