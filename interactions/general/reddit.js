const Aghanim = require('aghanim')

module.exports = {
  name: 'reddit',
  category: 'General',
  description : 'Information about Reddit',
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
    const mode = interaction.data.options.find(option => option.name === 'mode')
    if(mode){
      return client.components.RedditApi.posts(mode.value,5,'reddit').then(result => {
        return interaction.createMessage({
          embed: {
            author: { name: `reddit - ${mode.value}`, /*icon_url: '<image_reddit_dota2>'*/ },
            description: result
          }
        })
      }).catch(err => {
        return client.components.Locale.replyInteraction(interaction, 'reddit.error.postsrequest')
      })
    }else{
      const postID = interaction.data.options.find(option => option.name === 'post_id')
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
    }
  }
}
