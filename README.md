# Gaming music bot

**Gaming Music Bot** is a Discord bot that brings dynamic soundtracks to your gaming sessions.
Whether you’re relaxing with background music or preparing for an epic boss fight, this bot delivers the perfect vibe.
Summon it anytime to power up your gameplay with cinematic, high-energy music. 🎮🎵

---

## ✨ Features

- 🎵 **Play boss music** from your pre-curated collection
- 🔀 **Shuffles and reshuffles** boss tracks automatically
- 📊 **Dynamic "Now Playing" embed** with:
  - Song name
  - Artist
  - Album art
  - Progress bar
  - Track number and duration
  - Requester tag
- ⏯️ **Interactive buttons** — Pause, Resume, Fight, Victory and Stop
- 📡 **Auto updates** current song info every second
- 💬 Clean, responsive embeds for a sleek experience

---

## 🧩 Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `/play`            | Play a track from name or URL              |
| `/play_boss_music` | Loads, shuffles and plays all boss tracks  |
| `/add_track`       | Add new track to the boss music collection |
| `/help`            | Shows info about available commands        |

---

## 🪄 Button Controls

| Button | Action                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------- |
| **⏸**  | Pauses music playback                                                                             |
| **⏵**  | Resume music playback                                                                             |
| **⚔️** | Reloads and shuffles all boss tracks                                                              |
| **🏆** | Resumes old music queue if available, if not available it stops playback and leaves voice channel |
| **⏹**  | Stops playback and leaves the voice channel                                                       |

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/boss-battle-music.git
cd boss-battle-music
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a .env file in the root folder:

```
DISCORD_TOKEN=your-bot-token
CLIENT_ID=your-client-id
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

### 4. Run the bot

For local development:

```bash
npm run dev
```

Or with Docker Compose:

```bash
docker compose up -d
```

## 💾 Volumes

Your music library is mounted as a volume in Docker, so you can easily add or replace songs without rebuilding the container.

```bash
volumes:
  - ./music:/app/music
```

✅ Make sure both `/music` and `/music/horns` folders are included.

## 🚀 Example Usage

When you’re facing a boss or epic challenge in-game:

```bash
/play_boss_music
```

The bot joins your voice channel and blasts a shuffled selection of your boss music collection.  
You’ll see a Now Playing embed with progress bar and interactive buttons.

## 🧠 Technical Notes

- Built with TypeScript and discord-player
- Self-hosted friendly — no external API costs
- Automatic queue and playback management

## 🏁 License

This project is licensed under the MIT License — feel free to modify and self-host.
