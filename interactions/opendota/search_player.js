const Aghanim = require('aghanim')
const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const axios = require('axios')

module.exports = {
  name: 'search_player',
  category: 'Dota 2',
  description: 'Search a player',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'query',
			description: 'Query',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true
		}
	],
  run: async function(interaction, client, command){
    const query = interaction.data.options.find(option => option.name === 'query').value
    return client.components.Opendota.getPlayersDotaName(query).then((players) => {
      if(players.length < 1){return}
      const playersTotal = players.length
      const limit = 10
      players.sort(function(a,b) {
        return b.similarity - a.similarity})
      if(players.length > limit){
        players = players.slice(0,limit)
      }
      const playersShow = players.length;
      const urls = players.map(player => 'https://api.opendota.com/api/players/' + player.account_id);
      return Promise.all(urls.map(url => axios.get(url))).then((player_profiles) => {
        const results = player_profiles
          .map(({data: {profile}}) => `**${client.components.Bot.parseText(odutil.nameOrNick(profile),'nf')}** ${Markdown.link(client.config.links.profile.dotabuff+profile.account_id,'DB')}/${Markdown.link(profile.profileurl,'S')}`).join(', ');
        return client.components.Locale.replyInteraction(interaction, {
          embed: {
            title: 'search_player.title',
            description: 'search_player.description',
            footer: {text : 'search_player.footer', icon_url : '{{{bot_avatar}}}'}
          }
        },{
          query,
          results,
          count: playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow
        })
      })
    })
  }
}
