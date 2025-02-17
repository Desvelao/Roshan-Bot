const Aghanim = require('aghanim');

module.exports = {
  name: 'errors',
  category: 'General',
  description: 'Errors',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'global'
  },
  run: async function (interaction, client, command) {
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'interaction.errors.title',
        fields: [
          {
            name: 'interaction.errors.field0.name',
            value: 'interaction.errors.field0.value',
            inline: false
          },
          {
            name: 'interaction.errors.field1.name',
            value: 'interaction.errors.field1.value',
            inline: false
          }
        ],
        footer: { text: 'interaction.about.footer', icon_url: 'bot.icon' }
      }
    });
  }
};
