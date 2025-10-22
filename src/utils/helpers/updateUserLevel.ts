import { ButtonInteraction, CommandInteraction, TextChannel } from "discord.js";
import { addXP, XPGrantingCommand } from "../../modules/xpSystem";
import { buildEmbedMessage } from "../embeds/embedMessage";
import { getTreasureMessage } from "./getTreasureMessage";

export const updateUserLevel = async (
  interaction: CommandInteraction | ButtonInteraction,
  guildId: string,
  command: XPGrantingCommand
) => {
  // @ts-ignore
  const { user, gainedXP, leveledUp, levelsGained, treasure, noXP } =
    await addXP(guildId, interaction.user.id, command);

  if (noXP) return; // cooldown

  if (treasure) {
    const message = buildEmbedMessage({
      title: "Hidden tresure found!",
      description: getTreasureMessage(interaction.user.toString(), gainedXP),
    });
    await (interaction.channel as TextChannel).send(message);
  }

  if (leveledUp) {
    const message = buildEmbedMessage({
      title: "Leveled up!",
      description: `${interaction.user.toString()} gained **${levelsGained} ${
        levelsGained > 1 ? "levels" : "level"
      }** and is now **Level ${user.level}**!`,
    });
    await (interaction.channel as TextChannel).send(message);
  }
};
