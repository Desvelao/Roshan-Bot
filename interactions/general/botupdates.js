const Aghanim = require('aghanim')

module.exports = {
  name: 'whatisnew',
  category: 'General',
  description : 'What\'s new',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  customOptions: {
    'dev.forceUpdate': false
  },
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, client.cache.botPatchNotes)
  }
}
