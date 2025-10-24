import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";
import { emoji } from "../../utils/constants/emojis";
import { User } from "../../models/User";
import { getRankTitleWithEmoji } from "../../modules/rankSystem";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("View the DJ leaderboard");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  const guild = interaction.guild;
  if (!guild) {
    const message = buildEmbedMessage({ title: "No guild found." });
    return interaction.followUp(message);
  }

  const guildMembers = await guild.members.fetch();
  if (!guildMembers) {
    const message = buildEmbedMessage({ title: "No guild members found." });
    return interaction.followUp(message);
  }

  const getUserIds = () => {
    const users = guildMembers.filter((member) => !member.user.bot);
    return users.map((user) => user.id);
  };

  const findOrCreateUserInDB = async () => {
    const userIds = getUserIds();

    try {
      const users = await Promise.all(
        userIds.map(async (id) => {
          try {
            let user = await User.findOne({ guildId: guild.id, userId: id });
            if (!user) {
              user = await User.create({ guildId: guild.id, userId: id });
            }
            return user;
          } catch (err) {
            console.error(`Error processing user ${id}:`, err);
            return null;
          }
        })
      );
      return users.filter(Boolean);
    } catch (err) {
      console.error("Error finding or creating users:", err);
      throw new Error("Database error while finding/creating users.");
    }
  };

  const buildLeaderboardDescription = (users: any[]) => {
    const sorted = [...users].sort((a, b) =>
      b.level === a.level ? b.xp - a.xp : b.level - a.level
    );

    const lines = sorted.map((user, index) => {
      const rank = index + 1;
      const level = user.level ?? 0;
      return `**#${rank}** <@${
        user.userId
      }>\nLevel ${level} — ${getRankTitleWithEmoji(user.level)}\n`;
    });

    return lines.join("\n");
  };

  const users = await findOrCreateUserInDB();
  const leaderboardText = buildLeaderboardDescription(users);

  const embedMessage = buildEmbedMessage({
    title: `${emoji.victory} ${interaction.client.user.username}'s DJ leaderboard ${emoji.victory}`,
    titleFontSize: "md",
    description: leaderboardText,
    color: "info",
    thumbnail: interaction.client.user?.displayAvatarURL(),
    footerText: `${interaction.client.user.username} • Gaming music made simple`,
  });

  await interaction.followUp(embedMessage);
}
