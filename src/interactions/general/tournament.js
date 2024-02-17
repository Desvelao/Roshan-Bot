const Aghanim = require('aghanim')

const TOURNAMENT_MODE = {
  ELIMINATION: 'elimination',
  GROUPS: 'groups',
  LIST: 'list'
}

const TOURNAMENT_MODES = Object.values(TOURNAMENT_MODE).sort()

module.exports = {
  name: 'tournament',
  category: 'General',
  description : 'Create tournament matches',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'mode',
			description: 'Mode',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
      choices: [ //The possible choices for the options
          {
              name: "elimination",
              value: "Elimination"
          },
          {
              name: "groups",
              value: "Groups"
          },
          {
              name: "list",
              value: "List"
          }
      ]
		},
    {
			name: 'configuration',
			description: 'Configuration',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		}
	],
  scope: {
    type: 'guild',
    guildIDs: [process.env.DISCORD_PIT_SERVER_ID]
  },
  run: async function (interaction, client, command){
    const mode = interaction.data.options.find(option => option.name === 'mode').value
    const configuration = interaction.data.options.find(option => option.name === 'configuration').value
    const list = configuration.split(',')
    for (var i = list.length - 1; i > -1 ; i--) {
      if(list[i].length < 1){list.splice(i,1);}
    }
    const limit = 4;
    if([TOURNAMENT_MODE.ELIMINATION,TOURNAMENT_MODE.GROUPS].indexOf(mode) == -1 && list.length < limit){return client.components.Locale.replyInteraction(interaction, 'tournament.error.limitelements',{limit})};
    if(mode == TOURNAMENT_MODE.ELIMINATION){
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : interaction.user.locale('tournament.matches'), value : '', inline : false};
      for (var i = 0; i < result.length; i += 2) {
        if(result[i+1]){fields[0].value += '**' + result[i] + '** :crossed_swords:  **' + result[i+1] + '**\n';
        }else{fields[0].value += '**' + result[i] + '** :arrow_forward: \n'};
      }
    }else if(mode == TOURNAMENT_MODE.GROUPS){
      var numberGroups = parseInt(args[2]);
      if(typeof numberGroups !== 'number' || isNaN(numberGroups)){return client.components.Locale.replyInteraction(interaction, 'tournament.error.groupsnum')}
      const list = args.slice(3).join('').split(',')
      if (list.length < numberGroups * 2) { return client.components.Locale.replyInteraction(interaction, 'tournament.error.groupsnumhigh')}
      var groups = [];
      for (var i = 0; i < numberGroups; i++) {
        groups[i] = [];
      };
      var group = 0;
      var element = 0;
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        groups[group][element] = list[random];
        list.splice(random,1);
        group++
        if(group > numberGroups - 1){group = 0; element = groups[0].length}
      }
      for (var i = 0; i < groups.length; i++) {
        groups[i].sort(function(a,b){if(a.toLowerCase()<b.toLowerCase()){return -1}else{return 1}});
      }
      var fields = [];
      for (var i = 0; i < groups.length; i++) {
        fields[i] = {name : interaction.user.locale('tournament.group') + ' ' + (i+1), value : '', inline : true};
        for (var j = 0; j < groups[i].length; j++) {
          fields[i].value += groups[i][j] + '\n';
        }
      }
    }else if(mode == TOURNAMENT_MODE.LIST){
      const list = args.slice(2).join('').split(',')
      if(list.length < 2){return client.components.Locale.replyInteraction(interaction, 'tournament.error.minelements')}
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : 'tournament.list', value : results.join(', '), inline : false};
    }
    return client.components.Locale.replyInteraction(interaction, {
      embed: { title: interaction.user.locale('tournament.tourney') + ' - (' + (interaction.user.nick || interaction.user.username) + ')', fields : fields}
    })
  }
}
