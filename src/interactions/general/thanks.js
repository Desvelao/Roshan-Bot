const Aghanim = require('aghanim');

module.exports = {
  name: 'thanks',
  category: 'General',
  description: 'Acknowledgments',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'thanks.title',
          fields: [
            {
              name: 'thanks.fields0.name',
              value: '{{{_betatesters}}}',
              inline: false
            }
          ]
        }
      },
      {
        _betatesters: client.config.others.betatesters.join(', ')
      }
    );
  }
};
