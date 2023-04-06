const Aghanim = require('aghanim')
const { Classes } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumMedal = require('../../enums/medals')

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
			name: 'user_id',
			description: 'User ID',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false
		}
	],
  requirements: [
    'is.dota.player'
  ],
  run: async function(interaction, client, command){
    const [ player, results ] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_friends(interaction.ctx.profile.data.dota)
    ])
    const profile = player.data
    results[1] = results[1].filter(friend => friend.with_games > 0)
    const spacesBoard = ['25f', '3cf', '6cf'];
    let table = Classes.Table.renderRow([
      client.components.Bot.parseText(client.components.Locale._replaceContent('player', interaction.user.account.lang), 'nf'),
      client.components.Locale._replaceContent('games', interaction.user.account.lang).slice(0, 1),
      client.components.Locale._replaceContent('gamesWR', interaction.user.account.lang)
    ], spacesBoard, '\u2002') + '\n';
    if (results[1].length > 0) {
      results[1].forEach(friend => {
        if (table.length > client.config.constants.descriptionChars) { return }
        table += Classes.Table.renderRow([friend.personaname, friend.with_games, odutil.winratio(friend.with_win, friend.with_games - friend.with_win) + '%'], spacesBoard, '\u2002') + '\n';
      })
    }
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'withfriends.playerinfo',
        description: '{{{results}}}',
        thumbnail: {url: '{{{player_avatar}}}'},
        footer: { text: 'withfriends.footer', icon_url: '{{{bot_avatar}}}' }
      }
    }, {
      player_username: odutil.nameAndNick(results[0].profile),
      player_flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      player_medal: client.components.Locale.replacer(medal.emoji),
      player_supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      results: results[1].length > 0 ? table : client.components.Locale._replaceContent('withfriends.withno', interaction.user.account.lang),
      player_avatar: results[0].profile.avatarmedium,
      count: results[1].length > 0 ? results[1].length : '0'
    })
  }
}
