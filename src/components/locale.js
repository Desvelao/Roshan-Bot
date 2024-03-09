const { Component } = require('aghanim');
const path = require('path');
const util = require('erisjs-utils');
const packageInfo = require('../../package.json');
const { I18n } = require('i18n');

module.exports = class Locale extends Component {
  constructor(client, options) {
    super(client);
    this.defaultLocale = 'en';
    this.i18n = new I18n({
      locales: ['en', 'es'],
      defaultLocale: 'en',
      directory: path.join(__dirname, '..', 'locale/languages')
    });
    this.enhanceReplacements = {};
  }
  ready() {
    this.client.config.emojis.bot = util.Guild.loadEmojis(this.client.server);
    Object.entries(this.client.config.emojis.bot).forEach(([key, value]) =>
      this.registerReplacement(`emoji_${key}`, value)
    );
    Object.entries({
      //Create a replacer with bot info + emojis + lang
      bot_name: this.client.user.username,
      bot_icon: this.client.user.avatarURL,
      bot_avatar: this.client.user.avatarURL,
      author_name: this.client.owner.username,
      author_id: this.client.owner.id,
      channel_foso: '<#' + process.env.DISCORD_PIT_SERVER_ID + '>',
      server: process.env.DISCORD_PIT_SERVER_URL,
      bot_version: packageInfo.version,
      bot_update: packageInfo.version_date,
      link_kofi: this.client.config.links.kofi,
      link_web: this.client.config.links.web,
      link_web_leaderboard: this.client.config.links.web_leaderboard,
      link_web_addtourney: this.client.config.links.web_addtourney,
      link_web_feeds: this.client.config.links.web_feeds,
      link_invite: process.env.DISCORD_PIT_SERVER_INVITE_URL,
      link_devserver: process.env.DISCORD_PIT_SERVER_URL,
      link_web_playercard_bg_gallery:
        this.client.config.links.web_playercard_bg_gallery,
      link_web_features: this.client.config.links.web_features
    }).forEach(([key, value]) => this.registerReplacement(key, value));
    this.client.logger.ready('Locale: Ready');
  }
  translate(phrase, replacements) {
    return this.i18n.__(phrase, {
      ...replacements,
      ...this.enhanceReplacements
    });
  }
  replyInteraction(interaction, content, replacements = {}) {
    const response = this.translateAsScopedUser(
      interaction.user,
      content,
      replacements
    );
    return interaction.acknowledged
      ? interaction.createFollowup(response)
      : interaction.createMessage(response);
  }
  _replaceContent(content, language, replacements) {
    if (typeof content === 'string') {
      return this.translate(
        { phrase: content, locale: language },
        replacements
      );
    } else {
      Object.keys(content).forEach((key) => {
        if (typeof content[key] === 'string') {
          content[key] = this.translate(
            { phrase: content[key], locale: language },
            replacements
          );
        } else if (typeof content[key] === 'object') {
          content[key] = this._replaceContent(
            content[key],
            language,
            replacements
          );
        }
      });
    }
    return content;
  }
  translateAsScopedUser(user, content, replacements) {
    const {
      username: user_name,
      id: user_id,
      avatarURL: user_avatar_url
    } = user;
    const account = this.client.profilesManager.getUserAccountData(user_id);
    const user_account_lang = (account && account.lang) || this.defaultLocale;
    const user_account_dota = (account && account.dota) || '';
    const user_account_steam = (account && account.steam) || '';
    return this._replaceContent(content, user_account_lang, {
      ...replacements,
      user_name,
      user_id,
      user_avatar_url,
      user_account_lang,
      user_account_dota,
      user_account_steam
    });
  }
  translateAsDefaultUser(content, replacements) {
    return this._replaceContent(content, this.defaultLocale, replacements);
  }
  registerReplacement(key, value) {
    this.enhanceReplacements[key] = value;
  }
};
