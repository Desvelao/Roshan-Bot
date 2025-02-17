const Aghanim = require('aghanim');

module.exports = {
  name: 'leaderboard',
  category: 'Dota 2',
  description: 'Leaderboard',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'global'
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(
      interaction,
      'interaction.leaderboard.text'
    );
  }
};
