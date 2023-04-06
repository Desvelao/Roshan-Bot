const paintjimp = require('../../paintjimp')
const Aghanim = require('aghanim')

module.exports = {
  name: 'playercard',
  category: 'Account',
  help: 'Show the player card',
  description: 'Show the player card',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  requirements: [
    'account.exist',
    // TODO: enable
    // {
    //   type: 'user.cooldown',
    //   time: 10,
    //   response: (msg, args, client, command, req) => msg.author.locale('cmd.incooldown', {cd : args.reqUserCooldown.cooldown, username: args.reqUserCooldown.user})
    // }
  ],
  run: async function (interaction, client, command){
    const { account } = args
    console.log({interaction});
    if(account.card.heroes.split('').length < 1){
      return client.components.Opendota.card_heroes(account.dota).then(results => {
        account.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
        account.card.pos = 'all'
        return paintjimp.card([results[0],account.card])})
      .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
      .then(m => client.components.Locale.replyInteraction(interaction, {
        embed: {
          image: {url: '<_image>'},
        }
      }, {
          _image : m.attachments[0].url
        }))
      .catch(err => {
        return msg.reply('error.opendotarequest')
      })
    }else{
      return client.components.Opendota.card(account.dota).catch(err => {return msg.reply('errorOpendotaRequest') })
        .then(results => paintjimp.card([...results,account.card]))
        .then(buffer => client.createMessage(client.config.guild.generated,'',{file : buffer, name : msg.author.username + '_roshan_card.png'}))
        .then(m => client.components.Locale.replyInteraction(interaction, {
          embed: {
            description: 'playercard.title',
            image: { url: '<_image>' },
          }
        }, {
            username: msg.author.username,
            social_links: client.components.Account.socialLinks(account),
            _image : m.attachments[0].url
          }))
    }
  }
}
