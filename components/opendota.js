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
            validate: async (msg, args, client, command, req) => {
                if (msg.mentions.length > 0) {
                    args.profile = this.baseProfile(msg.mentions[0].id)
                    if (this.needRegister(msg, args.profile)) {
                        args.message = msg.author.locale('bot.needregistermentioned', { username: msg.channel.guild.members.get(msg.mentions[0].id).username })
                        return false
                    }
                } else if (args[1]) {
                    const number = parseInt(args[1])
                    if (!isNaN(number)) {
                        args.profile = this.baseProfile(undefined, number)
                    } else {
                        try{
                            args.profile = await this.getProPlayerID(args.from(1)).then(player => this.baseProfile(undefined, player.account_id))
                        }catch(err){
                            args.message = msg.author.locale('error.pronotfound', { pro: args.from(1)})
                            return false
                        }   
                    }
                } else {
                    args.profile = this.baseProfile(msg.author.id)
                    if (this.needRegister(msg, args.profile)) {
                        args.message = msg.author.locale('needRegister')
                        return false
                    }
                }
                return true
            },
            response: (msg, args, client, command, req) => {
                return args.message
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
    needRegister(msg, account) {
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
