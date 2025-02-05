const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const util = require('erisjs-utils');
const enumHeroes = require('../../enums/heroes');
const { link } = require('../../helpers/markdown');

module.exports = {
  name: 'games',
  category: 'Dota 2',
  description: 'Last played games',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'user_mention',
      description: 'User mention',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    },
    {
      name: 'dota_player_id',
      description: 'User ID',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    }
  ],
  requirements: ['is.dota.player'],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_MANAGEMENT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const [profile, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_matches(interaction.ctx.profile.dotaID)
    ]);
    const spacesBoard = ['1f', '19f', '8f', '8f', '12f'];
    let table =
      util.Classes.Table.renderRow(
        [
          'dota2.wl',
          'dota2.hero',
          'dota2.kda',
          'dota2.duration',
          'dota2.matchid'
        ].map((str) =>
          client.components.Locale.translateAsScopedUser(interaction.user, str)
        ),
        spacesBoard,
        '\u2002'
      ) + '\n';
    results[1].slice(0, 8).forEach((match) => {
      if (!match) {
        return;
      }
      table +=
        util.Classes.Table.renderRow(
          [
            odutil.winOrLose(match.radiant_win, match.player_slot).slice(0, 1),
            (enumHeroes.getValue(match.hero_id) || {}).localized_name || 'none',
            match.kills + '/' + match.deaths + '/' + match.assists,
            odutil.durationTime(match.duration)
          ],
          spacesBoard,
          '\u2002'
        ) +
        '    ' +
        link(
          'https://www.dotabuff.com/matches/' + match.match_id,
          match.match_id
        ) +
        '\n';
    });

    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'interaction.games.player_info',
          description: 'interaction.games.player_info.results',
          fields: [
            {
              name: 'interaction.games.last',
              value: 'interaction.games.last.result',
              inline: false
            }
          ],
          thumbnail: { url: 'user.avatar.url' }
        }
      },
      {
        player_username: odutil.nameAndNick(results[0].profile),
        player_flag: client.components.Dota.getPlayerFlagRender(results[0]),
        player_medal: client.components.Dota.getPlayerMedalRender(
          interaction.user,
          results[0]
        ),
        player_supporter: client.components.Account.renderSupporter(profile),
        social_links: client.components.Account.socialLinks(profile),
        match_date: util.Date.custom(
          results[1][0].start_time * 1000,
          '[Y/M/D h:m:s]'
        ),
        user_avatar_url: results[0].profile.avatarmedium,
        matches: table
      }
    );
  }
};
