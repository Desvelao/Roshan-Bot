const { Command } = require('aghanim')
const odutil = require('../../helpers/opendota-utils')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const enumMedal = require('../../enums/medals')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'matches.playerinfo',
  description: '<_sociallinks>',
  fields: [
    {name: 'matches.last', value : '<_matches>', inline: false}
  ],
  thumbnail: { url: '<_player_avatar>'}
})

module.exports = new Command('matches',{
  category : 'Dota 2', help : 'Últimas partidas jugadas', args : '[mención/dotaID/pro]'},
  async function(msg, args, client){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        client.components.Opendota.player_matches(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const profile = player.data
        const spacesBoard = ['1f', '19f', '8f', '8f', '12f'];
        let table = util.Classes.Table.renderRow([args.user.langstring('dota2.wl'), args.user.langstring('dota2.hero'), args.user.langstring('dota2.kda'), args.user.langstring('dota2.duration').slice(0, 3), args.user.langstring('matchID')], spacesBoard, '\u2002') + '\n';
        results[1].slice(0,8).forEach(match => {
          if (!match) { return };
          table += util.Classes.Table.renderRow([odutil.winOrLose(match.radiant_win, match.player_slot).slice(0, 1), enumHeroes.getValue(match.hero_id).localized_name, match.kills + '/' + match.deaths + '/' + match.assists, odutil.durationTime(match.duration)], spacesBoard, '\u2002')
            + '    ' + util.Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';
        })
        const medal = enumMedal({ rank: results[0].rank_tier, leaderboard: results[0].leaderboard_rank })
        return msg.reply(embed, {
          user: odutil.nameAndNick(results[0].profile),
          flag: typeof results[0].profile.loccountrycode == 'string' ? ':flag_' + results[0].profile.loccountrycode.toLowerCase() + ':' : '',
          medal: client.locale.replacer(medal.emoji),
          supporter: client.locale.replacer(player.profile.supporter ? client.config.emojis.supporter : ''),
          _sociallinks: client.components.Account.socialLinks(profile),
          match_date: util.Date.custom(results[1][0].start_time * 1000, '[D/M/Y h:m:s]'),
          _player_avatar: results[0].profile.avatarmedium,
          _matches: table
        })
        // return msg.reply({
        //   embed: {
        //     title: odutil.titlePlayer(results, args.user.langstring('playerProfile'), client, player.profile),
        //     description: client.components.Account.socialLinks(profile),
        //     fields: [
        //       {
        //         name: args.user.langstring('recentMatches') + ' > ' + util.Date.custom(results[1][0].start_time * 1000, '[D/M/Y h:m:s]'),
        //         value: table,
        //         inline: true
        //       }
        //     ],
        //     thumbnail: { url: results[0].profile.avatarmedium, height: 40, width: 40 },
        //     footer: { text: args.user.langstring('noteData'), icon_url: client.user.avatarURL },
        //     color: client.config.color
        //   }
        // })
      })
  })
