const Aghanim = require('aghanim');

module.exports = {
  name: 'donate',
  category: 'General',
  description: 'Donate',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'global'
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(
      interaction,
      'interaction.donate.text'
    );
  }
};
