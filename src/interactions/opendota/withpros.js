const Aghanim = require('aghanim');
const odutil = require('../../helpers/opendota-utils');

module.exports = {
  name: 'withpros',
  category: 'Dota 2',
  description: 'Pro players you played with',
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
      client.components.Opendota.player_pros(interaction.ctx.profile.dotaID)
    ]);
    const resultsTotal = results[1].length;
    results[1].sort(function () {
      return 0.5 - Math.random();
    });
    let resultsShow = 0;
    let description = '';
    results[1].forEach((pro) => {
      if (description.length > client.config.constants.descriptionChars) {
        return;
      }
      if (pro.team_tag != null) {
        description +=
          '**' +
          odutil.parseText(pro.name, 'nf') +
          '** (' +
          odutil.parseText(pro.team_tag, 'nf') +
          '), ';
      } else {
        description += '**' + odutil.parseText(pro.name, 'nf') + '**, ';
      }
      resultsShow++;
    });
    description = description.slice(0, -2);
    description =
      description ||
      client.components.Locale.translateAsScopedUser(
        interaction.user,
        'interaction.withpros.withno'
      );
    return client.components.Locale.replyInteraction(
      interaction,
      {
        embed: {
          title: 'interaction.withpros.playerinfo',
          description: '{{{results}}}',
          thumbnail: { url: '{{{player_avatar}}}' },
          footer: {
            text: 'interaction.withpros.footer'
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
        results: description,
        player_avatar: results[0].profile.avatarmedium,
        count:
          resultsShow !== resultsTotal
            ? resultsShow + '/' + resultsTotal
            : results[1].length
      }
    );
  }
};
