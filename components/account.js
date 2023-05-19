const CustomComponent = require('../classes/custom-component.js')
const { Eris } = require('aghanim')
const odutil = require('../helpers/opendota-utils')
const { Datee, Markdown } = require('erisjs-utils')

module.exports = class Account extends CustomComponent() {
	constructor(client, options) {
		super(client)
		Object.defineProperty(Eris.User.prototype, 'account', {
			get: function () {
				return client.cache.profiles.get(this.id) || client.components.Account.schema()
			}
		})

		Object.defineProperty(Eris.User.prototype, 'registered', {
			get: function () {
				return client.cache.profiles.has(this.id)
			},
			enumerable: true
		})

		Object.defineProperty(Eris.User.prototype, 'supporter', {
			get: function () {
				return client.components.Users.isSupporter(this.id)
			},
			enumerable: true
		})

		Object.defineProperty(Eris.User.prototype, 'betatester', {
			get: function () {
				return client.components.Users.isBetatester(this.id)
			},
			enumerable: true
		})

		Object.defineProperty(Eris.User.prototype, 'profile', {
			get: function () {
				return {
					account: this.account,
					supporter: this.supporter,
					betatester: this.betatester,
					registered: this.registered
				}
			},
			enumerable: true
		})

		// Define custom requirements
		this.client.addCommandRequirement({
			type: 'account.exist',
			validate: async (context, client, command, req) => {
			  const account = await client.components.Account.get(context.user.id)
			  if(!account){return false}
			  !context.ctx && (context.ctx = {})
			  context.ctx.account = account
			  return true
			},
			response: (context, client, command, req) => client.components.Locale.replyInteraction(context, 'bot.needregister')
		  })

		this.client.addCommandRequirement({
			type: 'account.existany',
			validate: async (context, client, command, req) => {
				!context.ctx && (context.ctx = {})
				const userID = (context.data.options && context.data.options.length)
				? (context.data.options.find(option => option.name === 'user_mention') || {}).value || (context.data.options.find(option => option.name === 'user_id') || {}).value
				: context.user.id
				context.ctx.account = await client.components.Account.get(userID)
				context.ctx.user = client.users.get(userID);
				if(!context.ctx.account){	
					if (userID === context.user.id) {
						await client.components.Locale.replyInteraction(context, 'bot.needregister')
						return true
					}
					return false
				}
				return true
			},
			response: "Your account doesn't exist"
		})

		this.client.addCommandRequirement({
			type: 'account.registered',
			validate: async (context, client, command, req) => {
				return context.user.registered
			},
			response: (context, client, command, req) => client.components.Locale.replyInteraction(context, 'bot.needregister')
		})

		this.client.addCommandRequirement({
			type: 'account.not.registered',
			validate: async (context, client, command, req) => {
				return !context.user.registered
			},
			response: (context, client, command, req) => client.components.Locale.replyInteraction(context, 'register.alreadyregistered')
		})

		this.client.addCommandRequirement({
			type: 'account.supporter',
			validate: async (context, client, command, req) => {
				return context.user.supporter
			},
			response: (context, client, command, req) => client.components.Locale.replyInteraction(context, 'roshan.supporter.need')
		})
		this.client.addCommandRequirement({
			type: 'pit.user',
			validate: async (context, client, command, req) => {
				return context.channel.guild && context.channel.guild.id === client.server.id
			}
		})
		this.client.addCommandRequirement({
			type: 'pit.channel.commands',
			validate: async (context, client, command, req) => {
				return context.channel.id === client.config.guild.commands
			}
		})
	}
	schema(){
		return {
			lang: 'en',
				card : {
					bg: '0',
					heroes : 'all',
					pos : ''
			},
			dota : '',
			steam : ''
		}
	}
	get(discordID){
		return Promise.resolve(this.client.cache.profiles.get(discordID))
	}
	create(discordID,dotaID,steamID,odResponse){
		const data = this.schema()
		data.dota = dotaID
		data.steam = steamID || data.steam
		return this.client.cache.profiles.save(discordID, data)
			.then(() => this.updateAccountLeaderboard(discordID, data.dota,odResponse))
			.then(() => this.client.logger.info('userToLeaderboard: ' + `${discordID}`))
	}
	modify(discordID,data){
		return this.client.cache.profiles.save(discordID, data)
	}
	delete(discordID){
		return this.client.cache.profiles.remove(discordID)
			.then(() => this.deleteAccountLeaderboard(discordID))
			.then(() => this.client.logger.info('userDelLeaderboard: ' + `${discordID}`))
	}
	async createProcess(discordID, dotaID, context){
		const guildName = context.channel.guild ? context.channel.guild.name : 'DM'
		const guildID = context.channel.guild ? context.channel.guild.id : context.channel.id
		const [data] = await this.client.components.Opendota.account(dotaID)
		if(!data.profile){throw new Error('Profile not found')}
		const messageNotificationServer = await this.client.createMessage(this.client.config.guild.accounts,{
			embed :{
				title: this.client.components.Locale._replaceContent('registerAccountTitle', 'en', { user_account_id: context.user.id }),
				description: this.client.components.Locale._replaceContent('registerAccountDesc', 'en', { guild_name: guildName, guild_id: guildID, user_account_dotaID: dotaID, user_account_steam: data.profile.steamid}),
				footer: { text: context.user.username + ' | ' + context.user.id, icon_url: context.user.avatarURL },
				color: this.client.config.colors.account.register
		}})
		await this.create(discordID, dotaID, data.profile.steamid, data)
		this.client.logger.info(`New account: **${context.user.username}** (${context.user.id})`)
		await this.client.components.Locale.replyInteraction(context, {
			embed: {
				title: 'roshan.welcometo',
				description: 'roshan.infoabout',
				fields: [
					{ name: 'register.dataurregistry', value: 'register.dataurregistryaccount', inline: false},
					{ name: 'register.tyforurregistry', value: 'register.helpregistrydesc', inline: false}
				],
				thumbnail: { url: context.user.avatarURL }
			}
		}, { user_account_dota: dotaID, user_account_steam: data.profile.steamid})
		await messageNotificationServer.addReactionSuccess()
	}
	async deleteProcess(discordID, context){
		const guildName = context.channel.guild ? context.channel.guild.name : 'DM'
		const guildID = context.channel.guild ? context.channel.guild.id : context.channel.id
		const messageNotificationServer =  await this.client.createMessage(this.client.config.guild.accounts, {
			embed: {
				title: this.client.components.Locale._replaceContent('unregisterAccountTitle', 'en', { user_account_id: context.user.id }),
				description: this.client.components.Locale._replaceContent('unregisterAccountDesc', 'en', { guildName, guildID }),
				footer: { text: context.user.username + ' | ' + context.user.id, icon_url: context.user.avatarURL },
				color: this.client.config.colors.account.delete
			}
		})
		await this.delete(discordID)
		this.client.logger.info(`Account deleted: **${context.user.username}** (${context.user.id})`)
		await this.client.components.Locale.replyInteraction(context, 'account.deleted')
		await messageNotificationServer.addReactionSuccess()
		
	}
	updateAccountLeaderboard(discordID, dotaID, data) {
		if (data) {
			const player = this.client.users.get(discordID)
			const rank = odutil.getMedal(data, 'raw')
			const update = {
				username: player.username || data.profile.personaname,
				nick: data.profile.personaname || '',
				avatar: player.avatarURL || data.profile.avatarmedium,
				rank: rank.rank,
				leaderboard: rank.leaderboard
			}
			return Promise.all([
				this.client.db.child(`leaderboard/ranking/${discordID}`).update(update),
				this.updatePublicLeaderboardPlayers()
			])
		} else {
			return this.client.components.Opendota.account(dotaID).then(([data]) => this.updateAccountLeaderboard(discordID, dotaID, data))
		}
	}
	deleteAccountLeaderboard(discordID){
		return Promise.all([
			this.client.db.child(`leaderboard/ranking/${discordID}`).remove(),
			this.updatePublicLeaderboardPlayers()
		])
	}
	updatePublicLeaderboardPlayers(){
		return this.client.db.child('public').update({users : this.client.cache.profiles.size})
	}
	socialLink(tag, id, show) {
		let link
		if (tag === 'dota') {
			link = `https://www.dotabuff.com/players/${id}`
		} else {
			link = `http://www.steamcommunity.com/profiles/${id}`
		}
		return Markdown.link(link, tag, show)
	}
	socialLinks(account, mode = 'inline', show = 'embed') {
		const links = [
			this.socialLink('dota', account.dota, show),
			this.socialLink('steam', account.steam, show)
		]
		if (mode == 'inline') {
			return links.join(' / ')
		} else if (mode == 'vertical') {
			return links.join('\n')
		}
	}
}
