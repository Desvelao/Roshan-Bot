module.exports = {
  name: 'underlords',
  childOf: 'reddit',
  category: 'General',
  help: 'Information about Underlords subreddit',
  args: '[idpost,top,hot,new]',
  run: async function (msg, args, client, command){
    const query = args[2] || 'top'
    if(['top','hot','new'].indexOf(query.toLowerCase()) > -1){
      client.sendChannelTyping(msg.channel.id);
      return client.components.RedditApi.posts(query, 5,'underlords').then(result => {
        return msg.reply({
          embed: {
            author: { name: 'r/Dota Underlords - <_category>', icon_url: '<image_reddit_dota_underlords>' },
            description: '<_message>'
          }
        },{
          _category: query,
          _message: result
        })
      }).catch(err => {
        return msg.reply('reddit.error.postsrequest')
      })
    }else{
      client.sendChannelTyping(msg.channel.id);
      return client.components.RedditApi.post(query).then(result => {
        return msg.reply({
          embed: {
            author: { name: '<_post_title>', url: '<_post_url>', icon_url: '<_reddit_icon>' },
            description: '<_post_text>',
            footer: { text: '<_post_subreddit>' }
          }
        },{
          _post_title: result.title.slice(0, 255),
          _post_url: result.link,
          _reddit_icon: client.config.images.reddit,
          _post_text: result.text,
          _post_subreddit: result.subreddit
        })
      }).catch(err => {
        return msg.reply('reddit.error.postrequest')
      })
    }
  }
}
