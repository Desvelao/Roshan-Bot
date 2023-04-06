const Aghanim = require('aghanim')

module.exports = {
  name: 'account',
  category : 'Account',
  description : 'Show your account info',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  requirements: ['account.exist'],
  run: async function(interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, {embed: {
      title: 'account.title',
      description: 'account.data',
      thumbnail: { url: '{{{user_avatar_url}}}' }
    }},{
      supporter: interaction.member.user.supporter ? `\n${client.config.emojis.bot.cheesed2}` : ''
    })
  }
}

