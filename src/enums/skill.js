const { SimpleEnums } = require('../classes/enums');

const SKILL = {
  0: 'Any',
  1: 'Normal',
  2: 'High',
  3: 'Very High'
};
module.exports = new SimpleEnums(SKILL);
