const Aghanim = require('aghanim');

module.exports = {
  name: 'about',
  category: 'General',
  description: 'About',
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
          title: 'interaction.about.title',
          description: 'interaction.about.description',
          fields: [
            { name: 'keyword.web', value: 'web.text', inline: false },
            {
              name: 'interaction.about.bot.title',
              value: 'interaction.about.bot.description',
              inline: false
            },
            {
              name: 'interaction.about.data.title',
              value: 'interaction.about.data.description',
              inline: false
            },
            {
              name: 'interaction.about.fields0.name',
              value: 'betatesters',
              inline: false
            }
          ],
          footer: { text: 'interaction.about.footer', icon_url: 'bot.icon' }
        }
      },
      { betatesters: client.config.others.betatesters.join(', ') }
    );
  }
};
