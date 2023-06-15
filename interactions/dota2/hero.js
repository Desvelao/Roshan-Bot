const Aghanim = require('aghanim')
const enumHeroes = require('../../enums/heroes')

module.exports = {
    name: 'hero',
    category: 'Dota 2',
    description: 'Show information about Dota 2 hero',
    type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
		{
			name: 'hero',
			description: 'Hero',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true
		}
	],
    customOptions: {
        defer: true
    },
    scope: {
        type: 'guild',
        guildIDs: [process.env.DEV_SERVER_ID]
    },
    run: async function (interaction, client, command) {
        const hero = enumHeroes.getValueByAlias(interaction.data.options.find(option => option.name === 'hero').value)
        if(!hero){ return client.components.Locale.replyInteraction(interaction, 'hero.notfound')}
        const heroBaseHealth = hero.base_health + Math.round((hero.primary_attr === "str" ? 22.5 : 17) * hero.base_str)
        const heroBaseMana = hero.base_mana + ((hero.primary_attr === "int" ? 15 : 12) * hero.base_int)
        const heroBaseArmor = hero.base_armor + Math.round((hero.primary_attr === "agi" ? 0.2 : 0.16) * hero.base_agi)
        const heroAttackType = hero.attack_type
        const heroRange = hero.attack_range
        const heroMovementSpeed = hero.move_speed

        return client.components.Locale.replyInteraction(interaction, {
            embed: {
                author: { name: hero.localized_name, icon_url: `${enumHeroes.dotaCdnURL}${hero.icon}`, url: `${enumHeroes.dotaWikiURL}${hero.localized_name}`.replace(' ', '%20')},
                thumbnail: {url: `${enumHeroes.dotaCdnURL}${hero.img}`},
                fields: [
                    { name: 'Stats', value: `Base health: ${heroBaseHealth}\nBase mana: ${heroBaseMana}\nBase armor: ${heroBaseArmor}\nAttack type: ${heroAttackType}\nRange: ${heroRange}\nMS: ${heroMovementSpeed}\n`, inline: true},
                    { name: 'Attributes', value: `${highlightAttributeFromHero('str', hero, 'Str')}: ${hero.base_str} + ${hero.str_gain}\n${highlightAttributeFromHero('agi', hero, 'Agi')}: ${hero.base_agi} + ${hero.agi_gain}\n${highlightAttributeFromHero('int', hero, 'Int')}: ${hero.base_int} + ${hero.int_gain}`, inline: true},
                    { name: 'Roles', value: hero.roles.join(', '), inline: true},
                    { name: 'Abilities', value: hero.abilities.join(', '), inline: true}
                ]
            }})
    }
}

function highlightAttributeFromHero(attribute, hero, text){
    return hero.primary_attr === attribute ? `__${text}__` : text
}