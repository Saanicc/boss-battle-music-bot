import { GuildQueue, Track } from "discord-player";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ContainerBuilder,
  MessageCreateOptions,
  MessageFlags,
  SectionBuilder,
  SeparatorBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
} from "discord.js";
import { enemiesSlainButton } from "../../interactions/buttons/enemiesSlain";
import { slayEnemiesButton } from "../../interactions/buttons/slayEnemies";
import { stopButton } from "../../interactions/buttons/stop";
import { embedColors } from "../constants/constants";
import { queueManager } from "../../services/queueManager";
import { pauseButton } from "../../interactions/buttons/pause";
import { resumeButton } from "../../interactions/buttons/resume";
import { getFormattedTrackDescription } from "../helpers/getFormattedTrackDescription";
import { queueButton } from "../../interactions/buttons/queue";
import { nextButton } from "../../interactions/buttons/next";
import { previousButton } from "../../interactions/buttons/previous";
import { emoji } from "../constants/emojis";

const createProgressBar = (queue: GuildQueue, size = 16) => {
  return queue.node.createProgressBar({
    indicator: "▰",
    leftChar: "▰",
    rightChar: "▱",
    length: size,
    timecodes: false,
  });
};

export const buildNowPlayingMessage = (
  track: Track,
  isPlaying: boolean,
  queue: GuildQueue,
  footerText: string
): MessageCreateOptions => {
  const isBossQueue =
    (isPlaying || !isPlaying) && queueManager.getQueueType() === "boss";

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    isPlaying ? pauseButton : resumeButton,
    previousButton.setDisabled(queue?.history.previousTrack ? false : true),
    nextButton.setDisabled(queue?.history.nextTrack ? false : true),
    stopButton,
    queueButton
  );
  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    isBossQueue ? enemiesSlainButton : slayEnemiesButton
  );

  const progressBar = queue ? createProgressBar(queue) : "N/A";

  const container = new ContainerBuilder();

  const trackInfoText = new TextDisplayBuilder().setContent(`
### ${
    isPlaying ? `${emoji.play} Now Playing` : `${emoji.pause} Music Stopped`
  }  
${getFormattedTrackDescription(track, queue)}

**Progress**
${progressBar}
`);

  const requestedByText = new TextDisplayBuilder().setContent(footerText);

  const thumbnail = new ThumbnailBuilder().setURL(track.thumbnail);

  const headerSection = new SectionBuilder()
    .addTextDisplayComponents(trackInfoText)
    .setThumbnailAccessory(thumbnail);

  container.addSectionComponents(headerSection);

  if (queue) {
    const currentTrackNumber = queue.history.tracks.size + 1;
    const totalQueueNumber = queue.tracks.size + currentTrackNumber;

    const queueText = new TextDisplayBuilder().setContent(`
**Track** 
**${currentTrackNumber}** of **${totalQueueNumber}**
    `);

    container.addTextDisplayComponents(queueText);
  }

  const separator = new SeparatorBuilder();

  container.addSeparatorComponents(separator);
  container.addActionRowComponents(row, row2);
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(requestedByText);
  container.setAccentColor(
    isPlaying && !isBossQueue
      ? embedColors.nowPlaying
      : isPlaying && isBossQueue
      ? embedColors.bossMode
      : embedColors.paused
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [container],
  };
};
