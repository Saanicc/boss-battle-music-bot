type Rank =
  | "grandmaster"
  | "elite"
  | "pro"
  | "specialist"
  | "rising"
  | "enthusiast"
  | "listener";

type RankInfo = {
  title: string;
  emoji: string;
  imageUrl: string;
};

export const ranks: Record<Rank, RankInfo> = {
  grandmaster: {
    title: "Grandmaster DJ",
    emoji: "<:level7:1431064932920725636>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064932920725636.png",
  },
  elite: {
    title: "Elite Mixer",
    emoji: "<:level6:1431064934590054481>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064934590054481.png",
  },
  pro: {
    title: "Pro Beatmaker",
    emoji: "<:level5:1431064931721285753>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064931721285753.png",
  },
  specialist: {
    title: "Sound Specialist",
    emoji: "<:level4:1431064929670009004>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064929670009004.png",
  },
  rising: {
    title: "Rising DJ",
    emoji: "<:level3:1431064928579485766>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064928579485766.png",
  },
  enthusiast: {
    title: "Beat Enthusiast",
    emoji: "<:level2:1431064927006625862>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064927006625862.png",
  },
  listener: {
    title: "Listener",
    emoji: "<:level1:1431064925375168582>",
    imageUrl: "https://cdn.discordapp.com/emojis/1431064925375168582.png",
  },
};
