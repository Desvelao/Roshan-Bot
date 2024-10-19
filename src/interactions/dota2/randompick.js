const Aghanim = require('aghanim');
const enumHeroes = require('../../enums/heroes');

module.exports = {
  name: 'randompick',
  category: 'Dota 2',
  description: 'Random pick a hero',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    let hero;
    do {
      const heroRandom = Math.floor(Math.random() * enumHeroes.maximumHeroId);
      hero = enumHeroes.getValue(heroRandom);
    } while (!hero || hero.name.length < 1);
    return client.components.Locale.replyInteraction(
      interaction,
      `randompick.message`,
      { hero_name: hero.localized_name }
    );
  }
};
