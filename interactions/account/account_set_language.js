const Aghanim = require('aghanim')

module.exports = {
  name: 'account_set_language',
  category : 'Account',
  description : 'Set the language for the response of interactions',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'language',
			description: 'Language',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
      choices: [ //The possible choices for the options
        {
          name: "English",
          value: "en"
        },
        {
            name: "Spanish",
            value: "es"
        },
      ]
		}
	],
  requirements: [
    'account.exist',
  ],
  run: async function (interaction, client, command){
    const language = interaction.data.options.find(option => option.name === 'language').value
    await client.components.Account.modify(interaction.user.account._id, { lang: language })
    return await client.components.Locale.replyInteraction(interaction, 'account_set_language.language_changed')
  }
}
