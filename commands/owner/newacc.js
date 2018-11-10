const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const { Datee, Request } = require('erisjs-utils')

module.exports = new Command('newacc',{
  category : 'Owner', help : 'Registro en el bot', args : '<discordID> <dotaID> [steamID] [twitchID] [twitterID]',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    const server = this.config.guild;
    if(args[1].length < 2 ){return msg.addReaction(this.config.emojis.default.error)};
    let account = {dota : args[2] ? args[2] : '' ,steam : args[3] ? args[3] : '', twitch : args[4] ? args[4] : '', twitter : args[5] ? args[5] : ''};
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    let msgServer = {}, msgChannel, color;
    const user = this.users.get(args[1])
    if(this.cache.profiles.get(args[1])){return msg.reply(this.locale.get('errorProfileRegisteredAlready',msg))}
    for(i in account){
      if(account[i] == '-' && i != 'dota'){account[i] = ''};
      account[i] = basic.parseProfileURL(account[i],i);
    }
    request.getJSON('https://api.opendota.com/api/players/' + account.dota).then((result) => {
      if(!result.profile){return msg.reply(this.replace('errorDotaIDNotValid',msg,{id : account.dota}))};
      this.createMessage(server.accounts,{
        embed : {
          title : this.locale.replace('registerAccountTitle',msg,{id : user.id}),
          description : this.locale.replace('registerAccountDesc',msg,{guildName, guildID, dotaID : account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter}),
          //thumbnail : {url : config.icon, height : 40, width : 40},
          footer : {text : user.username + ' | ' + user.id + ' | ' + Datee.custom(msg.timestamp,'D/M/S h:m:s'),icon_url : user.avatarURL},
          color: this.config.colors.account.register
        }
      }).then(m => {
        msg.addReaction(this.config.emojis.default.envelopeIncoming);
        const newAccount = basic.newAccount({profile : account})
        this.cache.profiles.save(user.id,newAccount).then(() => {
          this.notifier.accountnew(`New account: **${msg.author.username}** (${msg.author.id})`)
          // msg.replyDM({
          //   embed : {
          //     title : this.replace.do('welcomeToRoshan'),
          //     //author : {name : config.bot.name, icon_url : config.bot.icon},
          //     description : this.replace.do('infoAboutDotaForDiscord') || "",
          //     fields : [{
          //       name : lang.dataUrRegistry,
          //       value : this.replace.do('dataUrRegistryAccount',{dotaID : newAccount.profile.dota, steamID : newAccount.profile.steam, twitchID : newAccount.profile.twitch, twitterID: newAccount.profile.twitter},true),
          //       inline : false
          //     },{
          //       name : lang.tyForUrRegistry,
          //       value : this.replace.do('helpRegistryDesc'),
          //       inline : false
          //     }],
          //     thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
          //     footer : {text : this.replace.do(lang.botCreated),icon_url : this.user.avatarURL},
          //     color: this.config.color
          //   }
          // })
          m.addReaction(this.config.emojis.default.accept);
        })
      })
    })
  })
