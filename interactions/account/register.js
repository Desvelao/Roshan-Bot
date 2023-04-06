const Aghanim = require('aghanim')

module.exports = {
  name: 'register',
  category : 'Account',
  description : 'Register player',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'dota_id',
			description: 'User',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		}
	],
  requirements : [
    'account.not.registered'
  ],
  run: async function (interaction, client, command){
    return client.components.Account.createProcess(interaction.user.id, interaction.user.account.dota, interaction)
  }
}
