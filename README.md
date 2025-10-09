# ⚔️ Boss Battle Music

**Boss Battle Music** is a Discord bot designed to enhance your gaming sessions.  
When you and your friends encounter tough enemies or boss fights, summon the bot to unleash an epic soundtrack and fuel your victory. 🎶🔥

---

## ✨ Features

- 🎵 **Play boss music** from your local collection
- 🔀 **Shuffles and reshuffles** tracks automatically
- 📊 **Dynamic "Now Playing" embed** with:
  - Progress bar
  - Track number and duration
  - Requester tag
- ⏯️ **Interactive buttons** — Slay enemies (Play), Enemies slain (Pause), or Stop
- 📡 **Auto updates** current song info every second
- 💬 Clean, responsive embeds for a sleek experience

---

## 🧩 Commands

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `/play_boss_music` | Loads and shuffles all boss tracks             |
| `/add_song`        | Add new music or horn sounds to the collection |
| `/stop`            | Stops playback and leaves the voice channel    |

---

## 🪄 Button Controls

| Button            | Action                                      |
| ----------------- | ------------------------------------------- |
| **Enemies slain** | Pauses music playback                       |
| **Slay enemies**  | Reloads and shuffles all songs              |
| **Stop**          | Stops playback and leaves the voice channel |

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

The bot joins your voice channel and blasts a randomized selection of your best tracks.  
You’ll see a Now Playing embed with progress bar and interactive buttons.

## 🧠 Technical Notes

- Built with TypeScript and discord-player
- Self-hosted friendly — no external API costs
- Automatic queue and playback management

## 🏁 License

This project is licensed under the MIT License — feel free to modify and self-host.
