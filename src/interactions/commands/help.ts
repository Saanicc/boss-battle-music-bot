import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { buildEmbedMessage } from "../../utils/embeds/embedMessage";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("View a list of commands and how to use them.");

export async function execute(interaction: ChatInputCommandInteraction) {
  const description = `
Welcome, **brave listener!** ⚔️  
Here's how to summon the power of music and unleash epic soundtracks:

🎵 **/play**
> Play any song by name or URL.  
> *Example:* \`/play query: Never Gonna Give You Up\`

🔥 **/play_boss_music**
> Instantly summon **EPIC boss battle music**!  
> Perfect for intense raids, duels, or just feeling awesome.

💾 **/add_track**
> Add a new **boss battle track** to the bot's arsenal. 
> *Example:* \`/add_track url:https://spotify.com/track/abc123\`
`;

  const embedMessage = buildEmbedMessage({
    title: `⚔️ ${interaction.client.user.username}'s help menu`,
    color: "info",
    description,
    thumbnail: interaction.client.user?.displayAvatarURL(),
    footerText: `${interaction.client.user.username} • Gaming music made simple`,
  });

  await interaction.reply(embedMessage);
}
