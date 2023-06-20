const paintjimp = require('../../paintjimp')
const Aghanim = require('aghanim')

module.exports = {
  name: 'playercard',
  category: 'Account',
  description: 'Show the player card',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  requirements: [
    'account.exist',
    // TODO: fix user cooldown check
    {
      type: 'user.cooldown',
      time: 10,
      // response: (interaction, client, command, req) => client.components.Locale.replyInteraction(interaction, 'cmd.incooldown', {cd : interaction.ctx.reqUserCooldown.cooldown, username: interaction.ctx.reqUserCooldown.user})
      response: (interaction, client, command, req) => interaction.user.locale('cmd.incooldown', {cd : interaction.ctx.reqUserCooldown.cooldown, username: interaction.ctx.reqUserCooldown.user})
    }
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command){
    const { account } = interaction.ctx
    if(account.card.heroes.split('').length < 1){
      return client.components.Opendota.card_heroes(account.dota).then(results => {
        account.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
        account.card.pos = 'all'
        return paintjimp.card([results[0],account.card])})
      .then(buffer => client.components.Locale.replyInteraction(interaction, {
        file: {file : buffer, name : interaction.user.username + '_roshan_card.png'}
      }))
      .catch(err => client.components.Locale.replyInteraction(interaction, 'error.opendotarequest'))
    }else{
      return client.components.Opendota.card(account.dota)
        .then(results => paintjimp.card([...results,account.card]))
        .then(buffer => client.components.Locale.replyInteraction(interaction, {
          file: {file : buffer, name : interaction.user.username + '_roshan_card.png'}
        }))
        .catch(err => client.components.Locale.replyInteraction(interaction, 'errorOpendotaRequest'))
    }
  }
}
