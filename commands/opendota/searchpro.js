const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')

module.exports = {
  name: 'searchpro',
  category: 'Dota 2',
  help: 'Search pro player',
  args: '<search>',
  run: async function (msg, args, client, command){
    const query = args.slice(1).join(' ')
    if(query.length < 2){return msg.reply('errorSearchMinChars')}
    return client.components.Opendota.getProPlayersDotaName(query)
      .then((players) => {
        const text = players.map((player) => `**${client.components.Bot.parseText(odutil.nameOrNick(player),'nf')}** ${Markdown.link(this.client.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
        return msg.reply({
          embed: {
            title: 'searchpro.title',
            description: 'searchpro.description',
            footer: { text: 'searchpro.footer', icon_url: '<bot_avatar>' }
          }
        }, {
          query: query,
          text: text,
          match: players.length
        })
      })
  }
}
