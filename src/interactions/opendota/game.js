const Aghanim = require('aghanim');
const util = require('erisjs-utils');
const odutil = require('../../helpers/opendota-utils');
const enumHeroes = require('../../enums/heroes');
const enumLobbyType = require('../../enums/lobby');
const enumSkill = require('../../enums/skill');

module.exports = {
  name: 'game',
  category: 'Dota 2',
  description: 'Game stats',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'game_id',
      description: 'Game ID',
      type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
      required: true
    }
  ],
  customOptions: {
    defer: true
  },
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command) {
    return client.components.Opendota.match(
      interaction.data.options.find((option) => option.name === 'game_id').value
    )
      .then((results) => {
        if (results[0].error) {
          return client.components.Locale.replyInteraction(
            interaction,
            'error'
          );
        }
        if (results[0].game_mode === 19) {
          return client.components.Locale.replyInteraction(
            interaction,
            'interaction.game.eventgame'
          );
        }
        const spacesBoard = ['17f', '8f', '8f', '6f', '5f', '4f', '15f'];
        const headers = [
          'dota2.hero',
          'dota2.kda',
          'dota2.gpmxpm',
          'dota2.lhd',
          'dota2.hdmg',
          'dota2.tdmg',
          'dota2.player'
        ].map((str) =>
          client.components.Locale.translateAsScopedUser(interaction.user, str)
        );

        let radiant = new util.Classes.Table(headers, null, spacesBoard, {
          fill: '\u2002'
        });
        let dire = new util.Classes.Table(headers, null, spacesBoard, {
          fill: '\u2002'
        });
        results[0].players.forEach((player, index) => {
          if (index < 5) {
            radiant.addRow([
              enumHeroes.getValue(player.hero_id).localized_name,
              player.kills + '/' + player.deaths + '/' + player.assists,
              player.gold_per_min + '/' + player.xp_per_min,
              player.last_hits + '/' + player.denies,
              odutil.numberToK(player.hero_damage) +
                client.components.Locale.translateAsScopedUser(
                  interaction.user,
                  'number.k'
                ),
              odutil.numberToK(player.tower_damage) +
                client.components.Locale.translateAsScopedUser(
                  interaction.user,
                  'number.k'
                ),
              player.name
                ? odutil.parseText(player.name, 'nf')
                : odutil.parseText(
                    player.personaname ||
                      client.components.Locale.translateAsScopedUser(
                        interaction.user,
                        'unknown'
                      ),
                    'nf'
                  )
            ]);
          } else {
            dire.addRow([
              enumHeroes.getValue(player.hero_id).localized_name,
              player.kills + '/' + player.deaths + '/' + player.assists,
              player.gold_per_min + '/' + player.xp_per_min,
              player.last_hits + '/' + player.denies,
              odutil.numberToK(player.hero_damage) +
                client.components.Locale.translateAsScopedUser(
                  interaction.user,
                  'number.k'
                ),
              odutil.numberToK(player.tower_damage) +
                client.components.Locale.translateAsScopedUser(
                  interaction.user,
                  'number.k'
                ),
              player.name
                ? odutil.parseText(player.name, 'nf')
                : odutil.parseText(
                    player.personaname ||
                      client.components.Locale.translateAsScopedUser(
                        interaction.user,
                        'unknown'
                      ),
                    'nf'
                  )
            ]);
          }
        });
        // return interaction.createMessage(JSON.stringify(results).slice(0,1000))
        return client.components.Locale.replyInteraction(
          interaction,
          {
            embed: {
              title: 'interaction.game.title',
              description: 'interaction.game.description',
              fields: [
                {
                  name: 'interaction.game.team1.title',
                  value: 'interaction.game.team1.description',
                  inline: false
                },
                {
                  name: 'interaction.game.team2.title',
                  value: 'interaction.game.team2.description',
                  inline: false
                }
              ]
            }
          },
          {
            team: odutil.winnerTeam(results[0]),
            match_type: results[0].league
              ? ' :trophy: ' + results[0].league.name
              : enumLobbyType.getValue(results[0].lobby_type),
            match_skill: enumSkill.getValue(results[0].skill) || '',
            match_id: results[0].match_id,
            match_link:
              client.config.links.profile.dotabuff.slice(0, -8) +
              'matches/' +
              results[0].match_id,
            duration: odutil.durationTime(results[0].duration),
            time: util.Datee.custom(
              results[0].start_time * 1000,
              'Y/M/D h:m',
              true
            ),
            interaction_game_team1_title:
              (results[0].radiant_team
                ? results[0].radiant_team.name
                : client.components.Locale.translateAsScopedUser(
                    interaction.user,
                    'dota2.radiant'
                  )) +
              ' - ' +
              results[0].radiant_score,
            interaction_game_team1_description: radiant.render(),
            interaction_game_team2_title:
              (results[0].dire_team
                ? results[0].dire_team.name
                : client.components.Locale.translateAsScopedUser(
                    interaction.user,
                    'dota2.dire'
                  )) +
              ' - ' +
              results[0].dire_score,
            interaction_game_team2_description: dire.render()
          }
        );
      })
      .catch((err) => {
        return client.components.Locale.replyInteraction(
          interaction,
          'error.opendotarequest'
        );
      });
  }
};
