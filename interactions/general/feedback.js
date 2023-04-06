const Aghanim = require('aghanim')

// TODO: check functionality

module.exports = {
  name: 'feedback',
  category: 'General',
  description : 'Give feedback',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'message',
			description: 'Message',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		}
	],
  requirements: [
    {
      validate: (msg, args) => args.length > 4,
      response: (msg, args) => msg.author.locale('feedback.minimum_words')
    }
  ],
  run: async function (interaction, client, command){
    const message = interaction.data.options.find(option => option.name === 'message').value
    await client.createMessage(client.config.guild.bugs, {embed : {
      title : 'Feedback',
      description : message,
      footer : {text : msg.author.username, icon_url : msg.author.avatarURL},
      color : client.config.color}
    })
    return client.components.Locale.replyInteraction(interaction, 'feedback.message_sent')
  }
}
