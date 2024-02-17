const Aghanim = require('aghanim');

module.exports = {
  name: 'errors',
  category: 'General',
  description: 'Errors',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'errors.title',
        fields: [
          {
            name: 'errors.field0.name',
            value: 'errors.field0.value',
            inline: false
          },
          {
            name: 'errors.field1.name',
            value: 'errors.field1.value',
            inline: false
          }
        ],
        footer: { text: 'about.footer', icon_url: '{{{bot_icon}}}' }
      }
    });
  }
};
