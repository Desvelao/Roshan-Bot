const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const enumHeroes = require('../../enums/heroes');

module.exports = {
  name: ['player', 'p'],
  category: 'Dota 2',
  description: 'Information about a player',
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
    type: 'global'
  },
  run: async function (interaction, client, command) {
    const [profile, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player(interaction.ctx.profile.dotaID)
    ]);
    const top5Heroes = results[2].slice(0, 5).reduce((sum, el) => {
      return (
        sum +
        client.components.Locale.translateAsScopedUser(
          interaction.user,
          'top5Heroes',
          {
            hero: enumHeroes.getValue(el.hero_id).localized_name,
            wr: odutil.winratio(el.win, el.games - el.win),
            games: el.games
          }
        ) +
        '\n'
      );
    }, '');
    const kda = odutil.kda(
      results[3][0].sum,
      results[3][1].sum,
      results[3][2].sum
    );

    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'interaction.player.player_info',
          description: 'interaction.player.player_info.results',
          fields: [
            {
              name: 'interaction.player.wlr',
              value: 'interaction.player.wlr.result',
              inline: true
            },
            {
              name: 'interaction.player.kda',
              value: 'interaction.player.kda.result',
              inline: true
            },
            {
              name: 'interaction.player.top_5_heroes',
              value: 'interaction.player.top_5_heroes.results',
              inline: false
            }
          ],
          thumbnail: { url: 'user.avatar.url' },
          footer: {
            text: 'dota2.note_no_private_info'
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
        social_links: client.components.Account.socialLinks(profile),
        user_avatar_url: results[0].profile.avatarmedium,
        wlr:
          results[1].win +
          '/' +
          results[1].lose +
          ' (' +
          odutil.winratio(results[1].win, results[1].lose) +
          '%)',
        kda:
          results[3][0].sum +
          '/' +
          results[3][1].sum +
          '/' +
          results[3][2].sum +
          ' (' +
          kda +
          ')',
        top5heroes: top5Heroes
      }
    );
  }
};
