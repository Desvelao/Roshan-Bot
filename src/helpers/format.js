module.exports.zerofication = function zerofication(text, digits) {
  const _digits = digits || 2;
  const _text = text.toString();
  if (_digits > _text.length) {
    return '0'.repeat(_digits - _text.length) + _text;
  }
  return _text;
};
