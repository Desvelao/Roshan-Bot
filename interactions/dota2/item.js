const Aghanim = require('aghanim')
const enumItems = require('../../enums/items')

module.exports = {
    name: 'item', 
    category: 'Dota 2',
    description: 'Show information about a Dota 2 item',
    type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
    options: [
		{
			name: 'item',
			description: 'Item',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true
		}
	],
    run: async function (interaction, client, command) {
        const item = enumItems.getValueByName(interaction.data.options.find(option => option.name === 'item').value)
        // FIXME: when search sange we get sange and yasha. See enumItems.getValueByName method
        if (!item) {return client.components.Locale.replyInteraction(interaction, 'item.notfound')}

        return client.components.Locale.replyInteraction(interaction, {
            embed: {
                author: {name: item.dname, url: enumItems.dotaWikiURL + item.dname.replace(/ /g, "_")},
                description: item.notes,
                thumbnail: { url: `${enumItems.dotaCdnURL}${item.img}`},
                fields : [
                    ...(item.attrib && item.attrib.length ? [{name : 'Stats', value: item.attrib.map(attr => `*${attr.header}* ${attr.value} ${attr.footer || ''}`).join('\n'), inlue : true}] : []),
                    ...(item.components && item.components.length ? [{ name: `Components - Total cost: ${item.cost}`, value: item.components.map(component => `**${component.dname}** ${component.cost}`).join(', '), inlue: true }] : []),
                    ...(item.active && item.active.length ? [{ name: 'Actives', value: '<_item_actives>', inlue: true }]: []),
                    ...(typeof item.cd === 'number' ? [{ name: 'Cooldown', value: item.cd, inlue: true }] : [])
                ],
                footer : {text : item.lore}
            }
        })
    }
}
