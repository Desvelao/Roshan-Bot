const Aghanim = require('aghanim');
const { Classes } = require('erisjs-utils');
const odutil = require('../../helpers/opendota-utils');

module.exports = {
  name: 'withfriends',
  category: 'Dota 2',
  description: 'Stats of last games played with friends',
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
      description: 'Dota player ID or PRO name',
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
      client.components.Opendota.player_friends(interaction.ctx.profile.dotaID)
    ]);
    results[1] = results[1].filter((friend) => friend.with_games > 0);
    const spacesBoard = ['25f', '3cf', '6cf'];
    let table =
      Classes.Table.renderRow(
        [
          odutil.parseText(
            client.components.Locale.translateAsScopedUser(
              interaction.user,
              'player'
            ),
            'nf'
          ),
          client.components.Locale.translateAsScopedUser(
            interaction.user,
            'games'
          ).slice(0, 1),
          client.components.Locale.translateAsScopedUser(
            interaction.user,
            'game.win_ratio'
          )
        ],
        spacesBoard,
        '\u2002'
      ) + '\n';
    if (results[1].length > 0) {
      results[1].forEach((friend) => {
        if (table.length > client.config.constants.descriptionChars) {
          return;
        }
        table +=
          Classes.Table.renderRow(
            [
              friend.personaname,
              friend.with_games,
              odutil.winratio(
                friend.with_win,
                friend.with_games - friend.with_win
              ) + '%'
            ],
            spacesBoard,
            '\u2002'
          ) + '\n';
      });
    }
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'interaction.withfriends.playerinfo',
          description: 'interaction.withfriends.results',
          thumbnail: { url: 'user.avatar.url' },
          footer: {
            text: 'interaction.withfriends.footer'
          }
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
        interaction_withfriends_results:
          results[1].length > 0
            ? table
            : client.components.Locale.translateAsScopedUser(
                interaction.user,
                'interaction.withfriends.withno'
              ),
        user_avatar_url: results[0].profile.avatarmedium,
        count: results[1].length > 0 ? results[1].length : '0'
      }
    );
  }
};
