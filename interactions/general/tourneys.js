const Aghanim = require('aghanim')

const util = require('erisjs-utils')

module.exports = {
  name: 'tourneys',
  category: 'General',
  description : 'Information about Dota 2 subreddit',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'tournament',
			description: 'Tournament',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false, 
		}
	],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function(interaction, client, command){
    const tournament = interaction.data.options ? interaction.data.options.find(option => option.name === 'tournament').value : null

    if(!tournament){
      let tourneys_playing = client.cache.tourneys.getPlaying()
      let tourneys_next = client.cache.tourneys.getNext()
      let fields = []
      if (tourneys_playing.length && !tourneys_next.length) { return client.components.Locale.replyInteraction(interaction, 'tourneys.error.noevents')}
      if(tourneys_playing.length){
        tourneys_playing.sort(sortTourneysPlaying)
        fields.push({ name: interaction.user.locale('tourneys.now',{events : tourneys_playing.length}), value : tourneys_playing.map(t => `**${t._id}**${t.finish ? ' \`' + util.Date.custom(parseInt(t.finish)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      if(tourneys_next.length){
        tourneys_next.sort(sortTourneysNext)
        fields.push({name: interaction.user.locale('tourneys.next',{events : tourneys_next.length}), value : tourneys_next.map(t => `**${t._id}**${t.until ? ' \`' + util.Date.custom(parseInt(t.until)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      fields.push({name : interaction.user.locale('tourneys.suggestion'), value : client.config.links.web_addtourney, inline : false})

      return client.components.Locale.replyInteraction(interaction, {
        embed : {
          title : 'tourneys.title',
          fields : fields
        }
      })
    }else{
      const search = tournament
      const tourney = client.cache.tourneys.find(t => t._id.toLowerCase() === search.toLowerCase())
      if (!tourney) { return client.components.Locale.replyInteraction(interaction, 'tourneys.error.search',{search})}
      let fields = []
      if (tourney.start) { fields.push({ name: interaction.user.locale('tourneys.begin'), value : util.Date.custom(parseInt(tourney.start)*1000,'D/M',true), inline : true})}
      if (tourney.finish) { fields.push({ name: interaction.user.locale('tourneys.finish'), value : util.Date.custom(parseInt(tourney.finish)*1000,'D/M',true), inline : true})}
      if (tourney.until) { fields.push({ name: interaction.user.locale('tourneys.until'), value : util.Date.custom(parseInt(tourney.until)*1000,'D/M',true), inline : true})}
      if (tourney.link) { fields.push({ name: interaction.user.locale('global.link'), value : tourney.link, inline : true})}
      return client.components.Locale.replyInteraction(interaction, {embed : {
        title : `${tourney._id}${tourney.by ? ' (' + tourney.by +')' : ''}`,
        description : tourney.info || '',
        fields : fields.length ? fields : null,
        thumbnail : {
          url : tourney.img,
          height : 40,
          width : 40
        }
      }})
    }
  }
}

function sortTourneysNext(a,b){
  if(a.start && b.start){
    return a.start - b.start
  }else if(a.start && b.until){
    return a.start - b.until
  }else if(a.until && b.start){
    return a.until - b.start
  }else if(a.start && (!b.start && !b.until)){
    return -1
  }else if(b.start && (!a.start && !a.until)){
    return 1
  }else if(a.until && b.until){
    return a.until - b.until
  }else if(a._id.toLowerCase() > b._id.toLowerCase()){return -1}
  else if(a._id.toLowerCase() > b._id.toLowerCase()){return 1}
  else{return 0}
}

function sortTourneysPlaying(a,b){
  if(a.finish && b.finish){
    return a.finish - b.finish
  }else if(a.start && b.finish){
    return a.start - b.finish
  }else if(a.finish && b.start){
    return a.finish - b.start
  }else if(a.start && b.start){
    return a.start - b.start
  }else if(a._id.toLowerCase() > b._id.toLowerCase()){return -1}
  else if(a._id.toLowerCase() > b._id.toLowerCase()){return 1}
  else{return 0}
}
