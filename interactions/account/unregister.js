const Aghanim = require('aghanim')

module.exports = {
  name: 'unregister',
  category : 'Account',
  description : "Delete your Roshan's account",
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  requirements: ['account.exist'],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DEV_SERVER_ID]
  },
  run: async function (interaction, client, command){
    return client.components.Account.deleteProcess(interaction.user.account._id, interaction)
  }
}
