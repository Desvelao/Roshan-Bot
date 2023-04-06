const Aghanim = require('aghanim')

module.exports = {
  name: 'invite',
  category: 'General',
  description: 'Invite',
	type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function(interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, 'invite.text')
  }
}
