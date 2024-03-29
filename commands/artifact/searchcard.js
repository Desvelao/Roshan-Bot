const max = 1024
module.exports = {
  name: ['searchcard','scard'],
  category : 'Artifact',
  help : 'Search cards',
  args : '<text>',
  enable: false,
  run: async function (msg, args, client, command){
    const query = args.from(1)
    if(!query){return}
    const filtered = client.components.Artifact.searchCard(query)
    if(!filtered.length){return msg.reply('searchcard.notfound',{query})}
    const reduced = reduceWithCount(filtered.map(c => c.name.english),max)
    return msg.reply({
      embed : {
        title: 'searchcard.title',
        fields : [
          {name: 'searchcard.text', value: '<_query>', inline: false},
          {name : 'searchcard.cards', value: '<_cards>', inline: false}
        ],
        footer: {text : 'searchcard.results'}
      }
    },{
      _query: query,
      _cards: reduced.text,
      results: reduced.count === filtered.length ? reduced.count : reduced.count + '/' + filtered.length
    })
  }
}

function reduceWithCount(array,max){
  let result = {count : 0, text : ''}
  result.text = array.reduce((acc,cur) => {
    if((acc + ', ' + cur).length < max){result.count++;return acc + ', ' + cur}
    else{return acc}
  })
  result.count++
  return result
}
