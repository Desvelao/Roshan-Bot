const { sortBy } = require('../../helpers/sort')
const enumHeroes = require('../../enums/heroes')

const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = {
  name: 'heroes',
  childOf: 'playercard',
  category: 'Account',
  help: 'Hero tags help',
  args: '',
  run: async function (msg, args, client, command){
    return msg.replyDM({
      embed: {
        title: 'playercard.helpheroes.title',
        description: 'playercard.helpheroes.description'
      }
    }, {
      heroes: _heroes
    })
  }
}
