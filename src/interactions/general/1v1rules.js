const Aghanim = require('aghanim');

module.exports = {
  name: '1v1rules',
  category: 'General',
  description: '1vs1 rules',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'mode',
      description: 'Mode',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: [
        //The possible choices for the options
        {
          name: 'Normal',
          value: 'normal'
        },
        {
          name: 'No Raindrop',
          value: 'nr'
        }
      ]
    }
  ],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const mode = interaction.data.options.find(
      (option) => option.name === 'mode'
    ).value;
    return client.components.Locale.replyInteraction(
      interaction,
      `1v1rules.${mode}.message`
    );
  }
};
