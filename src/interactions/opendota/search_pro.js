const Aghanim = require('aghanim');
const { Markdown } = require('erisjs-utils');
const odutil = require('../../helpers/opendota-utils');

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
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
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
              `**${client.components.Bot.parseText(
                odutil.nameOrNick(player),
                'nf'
              )}** ${Markdown.link(
                client.config.links.profile.dotabuff + player.account_id,
                'DB'
              )}/${Markdown.link(player.profileurl, 'S')}`
          )
          .join(', ');
        return client.components.Locale.replyInteraction(
          interaction,
          {
            embed: {
              title: 'search_pro.title',
              description: 'search_pro.description',
              footer: {
                text: 'search_pro.footer',
                icon_url: '{{{bot_avatar}}}'
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
