const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');
const enumMedal = require('../../enums/medals');
const { link } = require('../../helpers/markdown');

module.exports = {
  name: 'steam',
  category: 'Dota 2',
  description: 'Steam player URL',
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
    const [profile, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_steam(interaction.ctx.profile.dotaID)
    ]);
    const medal = enumMedal({
      rank: results[0].rank_tier,
      leaderboard: results[0].leaderboard_rank
    });
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'steam.playerinfo',
          description: 'steam.description'
          // footer: { text: 'searchpro.footer', icon_url: '<bot_avatar>' }
        }
      },
      {
        player_username: odutil.nameAndNick(results[0].profile),
        player_flag:
          typeof results[0].profile.loccountrycode == 'string'
            ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':'
            : '',
        player_medal: client.components.Locale.translateAsScopedUser(
          interaction.user,
          medal.emoji
        ),
        player_supporter: profile.supporter
          ? client.components.Locale.translateAsScopedUser(
              interaction.user,
              '{{{emoji_cheesed2}}}'
            )
          : '',
        profile: odutil.nameAndNick(results[0].profile),
        link: link(
          results[0].profile.profileurl,
          client.components.Locale.translateAsScopedUser(
            interaction.user,
            'global.steam'
          )
        ),
        url: results[0].profile.profileurl
      }
    );
  }
};
