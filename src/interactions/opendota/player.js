const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const enumHeroes = require('../../enums/heroes');
const enumMedal = require('../../enums/medals');

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
      description: 'Dota player ID',
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
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    const [player, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player(interaction.ctx.profile.data.dota)
    ]);
    const profile = player.data;
    const top5Heroes = results[2].slice(0, 5).reduce((sum, el) => {
      return (
        sum +
        client.components.Locale._replaceContent(
          'top5Heroes',
          interaction.user.account.lang,
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
    const medal = enumMedal({
      rank: results[0].rank_tier,
      leaderboard: results[0].leaderboard_rank
    });
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'player.playerinfo',
          description: '{{{social_links}}}',
          fields: [
            { name: 'player.wlr', value: '{{{wlr}}}', inline: true },
            { name: 'player.kda', value: '{{{kda}}}', inline: true },
            {
              name: 'player.top5heroes',
              value: '{{{top5heroes}}}',
              inline: false
            }
          ],
          thumbnail: { url: '{{{player_avatar}}}' },
          footer: {
            text: 'opendota.notenoprivateinfo',
            icon_url: '{{{bot_avatar}}}'
          }
        }
      },
      {
        player_username: odutil.nameAndNick(results[0].profile),
        player_flag:
          typeof results[0].profile.loccountrycode == 'string'
            ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':'
            : '',
        player_medal: client.components.Locale.replacer(medal.emoji),
        player_supporter: client.components.Locale.replacer(
          player.profile.supporter ? client.config.emojis.supporter : ''
        ),
        social_links: client.components.Account.socialLinks(profile),
        player_avatar: results[0].profile.avatarmedium,
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
