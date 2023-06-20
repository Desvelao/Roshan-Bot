const Aghanim = require('aghanim')

module.exports = {
  name: 'donate',
  category: 'General',
  description : 'Donate',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function(interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, 'donate.text')
  }
}
