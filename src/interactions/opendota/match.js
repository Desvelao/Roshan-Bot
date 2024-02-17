const Aghanim = require('aghanim');
const util = require('erisjs-utils');
const odutil = require('../../helpers/opendota-utils');
const enumHeroes = require('../../enums/heroes');
const enumLobbyType = require('../../enums/lobby');
const enumSkill = require('../../enums/skill');

module.exports = {
  name: 'match',
  category: 'Dota 2',
  description: 'Game stats',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'match_id',
      description: 'Match ID',
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
      interaction.data.options.find((option) => option.name === 'match_id')
        .value
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
            'match.eventgame'
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
          client.components.Locale._replaceContent(
            str,
            interaction.user.account.lang
          )
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
              util.Number.tok(player.hero_damage) +
                client.components.Locale._replaceContent(
                  'number.k',
                  interaction.user.account.lang
                ),
              util.Number.tok(player.tower_damage) +
                client.components.Locale._replaceContent(
                  'number.k',
                  interaction.user.account.lang
                ),
              player.name
                ? client.components.Bot.parseText(player.name, 'nf')
                : client.components.Bot.parseText(
                    player.personaname ||
                      client.components.Locale._replaceContent(
                        'unknown',
                        interaction.user.account.lang
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
              util.Number.tok(player.hero_damage) +
                client.components.Locale._replaceContent(
                  'number.k',
                  interaction.user.account.lang
                ),
              util.Number.tok(player.tower_damage) +
                client.components.Locale._replaceContent(
                  'number.k',
                  interaction.user.account.lang
                ),
              player.name
                ? client.components.Bot.parseText(player.name, 'nf')
                : client.components.Bot.parseText(
                    player.personaname ||
                      client.components.Locale._replaceContent(
                        'unknown',
                        interaction.user.account.lang
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
              title: 'match.title',
              description: 'match.description',
              fields: [
                {
                  name: '{{{match_field0_name}}}',
                  value: '{{{match_field0_value}}}',
                  inline: false
                },
                {
                  name: '{{{match_field1_name}}}',
                  value: '{{{match_field1_value}}}',
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
              'h:m D/M/Y',
              true
            ),
            match_field0_name:
              (results[0].radiant_team
                ? results[0].radiant_team.name
                : client.components.Locale._replaceContent(
                    'dota2.radiant',
                    interaction.user.account.lang
                  )) +
              ' - ' +
              results[0].radiant_score,
            match_field0_value: radiant.render(),
            match_field1_name:
              (results[0].dire_team
                ? results[0].dire_team.name
                : client.components.Locale._replaceContent(
                    'dota2.dire',
                    interaction.user.account.lang
                  )) +
              ' - ' +
              results[0].dire_score,
            match_field1_value: dire.render()
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
