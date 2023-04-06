const { Component } = require('aghanim')
const axios = require('axios')

module.exports = class Opendota extends Component {
    constructor(client, options) {
        super(client)
        this.baseURL = baseURL
        this._calls = 0
        this.db = this.client.db.child('botstats')
        Object.keys(urls).forEach(key => {
            this[key] = decorator(this.request.bind(this), urls[key].map(url => this.baseURL + url))
        })
        this.db.once('value').then((snap) => {
            this._calls = snap.exists() ? snap.val().odcalls : 0
            const date = new Date()
            if (date.getDate() === 1) {
                this.save(0)
            }
        })
        this.client.addCommandRequirement({
            type: 'is.dota.player',
            validate: async (context, client, command, req) => {
                !context.ctx && (context.ctx = {})
                if (context.data.options && context.data.options.find(option => option.name === 'user_mention')) {
                    const [userID] = context.data.resolved.users.keys()
                    const user = context.data.resolved.users.get(userID)
                    context.ctx.profile = this.baseProfile(user.id)
                    if (this.needRegister(context.ctx.profile)) {
                        context.ctx.message = client.components.Locale._replaceContent('bot.needregistermentioned', context.user.account.lang, { username: user.username })
                        return false
                    }
                } else if (context.data.options && context.data.options.find(option => option.name === 'user_id')) {
                    const userID = context.data.options.find(option => option.name === 'user_id').value
                    const userIDAsNumber = parseInt(userID)
                    if (!isNaN(userIDAsNumber)) {
                        context.ctx.profile = this.baseProfile(undefined, userIDAsNumber)
                    } else {
                        try{
                            context.ctx.profile = await this.getProPlayerID(userID).then(player => this.baseProfile(undefined, player.account_id))
                        }catch(err){
                            context.ctx.message = client.components.Locale._replaceContent('error.pronotfound', context.user.account.lang, { pro: userID})
                            return false
                        }   
                    }
                } else {
                    context.ctx.profile = this.baseProfile(context.user.id)
                    if (this.needRegister(context.ctx.profile)) {
                        context.ctx.message = client.components.Locale._replaceContent('needRegister', context.user.account.lang)
                        return false
                    }
                }
                return true
            },
            response: (context, client, command, req) => {
                return context.ctx.message
            }
        })
    }
    request(urls, id) {
        return Promise.all(urls.map(url => axios.get(url.replace('<id>', id))))
            .then(results => {
                return this.incremental(results.length).then(() => results.map(({data}) => data))
            }
        )
    }
    get calls() {
        return this._calls
    }
    set calls(value) {
        return this.save(value)
    }
    save(value) {
        const update = { odcalls: value === undefined ? this._calls : value }
        this._calls = update.odcalls
        return process.env.NODE_ENV === 'production' ? this.db.update(update) : Promise.resolve()
    }
    incremental(add) {
        this._calls += add || 0
        return this.save(this._calls)
    }
    needRegister(account) {
        return !account.data.dota ? true : false
    }
    baseProfile(discordID, dotaID) {
        const cache = this.client.cache.profiles.get(discordID)
        const data = cache || this.client.components.Account.schema()
        const profile = this.client.components.Users.getProfile(discordID)
        if (dotaID) { data.dota = dotaID }
        return { discordID, cached: cache ? true : false, data, profile}
    }
    getProPlayerID(name) {
        return new Promise((resolve, reject) => {
            const urls = [this.baseURL + Endpoints.search_pro] //['https://api.opendota.com/api/proPlayers/'];
            this.request(urls).then((results) => {
                let pro = results[0].find(player => player.name.toLowerCase() === name.toLowerCase())
                if (pro) { resolve(pro) } else { reject("getProPlayerDotaID not found") };
            })
        })
    }
    getProPlayersDotaName(query) { //Promise
        return new Promise((resolve, reject) => {
            this.search_pro(query).then((results) => {
                let pros = results[0].filter(player => player.name.toLowerCase().match(new RegExp(query.toLowerCase())))
                if (pros) { resolve(pros) } else { reject("getProPlayersDotaName not found") };
            }).catch(err => console.log(err))
        })
    }
    getPlayersDotaName(query) { //Promise
        return new Promise((resolve, reject) => {
            this.search_player(query).then((results) => {
                let players = results[0];
                if (players) { resolve(players) } else { reject("getPlayersDotaName not found") };
            }).catch(err => console.log(err))
        })
    }
}

const baseURL = 'https://api.opendota.com/api/'

const Endpoints = {
    player: 'players/<id>',
    player_wl: 'players/<id>/wl',
    player_heroes: 'players/<id>/heroes',
    player_totals: 'players/<id>/totals',
    player_matches: 'players/<id>/matches?significant=0',
    player_pros: 'players/<id>/pros',
    player_friends: 'players/<id>/peers?date=30',
    match: 'matches/<id>',
    competitive: 'proMatches/',
    proplayers: 'proPlayers/',
    search_player: 'search?q=<id>&similarity=0.5',
    search_pro: 'proPlayers/',
}

const urls = {
    account: [Endpoints.player],
    card: [Endpoints.player],
    card_heroes: [Endpoints.player, Endpoints.player_heroes],
    player: [Endpoints.player, Endpoints.player_wl, Endpoints.player_heroes, Endpoints.player_totals],
    player_matches: [Endpoints.player, Endpoints.player_matches],
    player_lastmatch: [Endpoints.player_matches],
    player_friends: [Endpoints.player, Endpoints.player_friends],
    player_pros: [Endpoints.player, Endpoints.player_pros],
    player_steam: [Endpoints.player],
    match: [Endpoints.match],
    competitive: [Endpoints.competitive],
    search_player: [Endpoints.search_player],
    search_pro: [Endpoints.search_pro]
}

const decorator = (f, urls) => id => f(urls, id)
