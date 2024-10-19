const Aghanim = require('aghanim');
const { Datee, Classes } = require('erisjs-utils');

const choices = [
  {
    name: 'America',
    value: 'americas'
  },
  {
    name: 'China',
    value: 'china'
  },
  {
    name: 'Europe',
    value: 'europe'
  },
  {
    name: 'Asia',
    value: 'seasia'
  }
];

module.exports = {
  name: 'worldranking',
  category: 'Dota 2',
  description: 'Dota 2 world ranking by division',
  options: [
    {
      name: 'division',
      description: 'Division',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
      choices: choices
    }
  ],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const option = interaction.data.options.find(
      (option) => option.name === 'division'
    );
    const division = option.value;
    const divisionName = choices.find((opt) => opt.value === option.value).name;
    return client.components.WorldRankingApi.get(division)
      .then((r) => {
        const top = r.leaderboard.slice(
          0,
          client.config.constants.worldBoardTop
        );
        const table = new Classes.Table(
          ['Position', 'Player'],
          null,
          ['3f', '20f'],
          { fill: '\u2002' }
        );
        top.forEach((p, ix) => table.addRow([`#${ix + 1}`, replace(p.name)]));
        return client.components.Locale.replyInteraction(
          interaction,
          {
            embed: {
              title: 'worldranking.title',
              description: 'worldranking.description',
              footer: {
                text: Datee.custom(r.time_posted * 1000, 'h:m D/M/Y', true)
              }
            }
          },
          {
            division: divisionName,
            divisions: client.components.WorldRankingApi.divisions
              .sort()
              .join(', '),
            results: table.render()
          }
        );
      })
      .catch((err) => {
        return interaction.createMessage(
          ':x: It ocurred an error with a request to World Ranking'
        );
      });
  }
};

const replace = (text) => text.replace(/`/g, '');
