const Aghanim = require('aghanim')
const enumHeroes = require('../../enums/heroes')

module.exports = {
  name: 'randompick',
  category : 'Dota 2',
  description : 'Random pick a hero',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async function (interaction, client, command){
    let hero
    do {
      const heroRandom = Math.floor(Math.random()*client.config.constants.heroes)
      hero = enumHeroes.getValue(heroRandom)
    } while (!hero || hero.name.length < 1);
    return client.components.Locale.replyInteraction(interaction, `randompick.message`, {hero_name: hero.localized_name})
  }
}
