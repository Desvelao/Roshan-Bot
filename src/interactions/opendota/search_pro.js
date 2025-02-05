const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const { link } = require('../../helpers/markdown');

module.exports = {
  name: 'search_pro',
  category: 'Dota 2',
  description: 'Search pro player',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'query',
      description: 'Query',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true
    }
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_MANAGEMENT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const query = interaction.data.options.find(
      (option) => option.name === 'query'
    ).value;
    return client.components.Opendota.getProPlayersDotaName(query).then(
      (players) => {
        const results = players
          .map(
            (player) =>
              `**${odutil.parseText(odutil.nameOrNick(player), 'nf')}** ${link(
                client.components.Opendota.getProfileURL(profile.account_id),
                'OD'
              )}/${link(player.profileurl, 'S')}`
          )
          .join(', ');
        return client.components.Locale.replyInteraction(
          interaction,
          {
            embed: {
              title: 'interaction.search_pro.title',
              description: 'interaction.search_pro.description',
              footer: {
                text: 'interaction.search_pro.footer'
              }
            }
          },
          {
            query,
            results,
            count: players.length
          }
        );
      }
    );
  }
};
