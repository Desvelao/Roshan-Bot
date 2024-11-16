const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const { link } = require('../../helpers/markdown');

module.exports = {
  name: 'search_player',
  category: 'Dota 2',
  description: 'Search a player',
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
    return client.components.Opendota.getPlayersDotaName(query).then(
      (players) => {
        if (players.length < 1) {
          return;
        }
        const playersTotal = players.length;
        const limit = 10;
        players.sort(function (a, b) {
          return b.similarity - a.similarity;
        });
        if (players.length > limit) {
          players = players.slice(0, limit);
        }
        const playersShow = players.length;
        const urls = players.map(
          (player) =>
            'https://api.opendota.com/api/players/' + player.account_id
        );
        return Promise.all(
          urls.map((url) => client.httpClient.fetch('get', url))
        ).then((player_profiles) => {
          const results = player_profiles
            .map(
              ({ profile }) =>
                `**${odutil.parseText(
                  odutil.nameOrNick(profile),
                  'nf'
                )}** ${link(
                  client.config.links.profile.dotabuff + profile.account_id,
                  'DB'
                )}/${link(profile.profileurl, 'S')}`
            )
            .join(', ');
          return client.components.Locale.replyInteraction(
            interaction,
            {
              embed: {
                title: 'interaction.search_player.title',
                description:
                  'interaction.interaction.search_player.description',
                footer: {
                  text: 'interaction.interaction.search_player.footer'
                }
              }
            },
            {
              query,
              results,
              count:
                playersShow !== playersTotal
                  ? playersShow + '/' + playersTotal
                  : playersShow
            }
          );
        });
      }
    );
  }
};
