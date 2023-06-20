const { Component } = require('aghanim')
const { Datee, Guild } = require('erisjs-utils')

module.exports = class ServerEvents extends Component {
    constructor(client, options) {
        super(client)
    }
    guildMemberAdd(guild, member){
        if (guild.id !== process.env.DISCORD_PIT_SERVER_ID) { return };

        this.client.logger.info(`Member in: **${member.username}**`)
    }
    guildMemberRemove(guild, member){
        if (guild.id !== process.env.DISCORD_PIT_SERVER_ID) { return }
        this.client.logger.info(`Member out: **${member.username}**`)
    }
}

function ndToVoidString(text, int) { return text === 'ND' ? '' : int ? parseInt(text) : text }