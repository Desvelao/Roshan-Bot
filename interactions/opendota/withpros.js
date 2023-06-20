const Aghanim = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const enumMedal = require('../../enums/medals')

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
			description: 'Dota player ID',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false
		}
	],
  requirements: [
    'is.dota.player'
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function(interaction, client, command){
    const [ player, results ] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_pros(interaction.ctx.profile.data.dota)
    ])
    const profile = player.data
    const resultsTotal = results[1].length;
    results[1].sort(function () { return .5 - Math.random() });
    let resultsShow = 0;
    let description = '';
    results[1].forEach(pro => {
      if (description.length > client.config.constants.descriptionChars) { return }
      if (pro.team_tag != null) {
        description += '**' + client.components.Bot.parseText(pro.name, 'nf') + '** (' + client.components.Bot.parseText(pro.team_tag, 'nf') + '), ';
      } else { description += '**' + client.components.Bot.parseText(pro.name, 'nf') + '**, '; }
      resultsShow++
    })
    description = description.slice(0, -2)
    description = description || client.components.Locale._replaceContent('withpros.withno', interaction.user.account.lang)
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'withpros.playerinfo',
        description: '{{{results}}}',
        thumbnail: {url: '{{{player_avatar}}}'},
        footer: { text: 'withpros.footer', icon_url: '{{{bot_avatar}}}' }
      }
    }, {
      player_username: odutil.nameAndNick(results[0].profile),
      player_flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      player_medal: client.components.Locale.replacer(medal.emoji),
      player_supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      results: description,
      player_avatar: results[0].profile.avatarmedium,
      count: resultsShow !== resultsTotal ? resultsShow + "/" + resultsTotal : results[1].length
    })
  }
}
