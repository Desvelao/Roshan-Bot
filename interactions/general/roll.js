const Aghanim = require('aghanim')

module.exports = {
  name: 'roll',
  category: 'General',
  description : 'Information about Dota 2 subreddit',
  type: Aghanim.Eris.Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
		{
			name: 'minimum',
			description: 'Minimum',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false,
		},
    {
			name: 'maximum',
			description: 'maximum',
			type: Aghanim.Eris.Constants.ApplicationCommandOptionTypes.STRING,
			required: false,
		}
	],
  run: async function (interaction, client, command){
    let min, max, random;
    const minimum = interaction.data.options ? interaction.data.options.find(option => option.name === 'minimum') : null
    const maximum = interaction.data.options ? interaction.data.options.find(option => option.name === 'maximum') : null
    if(!maximum && !minimum){
      min = 1;
      max = 6;
      random = Math.floor((Math.random() * max) + 1);
    }else if(maximum && minimum){
      console.log({maximum, minimum})
      min = parseInt(minimum.value);
      max = parseInt(maximum.value);
      if(typeof min !== 'number' || isNaN(min)){return}
      if(typeof max !== 'number' || isNaN(max)){return}
      random = Math.round(Math.random()*(max - min) + min)
    }else if(!maximum && minimum){
      min = parseInt(minimum.value);
      max = min + 6;
      if(typeof max !== 'number' || isNaN(max)){return}
      random = Math.floor((Math.random() * max) + 1)
    }else if(maximum && !minimum){
      min = 1;
      max = parseInt(maximum.value);
      if(typeof max !== 'number' || isNaN(max)){return}
      random = Math.floor((Math.random() * max) + 1)
    }
    return client.components.Locale.replyInteraction(interaction,'roll.text', {username : interaction.user.username, min, max, random})
  }
}
