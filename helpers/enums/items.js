const ITEMS = {
  "1": "blink_dagger",
  "2": "blades_of_attack",
  "3": "broadsword",
  "4": "chainmail",
  "5": "claymore",
  "6": "helm_of_iron_will",
  "7": "javelin",
  "8": "mithril_hammer",
  "9": "platemail",
  "10": "quarterstaff",
  "11": "quelling_blade",
  "12": "ring_of_protection",
  "13": "gauntlets_of_strength",
  "14": "slippers_of_agility",
  "15": "mantle_of_intelligence",
  "16": "iron_branch",
  "17": "belt_of_strength",
  "18": "band_of_elvenskin",
  "19": "robe_of_the_magi",
  "20": "circlet",
  "21": "ogre_axe",
  "22": "blade_of_alacrity",
  "23": "staff_of_wizardry",
  "24": "ultimate_orb",
  "25": "gloves_of_haste",
  "26": "morbid_mask",
  "27": "ring_of_regen",
  "28": "sages_mask",
  "29": "boots_of_speed",
  "30": "gem_of_true_sight",
  "31": "cloak",
  "32": "talisman_of_evasion",
  "33": "cheese",
  "34": "magic_stick",
  "35": "recipe_magic_wand",
  "36": "magic_wand",
  "37": "ghost_scepter",
  "38": "clarity",
  "39": "healing_salve",
  "40": "dust_of_appearance",
  "41": "bottle",
  "42": "observer_ward",
  "43": "sentry_ward",
  "44": "tango",
  "45": "animal_courier",
  "46": "town_portal_scroll",
  "47": "recipe_boots_of_travel",
  "48": "boots_of_travel",
  "49": "recipe_phase_boots",
  "50": "phase_boots",
  "51": "demon_edge",
  "52": "eaglesong",
  "53": "reaver",
  "54": "sacred_relic",
  "55": "hyperstone",
  "56": "ring_of_health",
  "57": "void_stone",
  "58": "mystic_staff",
  "59": "energy_booster",
  "60": "point_booster",
  "61": "vitality_booster",
  "62": "recipe_power_treads",
  "63": "power_treads",
  "64": "recipe_hand_of_midas",
  "65": "hand_of_midas",
  "66": "recipe_oblivion_staff",
  "67": "oblivion_staff",
  "68": "recipe_perseverance",
  "69": "perseverance",
  "70": "recipe_poor_mans_shield",
  "71": "poor_mans_shield",
  "72": "recipe_bracer",
  "73": "bracer",
  "74": "recipe_wraith_band",
  "75": "wraith_band",
  "76": "recipe_null_talisman",
  "77": "null_talisman",
  "78": "recipe_mekansm",
  "79": "mekansm",
  "80": "recipe_vladmirs_offering",
  "81": "vladmirs_offering",
  "85": "recipe_buckler",
  "86": "buckler",
  "87": "recipe_ring_of_basilius",
  "88": "ring_of_basilius",
  "89": "recipe_pipe_of_insight",
  "90": "pipe_of_insight",
  "91": "recipe_urn_of_shadows",
  "92": "urn_of_shadows",
  "93": "recipe_headdress",
  "94": "headdress",
  "95": "recipe_scythe_of_vyse",
  "96": "scythe_of_vyse",
  "97": "recipe_orchid_malevolence",
  "98": "orchid_malevolence",
  "99": "recipe_euls_scepter_of_divinity",
  "100": "euls_scepter_of_divinity",
  "101": "recipe_force_staff",
  "102": "force_staff",
  "103": "recipe_dagon",
  "104": "dagon",
  "105": "recipe_necronomicon",
  "106": "necronomicon",
  "107": "recipe_aghanim_scepter",
  "108": "aghanim_scepter",
  "109": "recipe_refresher_orb",
  "110": "refresher_orb",
  "111": "recipe_assault_cuirass",
  "112": "assault_cuirass",
  "113": "recipe_heart_of_tarrasque",
  "114": "heart_of_tarrasque",
  "115": "recipe_black_king_bar",
  "116": "black_king_bar",
  "117": "aegis_of_the_immortal",
  "118": "recipe_shivas_guard",
  "119": "shivas_guard",
  "120": "recipe_bloodstone",
  "121": "bloodstone",
  "122": "recipe_linkens_sphere",
  "123": "linkens_sphere",
  "124": "recipe_vanguard",
  "125": "vanguard",
  "126": "recipe_blade_mail",
  "127": "blade_mail",
  "128": "recipe_soul_booster",
  "129": "soul_booster",
  "130": "recipe_hood_of_defiance",
  "131": "hood_of_defiance",
  "132": "recipe_divine_rapier",
  "133": "divine_rapier",
  "134": "recipe_monkey_king_bar",
  "135": "monkey_king_bar",
  "136": "recipe_radiance",
  "137": "radiance",
  "138": "recipe_butterfly",
  "139": "butterfly",
  "140": "recipe_daedalus",
  "141": "daedalus",
  "142": "recipe_skull_basher",
  "143": "skull_basher",
  "144": "recipe_battle_fury",
  "145": "battle_fury",
  "146": "recipe_manta_style",
  "147": "manta_style",
  "148": "recipe_crystalys",
  "149": "crystalys",
  "150": "recipe_armlet_of_mordiggian",
  "151": "armlet_of_mordiggian",
  "152": "shadow_blade",
  "153": "recipe_sange_and_yasha",
  "154": "sange_and_yasha",
  "155": "recipe_satanic",
  "156": "satanic",
  "157": "recipe_mjollnir",
  "158": "mjollnir",
  "159": "recipe_eye_of_skadi",
  "160": "eye_of_skadi",
  "161": "recipe_sange",
  "162": "sange",
  "163": "recipe_helm_of_the_dominator",
  "164": "helm_of_the_dominator",
  "165": "recipe_maelstrom",
  "166": "maelstrom",
  "167": "recipe_desolator",
  "168": "desolator",
  "169": "recipe_yasha",
  "170": "yasha",
  "171": "recipe_mask_of_madness",
  "172": "mask_of_madness",
  "173": "recipe_diffusal_blade",
  "174": "diffusal_blade",
  "175": "recipe_ethereal_blade",
  "176": "ethereal_blade",
  "177": "recipe_soul_ring",
  "178": "soul_ring",
  "179": "recipe_arcane_boots",
  "180": "arcane_boots",
  "181": "orb_of_venom",
  "182": "stout_shield",
  "183": "recipe_invis_sword",
  "184": "recipe_drum_of_endurance",
  "185": "drum_of_endurance",
  "186": "recipe_medallion_of_courage",
  "187": "medallion_of_courage",
  "188": "smoke_of_deceit",
  "189": "recipe_veil_of_discord",
  "190": "veil_of_discord",
  "191": "recipe_necronomicon_level_2",
  "192": "recipe_necronomicon_level_3",
  "193": "necronomicon_level_2",
  "194": "necronomicon_level_3",
  "196": "diffusal_blade_2",
  "197": "recipe_dagon_level_2",
  "198": "recipe_dagon_level_3",
  "199": "recipe_dagon_level_4",
  "200": "recipe_dagon_level_5",
  "201": "dagon_level_2",
  "202": "dagon_level_3",
  "203": "dagon_level_4",
  "204": "dagon_level_5",
  "205": "recipe_rod_of_atos",
  "206": "rod_of_atos",
  "207": "recipe_abyssal_blade",
  "208": "abyssal_blade",
  "209": "recipe_heavens_halberd",
  "210": "heavens_halberd",
  "211": "recipe_ring_of_aquila",
  "212": "ring_of_aquila",
  "213": "recipe_tranquil_boots",
  "214": "tranquil_boots",
  "215": "shadow_amulet",
  "216": "enchanted_mango",
  "217": "recipe_observer_and_sentry_wards",
  "218": "observer_and_sentry_wards",
  "219": "recipe_boots_of_travel_level_2",
  "220": "boots_of_travel_level_2",
  "221": "recipe_lotus_orb",
  "222": "recipe_meteor_hammer",
  "223": "meteor_hammer",
  "224": "recipe_nullifier",
  "225": "nullifier",
  "226": "lotus_orb",
  "227": "recipe_solar_crest",
  "228": "recipe_octarine_core",
  "229": "solar_crest",
  "230": "recipe_guardian_greaves",
  "231": "guardian_greaves",
  "232": "aether_lens",
  "233": "recipe_aether_lens",
  "234": "recipe_dragon_lance",
  "235": "octarine_core",
  "236": "dragon_lance",
  "237": "faerie_fire",
  "238": "recipe_iron_talon",
  "239": "iron_talon",
  "240": "blight_stone",
  "241": "tango_shared",
  "242": "crimson_guard",
  "243": "recipe_crimson_guard",
  "244": "wind_lace",
  "245": "recipe_bloodthorn",
  "246": "recipe_moon_shard",
  "247": "moon_shard",
  "248": "recipe_silver_edge",
  "249": "silver_edge",
  "250": "bloodthorn",
  "251": "recipe_echo_sabre",
  "252": "echo_sabre",
  "253": "recipe_glimmer_cape",
  "254": "glimmer_cape",
  "255": "recipe_aeon_disk",
  "256": "aeon_disk",
  "257": "tome_of_knowledge",
  "258": "recipe_kaya",
  "259": "kaya",
  "260": "refresher_shard",
  "262": "recipe_hurricane_pike",
  "263": "hurricane_pike",
  "265": "infused_raindrop",
  "266": "recipe_spirit_vessel",
  "267": "spirit_vessel",
  "275": "trident",
  "276": "combo_breaker",
  "1021": "river_painter",
  "1022": "river_painter2",
  "1023": "river_painter3",
  "1024": "river_painter4",
  "1025": "river_painter5",
  "1026": "river_painter6",
  "1027": "river_painter7"
}


module.exports = function(id){
  const item = ITEMS[id] || null
  return !item.includes('recipe') ? ITEMS[id] : null
}

module.exports.items = ITEMS