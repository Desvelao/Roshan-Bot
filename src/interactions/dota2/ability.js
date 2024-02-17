const Aghanim = require('aghanim');
const enumAbilities = require('../../enums/abilities');

module.exports = {
  name: 'ability',
  category: 'Dota 2',
  description: 'Show information about a Dota 2 ability',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'ability',
      description: 'Ability',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true
    }
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const ability = enumAbilities.getValueByName(
      interaction.data.options.find((option) => option.name === 'ability').value
    );
    console.log({ ability, url: enumAbilities.apiURL + ability.img });
    if (!ability) {
      return client.components.Locale.replyInteraction(
        interaction,
        'ability.notfound'
      );
    }
    const attributes = ability.attrib
      .map((attribute) => {
        return (
          attribute.header +
          ' ' +
          (Array.isArray(attribute.value)
            ? attribute.value.join(', ')
            : attribute.value)
        );
      })
      .join('\n');

    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        author: {
          name: ability.dname,
          url: enumAbilities.dotaWikiURL + ability.dname.replace(/ /g, '_')
        },
        description: ability.desc,
        fields: [
          ...(attributes
            ? [{ name: 'Stats', value: attributes, inline: false }]
            : []),
          ...(ability.cd
            ? [
                {
                  name: 'CD',
                  value: Array.isArray(ability.cd)
                    ? ability.cd.join(', ')
                    : ability.cd,
                  inline: true
                }
              ]
            : []),
          ...(ability.mc
            ? [
                {
                  name: '{{{emoji_mana}}}',
                  value: Array.isArray(ability.mc)
                    ? ability.mc.join(', ')
                    : ability.mc,
                  inline: true
                }
              ]
            : [])
        ],
        footer: { text: ability.lore },
        thumbnail: { url: enumAbilities.apiURL + ability.img }
      }
    });
  }
};
