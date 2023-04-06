const Aghanim = require('aghanim')

module.exports = {
  name: 'getstarted',
  category: 'Server',
  description: 'Get started information',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, 'getstarted.text')
  }
}
