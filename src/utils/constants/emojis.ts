type Emoji =
  | "play"
  | "pause"
  | "previous"
  | "next"
  | "queue"
  | "levelup"
  | "treasure"
  | "info"
  | "fight"
  | "victory";

type XpEmoji = "coins" | "gold" | "rare" | "epic" | "legendary";

type RankEmoji =
  | "grandmaster"
  | "elite"
  | "pro"
  | "specialist"
  | "rising"
  | "enthusiast"
  | "listener";

export const emoji: Record<Emoji, string> = {
  play: "<:play:1431066649116672171>",
  pause: "<:pause:1431066657249558669>",
  previous: "<:left:1431066658675622020>",
  next: "<:right:1431066660306948246>",
  queue: "<:queue:1431066663004016690>",
  levelup: "<:levelup:1431066666795798610>",
  treasure: "<:crate:1431064935760134306>",
  info: "<:info:1431066661661970533>",
  fight: "<:swords:1431064938922901625>",
  victory: "<:trophy:1431064937123283135>",
};

export const rankEmoji: Record<RankEmoji, string> = {
  grandmaster: "<:level7:1431064932920725636>",
  elite: "<:level6:1431064934590054481>",
  pro: "<:level5:1431064931721285753>",
  specialist: "<:level4:1431064929670009004>",
  rising: "<:level3:1431064928579485766>",
  enthusiast: "<:level2:1431064927006625862>",
  listener: "<:level1:1431064925375168582>",
};

export const xpEmoji: Record<XpEmoji, string> = {
  legendary: "<:chalice:1431073260551798877>",
  epic: "<:diamond:1431072331186442380>",
  rare: "<:chest:1431073259499159653>",
  gold: "<:gold:1431072329714110545>",
  coins: "<:coins:1431072332386013316>",
};
