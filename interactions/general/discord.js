const Aghanim = require('aghanim')

module.exports = {
  name: 'discord',
  category: 'General',
  description : 'Discord',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    return client.components.Locale.replyInteraction(interaction, 'discord.devserverinvite')
  }
}
