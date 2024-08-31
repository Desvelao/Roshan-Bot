const { SimpleEnums } = require('../classes/enums');

//TODO Mirar name_id en idcardconfig
// const HEROES = {
//   "1" : {"name" : "Anti-Mage", "name_id" : "antimage", alias : ["antimage","am"]},
//   "2" : {"name" : "Axe", "name_id" : "axe", alias : ["axe"]},
//   "3" : {"name" : "Bane", "name_id" : "bane", alias : ["bane"]},
//   "4" : {"name" : "BloodSeeker", "name_id" : "bloodseeker", alias : ["bloodseeker","bs"]},
//   "5" : {"name" : "Crystal Maiden", "name_id" : "crystal_maiden", alias : ["crystalmaiden","cm"]},
//   "6" : {"name" : "Drow Ranger", "name_id" : "drow_ranger", alias : ["drow","dr"]},
//   "7" : {"name" : "Earthshaker", "name_id" : "earthshaker", alias : ["earthshaker","shaker"]},
//   "8" : {"name" : "Juggernaut", "name_id" : "juggernaut", alias : ["juggernaut", "yurnero"]},
//   "9" : {"name" : "Mirana", "name_id" : "mirana", alias : ["mirana","potm"]},
//   "10" : {"name" : "Morphling", "name_id" : "morphling", alias : ["morphling","morph"]},
//   "11" : {"name" : "Shadow Fiend", "name_id" : "shadow_fiend", alias : ["shadowfiend","sf"]},
//   "12" : {"name" : "Phantom Lancer", "name_id" : "phantom_lancer", alias : ["phantomlancer","pl"]},
//   "13" : {"name" : "Puck", "name_id" : "puck", alias : ["puck"]},
//   "14" : {"name" : "Pudge", "name_id" : "pudge", alias : ["pudge"]},
//   "15" : {"name" : "Razor", "name_id" : "razor", alias : ["razor"]},
//   "16" : {"name" : "Sand King", "name_id" : "sand_king", alias : ["sandking","sk"]},
//   "17" : {"name" : "Storm Spirit", "name_id" : "storm_spirit", alias : ["stormspirit","storm"]},
//   "18" : {"name" : "Sven", "name_id" : "sven", alias : ["sven"]},
//   "19" : {"name" : "Tiny", "name_id" : "tiny", alias : ["tiny"]},
//   "20" : {"name" : "Vengeful Spirit", "name_id" : "vengeful_spirit", alias : ["vengeful","vg"]},
//   "21" : {"name" : "Windranger", "name_id" : "windranger", alias : ["windranger","wr"]},
//   "22" : {"name" : "Zeus", "name_id" : "zuus", alias : ["zeus"]},
//   "23" : {"name" : "Kunkka", "name_id" : "kunkka", alias : ["kunkka"]},
//   "24" : {"name" : "", "name_id" : "", "alias" : []},
//   "25" : {"name" : "Lina", "name_id" : "lina", alias : ["lina"]},
//   "26" : {"name" : "Lion", "name_id" : "lion", alias : ["lion"]},
//   "27" : {"name" : "Shadow Shaman", "name_id" : "shadow_shaman", alias : ["shadowshaman","ss"]},
//   "28" : {"name" : "Slardar", "name_id" : "slardar", alias : ["slardar"]},
//   "29" : {"name" : "Tidehunter", "name_id" : "tidehunter", alias : ["tidehunter","tide"]},
//   "30" : {"name" : "Witch Doctor", "name_id" : "witch_doctor", alias : ["witchdoctor","wd"]},
//   "31" : {"name" : "Lich", "name_id" : "lich", alias : ["lich"]},
//   "32" : {"name" : "Riki", "name_id" : "riki", alias : ["riki"]},
//   "33" : {"name" : "Enigma", "name_id" : "enigma", alias : ["enigma"]},
//   "34" : {"name" : "Tinker", "name_id" : "tinker", alias : ["tinker"]},
//   "35" : {"name" : "Sniper", "name_id" : "sniper", alias : ["sniper"]},
//   "36" : {"name" : "Necrophos", "name_id" : "necrophos", alias : ["necrophos","necro"]},
//   "37" : {"name" : "Warlock", "name_id" : "warlock", alias : ["warlock"]},
//   "38" : {"name" : "Beastmaster", "name_id" : "beastmaster", alias : ["beastmaster"]},
//   "39" : {"name" : "Queen of Pain", "name_id" : "queen_of_pain", alias : ["queenofpain","queen"]},
//   "40" : {"name" : "Venomancer", "name_id" : "venomancer", alias : ["venomancer"]},
//   "41" : {"name" : "Faceless Void", "name_id" : "faceless_void", alias : ["void"]},
//   "42" : {"name" : "Wraith King", "name_id" : "skeleton_king", alias : ["wk"]},
//   "43" : {"name" : "Death Prophet", "name_id" : "death_prophet", alias : ["deathprophet","dp"]},
//   "44" : {"name" : "Phantom Assassin", "name_id" : "phantom_assassin", alias : ["phantomassasin","pa"]},
//   "45" : {"name" : "Pugna", "name_id" : "pugna", alias : ["pugna"]},
//   "46" : {"name" : "Templar Assassin", "name_id" : "templar_assassin", alias : ["templar","ta"]},
//   "47" : {"name" : "Viper", "name_id" : "viper", alias : ["viper"]},
//   "48" : {"name" : "Luna", "name_id" : "luna", alias : ["luna"]},
//   "49" : {"name" : "Dragon Knight", "name_id" : "dragon_knight", alias : ["dragonknight","dk"]},
//   "50" : {"name" : "Dazzle", "name_id" : "dazzle", alias : ["dazzle"]},
//   "51" : {"name" : "Clockwerk", "name_id" : "clockwerk", alias : ["clockwerk","clock"]},
//   "52" : {"name" : "Leshrac", "name_id" : "leshrac", alias : ["leshrac","lesh"]},
//   "53" : {"name" : "Nature's Prophet", "name_id" : "furion", alias : ["nature","np"]},
//   "54" : {"name" : "Lifestealer", "name_id" : "life_stealer", alias : ["lifestealer","ls"]},
//   "55" : {"name" : "Dark Seer", "name_id" : "dark_seer", alias : ["darkseer","ds"]},
//   "56" : {"name" : "Clinkz", "name_id" : "clinkz", alias : ["clinz"]},
//   "57" : {"name" : "Omniknight", "name_id" : "omniknight", alias : ["omni"]},
//   "58" : {"name" : "Enchantress", "name_id" : "enchantress", alias : ["enchantress","bambi"]},
//   "59" : {"name" : "Huskar", "name_id" : "huskar", alias : ["huskar"]},
//   "60" : {"name" : "Night Stalker", "name_id" : "night_stalker", alias : ["stalker","ns"]},
//   "61" : {"name" : "Broodmother", "name_id" : "broodmother", alias : ["brood"]},
//   "62" : {"name" : "Bounty Hunter", "name_id" : "bounty_hunter", alias : ["bh"]},
//   "63" : {"name" : "Weaver", "name_id" : "weaver", alias : ["weaver"]},
//   "64" : {"name" : "Jakiro", "name_id" : "jakiro", alias : ["jakiro"]},
//   "65" : {"name" : "Batrider", "name_id" : "batrider", alias : ["bat"]},
//   "66" : {"name" : "Chen", "name_id" : "chen", alias : ["chen"]},
//   "67" : {"name" : "Spectre", "name_id" : "spectre", alias : ["spectre"]},
//   "68" : {"name" : "Ancient Apparition", "name_id" : "ancient_apparition", alias : ["aa"]},
//   "69" : {"name" : "Doom", "name_id" : "doom", alias : ["doom"]},
//   "70" : {"name" : "Ursa", "name_id" : "ursa", alias : ["ursa"]},
//   "71" : {"name" : "Spirit Breaker", "name_id" : "spirit_breaker", alias : ["bara"]},
//   "72" : {"name" : "Gyrocopter", "name_id" : "gyrocopter", alias : ["gyro"]},
//   "73" : {"name" : "Alchemist", "name_id" : "alchemist", alias : ["alche"]},
//   "74" : {"name" : "Invoker", "name_id" : "invoker", alias : ["invoker","invo"]},
//   "75" : {"name" : "Silencer", "name_id" : "silencer", alias : ["silencer"]},
//   "76" : {"name" : "Outworld Devourer", "name_id" : "outworld_devourer", alias : ["od"]},
//   "77" : {"name" : "Lycan", "name_id" : "lycan", alias : ["lycan"]},
//   "78" : {"name" : "Brewmaster", "name_id" : "brewmaster", alias : ["brew"]},
//   "79" : {"name" : "Shadow Demon", "name_id" : "shadow_demon", alias : ["sd"]},
//   "80" : {"name" : "Lone Druid", "name_id" : "lone_druid", alias : ["lone","druid"]},
//   "81" : {"name" : "Chaos Knight", "name_id" : "chaos_knight", alias : ["ck"]},
//   "82" : {"name" : "Meepo", "name_id" : "meepo", alias : ["meepo"]},
//   "83" : {"name" : "Treant Protector", "name_id" : "treant_protector", alias : ["treant"]},
//   "84" : {"name" : "Ogre Magi", "name_id" : "ogre_magi", alias : ["ogre"]},
//   "85" : {"name" : "Undying", "name_id" : "undying", alias : ["undying"]},
//   "86" : {"name" : "Rubick", "name_id" : "rubick", alias : ["rubick"]},
//   "87" : {"name" : "Disruptor", "name_id" : "disruptor", alias : ["disruptor"]},
//   "88" : {"name" : "Nyx Assassin", "name_id" : "nyx_assassin", alias : ["nyx"]},
//   "89" : {"name" : "Naga Siren", "name_id" : "naga_siren", alias : ["naga","siren"]},
//   "90" : {"name" : "Keeper of the Light", "name_id" : "keeper_of_the_light", alias : ["kotl","keeper"]},
//   "91" : {"name" : "Io", "name_id" : "wisp", alias : ["io","wisp"]},
//   "92" : {"name" : "Visage", "name_id" : "visage", alias : ["visage"]},
//   "93" : {"name" : "Slark", "name_id" : "slark", alias : ["slark"]},
//   "94" : {"name" : "Medusa", "name_id" : "medusa", alias : ["medusa"]},
//   "95" : {"name" : "Troll Warlord", "name_id" : "troll_warlord", alias : ["troll"]},
//   "96" : {"name" : "Centaur Warrunner", "name_id" : "centaur_warrunner", alias : ["centaur","cw"]},
//   "97" : {"name" : "Magnus", "name_id" : "magnus", alias : ["magnus"]},
//   "98" : {"name" : "Timbersaw", "name_id" : "timbersaw", alias : ["timber"]},
//   "99" : {"name" : "Bristleback", "name_id" : "bristleback", alias : ["bristle"]},
//   "100" : {"name" : "Tusk", "name_id" : "tusk", alias : ["tusk"]},
//   "101" : {"name" : "Skywrath Mage", "name_id" : "skywrath_mage", alias : ["sky"]},
//   "102" : {"name" : "Abaddon", "name_id" : "abaddon", alias : ["abaddon","aba"]},
//   "103" : {"name" : "Elder Titan", "name_id" : "elder_titan", alias : ["elder","titan","et"]},
//   "104" : {"name" : "Legion Commander", "name_id" : "legion_commander", alias : ["legion","lc"]},
//   "105" : {"name" : "Techies", "name_id" : "techies", alias : ["techies"]},
//   "106" : {"name" : "Ember Spirit", "name_id" : "ember_spirit", alias : ["ember"]},
//   "107" : {"name" : "Earth Spirit", "name_id" : "earth_spirit", alias : ["earth"]},
//   "108" : {"name" : "Abyssal Underlord", "name_id" : "abyssal_underlord", alias : ["underlord"]},
//   "109" : {"name" : "Terrorblade", "name_id" : "terrorblade", alias : ["terrorblade","terror"]},
//   "110" : {"name" : "Phoenix", "name_id" : "phoenix", alias : ["phoenix"]},
//   "111" : {"name" : "Oracle", "name_id" : "oracle", alias : ["oracle"]},
//   "112" : {"name" : "Winter Wyvern", "name_id" : "winter_wyvern", alias : ["winter","wyvern","ww"]},
//   "113" : {"name" : "Arc Warden", "name_id" : "arc_warden", alias : ["arc","warden","aw"]},
//   "114" : {"name" : "Monkey King", "name_id" : "monkey_king", alias : ["monkey","mk"]},
//   "115" : {"name" : "", "name_id" : "", "alias" : []},
//   "116" : {"name" : "", "name_id" : "", "alias" : []},
//   "117" : {"name" : "", "name_id" : "", "alias" : []},
//   "118" : {"name" : "", "name_id" : "", "alias" : []},
//   "119" : {"name" : "Dark Willow", "name_id" : "dark_willow", alias : ["willow","dw"]},
//   "120" : {"name" : "Pangolier", "name_id" : "pangolier", alias : ["pango"]},
//   "121" : {"name" : "Grimstroke", "name_id" : "grimstroke", alias : ["gs"]},
//   "123" : {"name" : "Hoodwink", "name_id" : "hoodwink", alias : ["hw"]},
//   "126" : {"name" : "Void Spirit", "name_id" : "void_spirit", alias : []},
//   "128" : {"name" : "Snapfire", "name_id" : "snapfire", alias : ["snapfire"]},
//   "129" : {"name" : "Mars", "name_id" : "mars", alias : ["mars"]},
//   "130" : {"name" : "", "name_id" : "", alias : []},
//   "131" : {"name" : "", "name_id" : "", alias : []},
//   "132" : {"name" : "", "name_id" : "", alias : []},
//   "133" : {"name" : "", "name_id" : "", alias : []},
//   "134" : {"name" : "", "name_id" : "", alias : []},
//   "135" : {"name" : "Dawnbreaker", "name_id" : "dawnbreaker", alias : ["dawn"]},
//   "136" : {"name" : "Marci", "name_id" : "marci", alias : []},
//   "137" : {"name" : "Primal Beast", "name_id" : "primal_beast", alias : ["primal", "beast"]},
// }

const HEROES_ALIAS = {
  1: ['antimage', 'am'],
  2: ['axe'],
  3: ['bane'],
  4: ['bloodseeker', 'bs'],
  5: ['crystalmaiden', 'cm'],
  6: ['drow', 'dr'],
  7: ['earthshaker', 'shaker'],
  8: ['juggernaut', 'yurnero'],
  9: ['mirana', 'potm'],
  10: ['morphling', 'morph'],
  11: ['shadowfiend', 'sf'],
  12: ['phantomlancer', 'pl'],
  13: ['puck'],
  14: ['pudge'],
  15: ['razor'],
  16: ['sandking', 'sk'],
  17: ['stormspirit', 'storm'],
  18: ['sven'],
  19: ['tiny'],
  20: ['vengeful', 'vg'],
  21: ['windranger', 'wr'],
  22: ['zeus'],
  23: ['kunkka'],
  25: ['lina'],
  26: ['lion'],
  27: ['shadowshaman', 'ss'],
  28: ['slardar'],
  29: ['tidehunter', 'tide'],
  30: ['witchdoctor', 'wd'],
  31: ['lich'],
  32: ['riki'],
  33: ['enigma'],
  34: ['tinker'],
  35: ['sniper'],
  36: ['necrophos', 'necro'],
  37: ['warlock'],
  38: ['beastmaster'],
  39: ['queenofpain', 'queen'],
  40: ['venomancer'],
  41: ['void'],
  42: ['wk'],
  43: ['deathprophet', 'dp'],
  44: ['phantomassasin', 'pa'],
  45: ['pugna'],
  46: ['templar', 'ta'],
  47: ['viper'],
  48: ['luna'],
  49: ['dragonknight', 'dk'],
  50: ['dazzle'],
  51: ['clockwerk', 'clock'],
  52: ['leshrac', 'lesh'],
  53: ['nature', 'np'],
  54: ['lifestealer', 'ls'],
  55: ['darkseer', 'ds'],
  56: ['clinz'],
  57: ['omni'],
  58: ['enchantress', 'bambi'],
  59: ['huskar'],
  60: ['stalker', 'ns'],
  61: ['brood'],
  62: ['bh'],
  63: ['weaver'],
  64: ['jakiro'],
  65: ['bat'],
  66: ['chen'],
  67: ['spectre'],
  68: ['aa'],
  69: ['doom'],
  70: ['ursa'],
  71: ['bara'],
  72: ['gyro'],
  73: ['alche'],
  74: ['invoker', 'invo'],
  75: ['silencer'],
  76: ['od'],
  77: ['lycan'],
  78: ['brew'],
  79: ['sd'],
  80: ['lone', 'druid'],
  81: ['ck'],
  82: ['meepo'],
  83: ['treant'],
  84: ['ogre'],
  85: ['undying'],
  86: ['rubick'],
  87: ['disruptor'],
  88: ['nyx'],
  89: ['naga', 'siren'],
  90: ['kotl', 'keeper'],
  91: ['io', 'wisp'],
  92: ['visage'],
  93: ['slark'],
  94: ['medusa'],
  95: ['troll'],
  96: ['centaur', 'cw'],
  97: ['magnus'],
  98: ['timber'],
  99: ['bristle'],
  100: ['tusk'],
  101: ['sky'],
  102: ['abaddon', 'aba'],
  103: ['elder', 'titan', 'et'],
  104: ['legion', 'lc'],
  105: ['techies'],
  106: ['ember'],
  107: ['earth'],
  108: ['underlord'],
  109: ['terrorblade', 'terror'],
  110: ['phoenix'],
  111: ['oracle'],
  112: ['winter', 'wyvern', 'ww'],
  113: ['arc', 'warden', 'aw'],
  114: ['monkey', 'mk'],
  119: ['willow', 'dw'],
  120: ['pango'],
  121: ['gs'],
  123: ['hw'],
  128: ['snapfire'],
  129: ['mars'],
  131: ['ringmaster', 'rm'],
  135: ['dawn'],
  137: ['primal', 'beast'],
  138: ['muerta']
};

const { heroes, hero_abilities, abilities } = require('dotaconstants');

for (const key in heroes) {
  heroes[key].name_id = heroes[key].name.replace('npc_dota_hero_', '');
  heroes[key].alias = HEROES_ALIAS[key] ? HEROES_ALIAS[key] : [];
  heroes[key].abilities = hero_abilities[heroes[key].name].abilities
    .filter((ability) => ability !== 'generic_hidden')
    .map((ability) => abilities[ability].dname);
}

const enumHeroes = new SimpleEnums(heroes);

enumHeroes.getKeyByAlias = function (tag) {
  for (let [key, val] of this) {
    if (val.alias.includes(tag)) {
      return key;
    }
  }
  return undefined;
};

enumHeroes.getValueByAlias = function (tag) {
  for (let [key, val] of this) {
    if (
      [val.localized_name, ...val.alias]
        .map((v) => v.toLowerCase())
        .includes(tag.toLowerCase())
    ) {
      return val;
    }
  }
  return undefined;
};

enumHeroes.apiURL = 'https://api.opendota.com';
enumHeroes.dotaCdnURL = 'http://cdn.dota2.com';
enumHeroes.dotaWikiURL = 'http://dota2.gamepedia.com/';

module.exports = enumHeroes;
