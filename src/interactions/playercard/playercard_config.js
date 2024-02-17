const Aghanim = require('aghanim')
const enumHeroes = require('../../enums/heroes')
const enumPlayerPosition = require('../../enums/player_positions')
const enumPlayerCardBg = require('../../enums/card_bg')

module.exports = {
  name: 'playercard_config',
  category: 'Account', 
  description: 'Configure the player card',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'background',
			description: 'Background',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
		},
    {
      name: 'heroes',
      description: 'Heroes name comma-separated',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
    },
    {
			name: 'position',
			description: 'Player position',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
		}
	],
  requirements: [
    'account.exist'
  ],
  customOptions: {
    defer: true,
    'dev.forceUpdate': false
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function(interaction, client, command){
    const heroesOption = interaction.data.options.find(option => option.name === 'heroes');
    const positionOption = interaction.data.options.find(option => option.name === 'position');
    const backgroundOption = interaction.data.options.find(option => option.name === 'background');
    
    //TODO: show configuration options
    const data = {}
    if(heroesOption){
      const heroes = heroesOption.value.split(',').map(heroName => {
        const hero = enumHeroes.getKeyByAlias(heroName)
        return hero
      });
      if (heroes.length < 3) { return client.components.Locale.replyInteraction(interaction, 'playercard.error.req3heroes') }
      if (heroes.some(hero => !hero)) { return client.components.Locale.replyInteraction(interaction, 'playercard.error.req3heroes') } // TODO: not found hero
      const data = {
        heroes: heroes.join(',')
      }
      data.heroes = heroes.join(',')
    }

    if(positionOption){
      const position = enumPlayerPosition.getValue(positionOption.value);

      if(!position){
        return client.components.Locale.replyInteraction(interaction, 'playercard.error.req3heroes') // TODO: error position configuration 
      }
      
      data.pos = position
    }
    
    if(backgroundOption){
      // data.bg = 0
      const background = enumPlayerCardBg.getKey(backgroundOption.value)

      if(!background){
        return client.components.Locale.replyInteraction(interaction, 'playercard.error.req3heroes') // TODO: error position configuration 
      }
      
      data.bg = background
    }
    
    // Save new data
    if(Object.keys(data).length){
      await client.cache.profiles.save(interaction.user.id, { card: data })
    }

    return client.components.Locale.replyInteraction(interaction, {
      embed: {
        title: 'playercard.title',
        description: '{{{social_links}}}',
        fields: [
          { name: 'playercard.highlightsheroes', value: '{{{_heroes}}}', inline: false},
          { name: 'game.position', value: '{{{_position}}}', inline: false},
          { name: 'playercard.bg', value: '{{{_bg}}}', inline: false}
        ],
        footer: { text: 'playercard.roshancard',  icon_url: '{{{bot_avatar}}}'}
      }
    }, {
      username: interaction.user.username,
      social_links: client.components.Account.socialLinks(interaction.user.account),
      _player_avatar: interaction.user.avatarURL,
      _heroes: `\`\`\`${interaction.user.account.card.heroes ? interaction.user.account.card.heroes.split(',').map(h => enumHeroes.getValue(h).localized_name).join(', ') : ''}\`\`\``,
      _position: `\`\`\`${enumPlayerPosition.getValue(interaction.user.account.card.pos)}\`\`\``,
      _bg: `\`\`\`${enumPlayerCardBg.getValue(interaction.user.account.card.bg)}\`\`\``
    })
  }
}
