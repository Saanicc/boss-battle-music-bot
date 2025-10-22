import { ButtonInteraction, CommandInteraction, TextChannel } from "discord.js";
import { addXP, XPGrantingCommand } from "../../modules/xpSystem";
import { getRankTitle } from "../../modules/rankSystem";
import { buildEmbedMessage } from "../embeds/embedMessage";
import { getTreasureMessage } from "./getTreasureMessage";

export const updateUserLevel = async (
  interaction: CommandInteraction | ButtonInteraction,
  guildId: string,
  command: XPGrantingCommand
) => {
  const {
    user,
    gainedXP,
    leveledUp,
    levelsGained,
    treasure,
    noXP,
    previousLevel,
  } = await addXP(guildId, interaction.user.id, command);

  if (noXP) return; // cooldown

  if (treasure) {
    const message = buildEmbedMessage({
      title: "🎁 Hidden tresure found!",
      description: getTreasureMessage(interaction.user.toString(), gainedXP),
    });
    await (interaction.channel as TextChannel).send(message);
  }

  if (leveledUp) {
    const oldRank = getRankTitle(previousLevel);
    const newRank = getRankTitle(user.level);

    let rankMessage = "";
    if (oldRank !== newRank) {
      rankMessage = `\nNew rank: **${newRank}**!`;
    }

    const message = buildEmbedMessage({
      title: "⬆️ Level up!",
      description: `${interaction.user.toString()} gained **${levelsGained} ${
        levelsGained > 1 ? "levels" : "level"
      }** and is now **Level ${user.level}**!${rankMessage}`,
    });
    await (interaction.channel as TextChannel).send(message);
  }
};
