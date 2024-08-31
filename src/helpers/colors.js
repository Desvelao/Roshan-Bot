function convertHexInt(color, mode) {
  parseInt(color.replace(/^#/, ''), 16);
}

module.exports.convertHexInt = convertHexInt;
