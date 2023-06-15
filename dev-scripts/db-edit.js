const {firebase, db} = require('./firebase.js')
const axios = require('axios')

db.child('profiles').once('value').then(snap => {
  if(snap.exists()){
    const data = snap.val()
    const profiles = Object.keys(data).map(player => ({discordID : player, dotaID : data[player].profile.dota}))
    requestTs(profiles).then(() => {console.log('Updated profiles')})
  }
})

const requestTs = function(profiles){
  return profiles.reduce((promise, player) => {
    return promise.then(results => new Promise(res => {
      setTimeout(() => axios.get(`https://api.opendota.com/api/players/${player.dotaID}`).then(({data}) => {
        console.log(`Request for ${player.discordID}`)
        db.child(`profiles/${player.discordID}`).update({ dota: player.dotaID, steam: data.profile.steamid})
        res([])
      }), 1500)
    }))
  }, Promise.resolve([]))
}