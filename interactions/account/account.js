const Aghanim = require('aghanim')

module.exports = {
  optionsRest: {
    dev: {
      forceUpdate: false
    }
  },
  name: 'account',
  category : 'Account',
  description : 'Show your account info',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'user_id',
			description: 'User',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false,
		},
    {
			name: 'user_mention',
			description: 'User',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.USER,
			required: false,
		}
	],
  requirements: ['account.existany'],
  run: async function(interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, {embed: {
      title: 'account.title',
      description: 'account.data',
      thumbnail: { url: '{{{user_avatar_url}}}' }
    }},{
      supporter: interaction.ctx.user.supporter ? `\n${client.config.emojis.bot.cheesed2}` : '',
      user_id: interaction.ctx.account._id,
      user_name: interaction.ctx.user.username,
      user_account_dota: interaction.ctx.account.dota,
      user_account_steam: interaction.ctx.account.steam,
      user_account_lang: interaction.ctx.account.lang,
      user_avatar_url: interaction.ctx.user.avatarURL,
    })
  }
}

