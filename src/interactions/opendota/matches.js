const Aghanim = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const enumMedal = require('../../enums/medals')

module.exports = {
  name: 'matches',
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
    const [player, results] = await Promise.all([
      interaction.ctx.profile,
      client.components.Opendota.player_matches(interaction.ctx.profile.data.dota)
    ])
    const profile = player.data
    const spacesBoard = ['1f', '19f', '8f', '8f', '12f'];
    let table = util.Classes.Table.renderRow([
      'dota2.wl',
      'dota2.hero',
      'dota2.kda',
      'dota2.duration',
      'dota2.matchid'].map(str => client.components.Locale._replaceContent(str, interaction.user.account.lang)), spacesBoard, '\u2002') + '\n';
    results[1].slice(0,8).forEach(match => {
      if (!match) { return };
      table += util.Classes.Table.renderRow([
        odutil.winOrLose(match.radiant_win, match.player_slot).slice(0, 1),
        (enumHeroes.getValue(match.hero_id) || {}).localized_name || 'none',
        match.kills + '/' + match.deaths + '/' + match.assists,
        odutil.durationTime(match.duration)
      ], spacesBoard, '\u2002')
        + '    ' + util.Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';
    })
    const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'matches.playerinfo',
        description: '{{{social_links}}}',
        fields: [
          {name: 'matches.last', value : '{{{matches}}}', inline: false}
        ],
        thumbnail: { url: '{{{player_avatar}}}'}
      }
    }, {
      player_username: odutil.nameAndNick(results[0].profile),
      player_flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
      player_medal: client.components.Locale.replacer(medal.emoji),
      player_supporter: client.components.Locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
      social_links: client.components.Account.socialLinks(profile),
      match_date: util.Date.custom(results[1][0].start_time * 1000, '[D/M/Y h:m:s]'),
      player_avatar: results[0].profile.avatarmedium,
      matches: table
    })
  }
}
