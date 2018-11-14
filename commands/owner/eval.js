const { Command } = require('aghanim')
const util = require('erisjs-utils')
const { inspect } = require('util')

module.exports = new Command(['eval','e'],{
  category : 'Owner', help : '', args : '', hide : true,
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    let bot = this
    let bla = this
    const _guild = msg.channel.guild
    const _channel = msg.channel
    const _user = msg.author
    let toEval = args.from(1)
    if(toEval.includes('return')){toEval=`(function(){${toEval}})()`}
    try{
      const _message = msg
      const reply = msg.reply
      let result = eval(toEval)
      this.notifier.console('Eval', toEval)
      Promise.resolve(result).then(res => {
        if(typeof result === 'object'){
          result = inspect(result)
        }
        result = String(result).slice(0,1000)
        this.notifier.console('Eval Result', result)
        msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.accept} Resultado**\n\`\`\`js\n${result}\`\`\``)
      }).catch(err => {
        this.notifier.console('Eval Error', err)
        msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Error**\`\`\`js\n${err}\`\`\``)
      })
    }catch(err){
      this.notifier.console('Code Error', err.stack)
      msg.reply(`**Expresión**\n\`\`\`js\n${toEval}\`\`\`\n\n**${this.config.emojis.default.error} Code Error**\`\`\`js\n${err.stack}\`\`\``)
    }

  })
