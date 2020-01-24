export enum SetId {
  ADVENTURES = "adventures",
  ALCHEMY = "alchemy",
  BASE_SET = "baseset",
  BASE_SET_2 = "baseset2",
  CORNUCOPIA = "cornucopia",
  DARK_AGES = "darkages",
  EMPIRES = "empires",
  GUILDS = "guilds",
  GUILDSCONUCOPIA = "guildscornucopia",
  HINTERLANDS = "hinterlands",
  INTRIGUE = "intrigue",
  INTRIGUE_2 = "intrigue2",
  NOCTURNE = "nocturne",
  PROMOS = "promos",
  PROSPERITY = "prosperity",
  RENAISSANCE = "renaissance",
  SEASIDE = "seaside",
};

export const IgnoreSetIdKingdoms =
    new Set([ SetId.PROMOS,
              SetId.GUILDSCONUCOPIA
]);

export const IgnoreSetIdRandomize =
    new Set([ 
              SetId.GUILDSCONUCOPIA
]);

export const IgnoreSetIdSet = IgnoreSetIdRandomize;

export const IgnoreSetIdRules =
    new Set([ SetId.PROMOS ]);


export const IgnoreSetIdRulesFR =
    new Set([ SetId.PROMOS,
              SetId.BASE_SET_2, 
              SetId.INTRIGUE_2,
              SetId.GUILDSCONUCOPIA,
              SetId.RENAISSANCE,
              SetId.EMPIRES,
              SetId.NOCTURNE
]);
