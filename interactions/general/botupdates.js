const Aghanim = require('aghanim')

module.exports = {
  name: 'botupdates',
  category: 'General',
  description : 'Bot updates',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, client.cache.botPatchNotes)
  }
}
