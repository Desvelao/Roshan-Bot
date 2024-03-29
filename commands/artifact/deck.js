const { Markdown } = require('erisjs-utils')

function doIfCondition(validate, cond_fn){
    return new Promise((res,rej) => {
        validate ? Promise.resolve(cond_fn()).then(res) : res()
    })
}

module.exports = {
    name: 'deck',
    category: 'Artifact',
    help: 'Generate a deck from a code',
    args: '[code/deck name]',
    requirements: [
        {
            type: 'user.cooldown',
            time: 30,
            response: (msg, args, client, command, req) => msg.author.locale('cmd.incooldown', {cd : args.reqUserCooldown.cooldown, username: args.reqUserCooldown.user})
        },
        {
            validate: (msg, args, client, commnad) => args[1] || false,
            response: (msg, args, client, command) => msg.author.locale('deck.error.needargorvalidcode')
        }
    ],
    enable: false,
    run: async function (msg, args, client, command) {
        const deckCached = client.cache.decks.find(deck => deck.name.toLowerCase() === String(args.from(1)).toLowerCase())
        const code = deckCached ? deckCached._id : client.components.Artifact.isValidDeckCode(args[1])
        if (!code) { return msg.reply('cmd_deck_error_need_arg_or_valid_code') }
        // 'ADCJWkTZX05uwGDCRV4XQGy3QGLmqUBg4GQJgGLGgO7AaABR3JlZW4vQmxhY2sgRXhhbXBsZQ__'
        const deck = client.components.Artifact.getCachedDeck(code)
        const embed = { embed : {
            title: '<_deck_name> - Click to see at playartifact.com',
            url: '<_deck_url>',
            description : '<_deck_link>\nCode:\`<_deck_id>\`',
            image: '<_deck_url>',
            footer: {text : 'Uploaded: <_author><_price>', icon_url: '<_user_avatar>'}
            }
        }
        if(deck){
            return embedResponse(msg, args, client, deck, embed)
        }else{
            client.sendChannelTyping(msg.channel.id)
            return client.components.Artifact.generateDeck(code, args[2] ? args.from(2) : null)
                .then(result => {
                    // return this.components.Artifact.uploadDeckAndCache(result.buffer, code, result.data.name, msg.author.id)
                    //     .then((deck) => embedResponse(msg,this,deck))
                    return client.createMessage(client.config.guild.generated, '', { file: result.buffer, name: result.data.code + '.jpg' })
                        .then(m => client.components.Artifact.saveDeckIntoCache(result.data.code, result.data.name, msg.author.id, m.attachments[0].url))
                        .then(deck => embedResponse(msg, args, client, deck, embed))
                })
        }
    }
}

function embedResponse(msg, args, bot, data, embed){
    const author = bot.users.get(data.author) || {}
    return doIfCondition(msg.author.supporter,() => bot.components.Artifact.getDeckPrice(data._id))
        .then(price => msg.reply(embed,{
            _deck_name: data.name,
            _deck_url: bot.components.Artifact.deckCodeUrl(data._id),
            _deck_link: Markdown.link(data.url, 'click to download image'),
            _deck_id: data._id,
            _author: author.username || 'Unknown',
            _price: price ? `- Price ${price}€` : ''
        }))
}