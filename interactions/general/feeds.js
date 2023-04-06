const Aghanim = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')

module.exports = {
  name: 'feeds',
  category: 'General',
  description : 'Last feeds',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    const feeds = client.cache.feeds.order().slice(0,8)
    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'feeds.title',
        description: '{{{_feeds_description}}}',
        fields : [
          {name: 'feeds.more', value: '{{{link_web_feeds}}}', inline: false}
        ]
      }
    },{
      _feeds_description: feeds.map(feed => `\`${Datee.custom(parseInt(feed._id) * 1000, 'Y/M/D h:m', true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + Markdown.link(feed.link, ':link:') : ''}`).join('\n')
    })
  }
}
