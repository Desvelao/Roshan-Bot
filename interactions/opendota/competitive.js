const Aghanim = require('aghanim')
const { Classes, Markdown } = require('erisjs-utils')

module.exports = {
  name: 'competitive',
  category: 'Dota 2',
  description: 'Last results of competitive games',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    console.log('HEDAS')
    return client.components.Opendota.competitive()
      .then(results => {
        const spacesBoard = ['15f', '2f', '15f', '17f', '11f']
        let table = Classes.Table.renderRow([
          'dota2.radiant',
          'dota2.w',
          'dota2.dire',
          'dota2.league',
          'dota2.matchid'
        ].map(str => client.components.Locale._replaceContent(str, interaction.user.account.lang)), spacesBoard, '\u2002') + '\n';
        results[0].slice(0,8).forEach(match => {
          const victory = match.radiant_win ? '>>' : '<<'
          table += Classes.Table.renderRow([
            client.components.Bot.parseText(match.radiant_name, 'nf'),
            victory,
            client.components.Bot.parseText(match.dire_name, 'nf'),
            client.components.Bot.parseText(match.league_name, 'nf')
          ],spacesBoard, '\u2002') + ' ' + Markdown.link('https://www.dotabuff.com/matches/' + match.match_id, match.match_id) + '\n';    
        })
        return client.components.Locale.replyInteraction(interaction, {
          embed: {
            title: 'competitive.title',
            description: table
          }
        })
      }).catch(err => { client.components.Locale.replyInteraction(interaction, 'error.opendotarequest') })
  }
}
