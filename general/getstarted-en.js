const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('getstarted-en',{
  category : 'General', help : 'Configuración de servidor', args : ''},
  function(msg, args, command){
    msg.reply(':flag_gb: __**SERVER GUIDE**__\n\n:small_blue_diamond: __**Requirements**__\nFor administrate the server options is necessary to create a role called **Aegis** and servers admins have this role, so they can configure Roshan.\n\n:small_blue_diamond: __**Features**__\n:white_small_square: **feeds**: specific accounts tweets (configurable).\n:white_small_square: important **notifications** about bot.\n:white_small_square: **delete messages** with command `r!del [messages number]` - max. 100\n:white_small_square: **pin/unpin** messages reactioning with :pin: (Roshan should have **manage messages** permission)\n:white_small_square: **giveaways** `r!giveaway [roles]`\n\n__**Help command**__: `r!help server`\n\n:small_blue_diamond: __**Server configuration**__\n\n`r!server config` - show info about server configuration.\n\n:small_blue_diamond: __**Notifications configuration**__\n`r!server notifications on/off` - on/off the notifications\n`r!server notifications [channel mention]` - configure notifications channel\n\n:small_blue_diamond: __**Feeds configuration**__\nSame commands like Notifications but `feeds` instead of `notificaitons`.\n`r!server sub <source name separated by ,>` - subscriptions to those feeds\n`r!server unsub <source name separated by ,>` - unsubscriptions to those feeds\n`r!server subscriptions` - feeds avaliables to subscription\n\n:information_source: Notifications and feeds are enabled in default channel, by default.\n\n:small_blue_diamond: __**More help**__\n\nIf you need more help, come to my server https://discord.gg/SxsYkgX')
  })