const Aghanim = require('aghanim')

module.exports = {
  name: 'reddit_dota2',
  category: 'General',
  description : 'Information about Dota 2 subreddit',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'mode',
			description: 'Mode',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false,
      choices: [ //The possible choices for the options
          {
              name: "top",
              value: "top"
          },
          {
              name: "hot",
              value: "hot"
          },
          {
              name: "new",
              value: "new"
          }
      ]
		},
    {
			name: 'post_id',
			description: 'Post ID',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false
		}
	],
  run: async function (interaction, client, command){
    // TODO: request is failing to get the data
    const mode = interaction.data.options && interaction.data.options.find(option => option.name === 'mode')
    const postID = interaction.data.options && interaction.data.options.find(option => option.name === 'post_id')
    if(mode){
      return client.components.RedditApi.posts(mode.value,5,'dota2').then(result => {
        return interaction.createMessage({
          embed: {
            author: { name: `r/Dota2 - ${mode.value}`, /*icon_url: '<image_reddit_dota2>'*/ },
            description: result
          }
        })
      }).catch(err => {
        return client.components.Locale.replyInteraction(interaction, 'reddit.error.postsrequest')
      })
    }else if(postID){
      return client.components.RedditApi.post(postID.value).then(result => {
        return interaction.createMessage({
          embed: {
            author: { name: result.title.slice(0, 255), url: result.link, icon_url: client.config.images.reddit },
            description: result.text,
            footer: { text: result.subreddit }
          }
        })
      }).catch(err => {
        return client.components.Locale.replyInteraction(interaction, 'reddit.error.postrequest')
      })
    }else{
      const mode = 'top';
      return client.components.RedditApi.posts(mode,5,'dota2').then(result => {
        return interaction.createMessage({
          embed: {
            author: { name: `r/Dota2 - ${mode}`, /*icon_url: '<image_reddit_dota2>'*/ },
            description: result
          }
        })
      }).catch(err => {
        return client.components.Locale.replyInteraction(interaction, 'reddit.error.postsrequest')
      })
    }
  }
}
