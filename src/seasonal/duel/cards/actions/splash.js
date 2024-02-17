const { ActionCard } = require('../../core/card')

const damage = 2
module.exports = () => ActionCard({
    name: 'Splash',
    description: `Do **${damage}** damage to all enemy units`,
    mana: 2,
    run(sourcePlayer, targetPlayer, board) {
        targetPlayer.units.forEach(unit => unit.damaged(damage))
    }
})