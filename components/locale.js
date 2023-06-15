const { Component, Eris } = require('aghanim')
const path = require('path')
const util = require('erisjs-utils')
const xlsx = require('xlsx')
const packageInfo = require('../package.json')
const { I18n } = require('i18n')

module.exports = class Locale extends Component {
    constructor(client, options) {
        super(client)
        this.lang = {}
        this.languages = []
        this.constants = {}
        this.i18n = new I18n({
            locales: ['en', 'es'],
            defaultLocale: 'en',
            directory: path.join(__dirname, '..', 'locales')
        })
        this.enhanceReplacements = {};
        this.defaultLanguage = 'en'
        const self = this
        const wb = xlsx.readFile(path.join(__dirname,'../locale/locale.xlsx'))
        xlsx.utils.sheet_to_json(wb.Sheets.locale).forEach((row, index)=> {
            if(index === 0){
                const langs = Object.keys(row).filter(key => key !== 'langkey')
                langs.forEach(lang => {
                    this.lang[lang] = {}
                    this.languages.push(lang)
                })
            }
            this.languages.forEach(lang => {
                this.lang[lang][row['langkey']] = row[lang] || ''
            })
        })
        Eris.Message.prototype.reply = function(content, replacements = {}, file, user_discord_id){
            if (typeof file === 'string') { user_discord_id = file; file = undefined}
            return this.channel.createMessage
                ? this.channel.createMessage(reply(content, replacements, user_discord_id, this), file)
                : self.client.createMessage(this.channel.id, reply(content, replacements, user_discord_id, this), file)
        }
        Eris.Message.prototype.replyDM = function (content, replacements, file, user_discord_id) {
            if (typeof file === 'string') { user_discord_id = file; file = undefined }
            return this.author.getDMChannel()
                .then(channel => channel.createMessage(reply(content, replacements, user_discord_id, this), file))
        }
        function reply(content, replacements = {}, user_discord_id, msg, fn){
            if(!replacements){replacements = {}}
            const user = (user_discord_id && self.client.users.get(user_discord_id)) || msg.author
            const user_name = replacements.user_name || user.username
            const user_id = replacements.user_id || user.id
            const user_avatar = replacements.user_avatar || user.avatarURL
            const user_lang = replacements.user_lang || user.account.lang
            const account_dota = replacements.account_dota || user.account.dota
            const account_steam = replacements.account_steam || user.account.steam
            replacements = Object.assign(replacements, { user_name, user_id, user_avatar, user_lang, account_dota, account_steam })
            return self.replaceContent(content, replacements, msg.author.account.lang)
        }
        Eris.User.prototype.locale = function (content, replacements) {
            return self._replaceContent(content, this.account.lang, replacements)
        }
        Eris.Guild.prototype.locale = function (content, replacements) {
            return self.replaceContent(content, replacements, this.account.lang)
        }
    }
    ready() {
        this.client.config.emojis.bot = util.Guild.loadEmojis(this.client.server)
        const localeCommands = {}
        this.client.commands.forEach(command => {
            localeCommands['cmd_' + command.name] = command.name
            if (command.childs.length) {
                command.childs.forEach(subcommand => {
                    localeCommands['cmd_' + command.name + '_' + subcommand.name] = command.name + ' ' + subcommand.name
                })
            }
        })
        this.addConstants(this.client.config.emojis.bot)
        Object.entries(this.client.config.emojis.bot).forEach(([key, value]) => this.registerReplacement(`emoji_${key}`, value))
        Object.entries({ //Create a replacer with bot info + emojis + lang
            bot_name: this.client.user.username,
            bot_icon: this.client.user.avatarURL,
            bot_avatar: this.client.user.avatarURL,
            author_name: this.client.owner.username,
            author_id: this.client.owner.id,
            channel_bugs: "<#" + this.client.config.guild.bugs + ">",
            channel_biblioteca: "<#" + this.client.config.guild.biblioteca + ">",
            channel_foso: "<#" + this.client.config.guild.id + ">",
            server: this.client.config.server,
            bot_version: packageInfo.version,
            bot_update: packageInfo.version_date,
            link_patreon: this.client.config.links.patreon,
            link_kofi: this.client.config.links.kofi,
            link_web: this.client.config.links.web,
            link_web_leaderboard: this.client.config.links.web_leaderboard,
            link_web_addtourney: this.client.config.links.web_addtourney,
            link_web_feeds: this.client.config.links.web_feeds,
            link_invite: this.client.config.invite,
            link_devserver: this.client.config.server,
            link_web_playercard_bg_gallery: this.client.config.links.web_playercard_bg_gallery,
            link_web_features: this.client.config.links.web_features,
            image_reddit: this.client.config.images.reddit,
            image_reddit_dota2: this.client.config.images.reddit_dota2,
            image_reddit_artifact: this.client.config.images.reddit_artifact,
            image_reddit_dotaunderlords: this.client.config.images.reddit,
            image_reddit_dota_underlords: this.client.config.images.reddit_underlords,
        }).forEach(([key, value]) => this.registerReplacement(key, value))
        this.addConstants(localeCommands)
        this.addConstants({ //Create a replacer with bot info + emojis + lang
            bot_name: this.client.user.username,
            bot_icon: this.client.user.avatarURL,
            bot_avatar: this.client.user.avatarURL,
            author_name: this.client.owner.username,
            author_id: this.client.owner.id,
            channel_bugs: "<#" + this.client.config.guild.bugs + ">",
            channel_biblioteca: "<#" + this.client.config.guild.biblioteca + ">",
            channel_foso: "<#" + this.client.config.guild.id + ">",
            server: this.client.config.server,
            bot_version: packageInfo.version,
            bot_update: packageInfo.version_date,
            link_patreon: this.client.config.links.patreon,
            link_kofi: this.client.config.links.kofi,
            link_web: this.client.config.links.web,
            link_web_leaderboard: this.client.config.links.web_leaderboard,
            link_web_addtourney: this.client.config.links.web_addtourney,
            link_web_feeds: this.client.config.links.web_feeds,
            link_invite: this.client.config.invite,
            link_devserver: this.client.config.server,
            link_web_playercard_bg_gallery: this.client.config.links.web_playercard_bg_gallery,
            link_web_features: this.client.config.links.web_features,
            image_reddit: this.client.config.images.reddit,
            image_reddit_dota2: this.client.config.images.reddit_dota2,
            image_reddit_artifact: this.client.config.images.reddit_artifact,
            image_reddit_dotaunderlords: this.client.config.images.reddit,
            image_reddit_dota_underlords: this.client.config.images.reddit_underlords,
        })
        this.client.logger.ready('Locale: Ready')
    }
    addConstants(constants){
        this.constants = Object.assign(this.constants, constants)
    }
    addLocale(lang, string){
        this.lang[lang] = string
    }
    replaceFromMsg( content, replacements, msg){ // FIXME: Deprecated
        return this.replaceContent(content, replacements, msg.author.account.lang)
    }
    replacer(string, replacements, lang){ // FIXME: Deprecated
        lang = (this.lang[lang] && lang) || this.defaultLanguage
        string = this.getString(string, lang)
        const reg = /%%([\w\._^%+]+)%%/g
        const injected = []
        let match
        while (match = reg.exec(string)) {
            injected.push(match[1])
        }
        injected.forEach(injectKey => {
            const inject = this.getString(injectKey, lang)
            if (inject) {
                string = string.replace(new RegExp(`%%${injectKey}%%`, 'g'), inject)
            }
        })
        for (let str in this.constants) {
            string = string.replace(new RegExp(`<${str}>`, 'g'), this.constants[str]) // Replace
        }
        for (let str in replacements) {
            string = string.replace(new RegExp(`<${str}>`, 'g'), replacements[str]) // Replace
        }
        return string
    }
    getString(key, language){
        return this.lang[language] && this.lang[language][key] !== undefined ? this.lang[language][key] : key
    }
    flags(){
        return [{ flag: '🇺🇸', lang: 'en' },{ flag: '🇪🇸', lang: 'es' }]
    }
    getFlag(lang){
        return this.flags().find(f => f.lang === lang).flag
    }
    exeReg(string, re){
        const found = []
        let find
        while (find = re.exec(string)) {
            found.push(find[1])
        }
        return found
    }
    findAndReplace(string, extra = {}, lang) {
        lang = lang ||this.defaultLanguage
        string = this.getString(string, lang)
        
        // Inject string
        const injected = this.exeReg(string, /%%([\w\._^%+]+)%%/g)
        injected.forEach(injectKey => {
            const inject = this.getString(injectKey, lang)
            if (inject) {
                string = string.replace(new RegExp(`%%${injectKey}%%`, 'g'), inject)
            }
        })
        const found = this.exeReg(string, /<([^>]+)>/g)
        found.forEach(f => {
            // if (this.lang[lang][f]) {
            //     string = string.replace('<' + f + '>', this.lang[lang][f])
            // } else
            if (['string','number'].includes(typeof this.constants[f])) {
                string = string.replace('<' + f + '>', this.constants[f])
            }else if (['string','number'].includes(typeof extra[f])) {
                string = string.replace('<' + f + '>', extra[f])
            }
        })
        return string
    }
    // board.locale = (str, extra) => client.components.DuelGame.findAndReplace(str, extra)
    replaceContent(content, extra, lang) {
        if (typeof content === 'string') {
            return this.findAndReplace(content, extra, lang)
        } else {
            Object.keys(content).forEach(key => {
                if(key === 'file'){return}
                if (typeof content[key] === 'string') {
                    content[key] = this.findAndReplace(content[key], extra, lang)
                } else if (typeof content[key] === 'object') {
                    content[key] = this.replaceContent(content[key], extra, lang)
                }
            })
        }
        return content
    }
    translate(...args){
        return this.i18n.__(...args)
    }
    replyInteraction(interaction, content, replacements = {}){
        const user = interaction.member.user/* || msg.author*/
        const { username: user_name, id: user_id, avatarURL: user_avatar_url } = user
        const { lang: user_account_lang, dota: user_account_dota, steam: user_account_steam } = user.account
        const enhancedReplacements = {
            user_name,
            user_id,
            user_avatar_url,
            user_account_dota,
            user_account_lang,
            user_account_steam,
            ...replacements,
            ...this.enhanceReplacements,
        }
        const message = this._replaceContent(content, interaction.user.account.lang, enhancedReplacements)
        return interaction.acknowledged ? interaction.createFollowup(message) : interaction.createMessage(message)
    }
    _replaceContent(content, language, replacements){
        if (typeof content === 'string') {
            return this.translate({phrase: content, locale: language,}, replacements)
        } else {
            Object.keys(content).forEach(key => {
                if (typeof content[key] === 'string') {
                    content[key] = this.translate({phrase: content[key], locale: language}, replacements)
                } else if (typeof content[key] === 'object') {
                    content[key] = this._replaceContent(content[key], language, replacements)
                }
            })
        }
        return content
    }
    replaceContent(interaction, content, replacements = {}){
        return
    }
    registerReplacement(key, value){
        this.enhanceReplacements[key] = value;
    }
}

