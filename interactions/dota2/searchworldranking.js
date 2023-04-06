const Aghanim = require('aghanim')
const { Classes } = require('erisjs-utils')

module.exports = {
  name: 'searchworldranking',
  category: 'Dota 2',
  description: 'Search a player by name in the world ranking',
  options: [
		{
			name: 'query',
			description: 'Query',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
    },
  ],
  run: async function (interaction, client, command){
    const query = interaction.data.options.find(option => option.name === 'query').value
    return client.components.WorldRankingApi.searchPlayerInWorld(query).then(r => {
      const table = new Classes.Table(['Region', 'Position'],null,['8','8r'],'\u2002')
      r.forEach(d => table.addRow([d.division,d.pos]))
      return client.components.Locale.replyInteraction(interaction, {
        embed: {
          title: 'searchworldranking.searchplayer',
          description: 'searchworldranking.resultssearchquery'
        }
      }, {
        query,
        results: table.render()
      })
    }).catch(err => {
      return client.components.Locale.replyInteraction(interaction, 'searchworldranking.errorfind', {query})
    })
  }
}
