const Aghanim = require('aghanim');

module.exports = {
  name: 'patch',
  description: 'Current Dota 2 patch',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  async run(interaction, client) {
    return interaction.createMessage(client.cacheManager.get('dota2Patch'));
  }
};
