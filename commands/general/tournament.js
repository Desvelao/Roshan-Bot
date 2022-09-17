const TOURNAMENT_MODE = {
  ELIMINATION: 'elimination',
  GROUPS: 'groups',
  LIST: 'list'
}

const TOURNAMENT_MODES = Object.values(TOURNAMENT_MODE).sort()

module.exports = {
  name: 'tournament',
  category: 'General',
  run: async function (msg, args, client, command){
    if(!args[1]){return}
    const mode = args[1];
    if(!TOURNAMENT_MODES.includes(mode)){return msg.reply('tournament.error.modes')}
    const message = args.slice(2).join('')
    const list = message.split(',')
    for (var i = list.length - 1; i > -1 ; i--) {
      if(list[i].length < 1){list.splice(i,1);}
    }
    const limit = 4;
    if([TOURNAMENT_MODE.ELIMINATION,TOURNAMENT_MODE.GROUPS].indexOf(mode) == -1 && list.length < limit){return msg.reply('tournament.error.limitelements',{limit})};
    if(mode == TOURNAMENT_MODE.ELIMINATION){
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : msg.author.locale('tournament.matches'), value : '', inline : false};
      for (var i = 0; i < result.length; i += 2) {
        if(result[i+1]){fields[0].value += '**' + result[i] + '** :crossed_swords:  **' + result[i+1] + '**\n';
        }else{fields[0].value += '**' + result[i] + '** :arrow_forward: \n'};
      }
    }else if(mode == TOURNAMENT_MODE.GROUPS){
      var numberGroups = parseInt(args[2]);
      if(typeof numberGroups !== 'number' || isNaN(numberGroups)){return msg.reply('tournament.error.groupsnum')}
      const list = args.slice(3).join('').split(',')
      if (list.length < numberGroups * 2) { return msg.reply('tournament.error.groupsnumhigh')}
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
        fields[i] = {name : msg.author.locale('tournament.group') + ' ' + (i+1), value : '', inline : true};
        for (var j = 0; j < groups[i].length; j++) {
          fields[i].value += groups[i][j] + '\n';
        }
      }
    }else if(mode == TOURNAMENT_MODE.LIST){
      const list = args.slice(2).join('').split(',')
      if(list.length < 2){return msg.reply('tournament.error.minelements')}
      var result = [];
      for (var i = list.length - 1; i > -1 ; i--) {
        var random = Math.floor(Math.random()*list.length);
        result[i] = list[random];
        list.splice(random,1);
      }
      var fields = [];
      fields[0] = {name : msg.author.locale('tournament.list'), value : '', inline : false};
      for (var i = 0; i < result.length; i++) {
        fields[0].value += result[i] + ', ';
      }
      fields[0].value = fields[0].value.slice(0,-2);
    }
    return msg.reply({
      embed: { title: msg.author.locale('tournament.tourney') + ' - (' + (msg.author.nick || msg.author.username) + ')', fields : fields, color : client.config.color}
    })
  }
}
