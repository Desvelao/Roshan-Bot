module.exports.SimpleEnums = class SimpleEnums extends Map {
  constructor(dictionary) {
    super(Object.keys(dictionary).map((key) => [key, dictionary[key]]));
  }
  getValue(key) {
    return this.get(String(key));
  }
  getKey(value) {
    for (let [key, val] of this) {
      if (val.toLowerCase() === value.toLowerCase()) {
        return key;
      }
    }
    return undefined;
  }
  toArray() {
    let array = [];
    for (let [k, v] of this.entries()) {
      array.push({ key: k, value: v });
    }
    return array;
  }
};
