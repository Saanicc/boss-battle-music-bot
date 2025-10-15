import { useMainPlayer } from "discord-player";
import { Interaction } from "discord.js";

export const handleInteraction = async (
  interaction: Interaction,
  collection: Record<string, { execute: (i: any) => Promise<any> }>,
  key: string
) => {
  if (!interaction.guild) return;

  const handler = collection[key as keyof typeof collection];
  if (!handler) return;

  const player = useMainPlayer();

  const context = {
    guild: interaction.guild,
  };
  await player.context.provide(context, () => handler.execute(interaction));
};
