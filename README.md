# discordjs-v2-ui-templates

![Node.js 24.17+](https://img.shields.io/badge/Node.js-24.17%2B-43853D)
![discord.js v14](https://img.shields.io/badge/discord.js-v14-5865F2)
[![MIT License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

Four Discord Components V2 templates for CommonJS bots. Try them in a server with the included prefix-command runner, or copy an individual builder into your own bot. Each builder returns a fresh `ContainerBuilder`.

## Quick Start

1. Install Node.js 24.17 or newer, then clone the repository and install its dependencies.

   ```sh
   git clone https://github.com/ftdelta7/discordjs-v2-ui-templates.git
   cd discordjs-v2-ui-templates
   npm install
   ```

2. Create or select an application in the [Discord Developer Portal](https://discord.com/developers/applications). Open **Bot → Privileged Gateway Intents**, enable **Message Content Intent**, and save. The runner reads message text to recognize commands such as `!profile`.

3. Copy the environment template with `Copy-Item .env.example .env` in PowerShell or `cp .env.example .env` on macOS or Linux. Open `.env` and replace the value of `TOKEN` with the bot token from the application's **Bot** page. Keep the token private.

4. Install the bot in your test server with the **bot** scope and the **View Channels** and **Send Messages** permissions. To use it in threads, also grant **Send Messages in Threads**.

5. Run `npm run check` to verify syntax offline. To connect the bot, run `npm start`, wait for the ready message, and send `!help` in a channel the bot can access.

## Templates

The examples use paths relative to the repository root. In an async message handler, pass the incoming Discord message and the card to this shared send function.

```js
const { MessageFlags } = require('discord.js');

function sendCard(message, card) {
  return message.channel.send({
    flags: MessageFlags.IsComponentsV2,
    components: [card],
    allowedMentions: { parse: [] },
  });
}
```

### Profile card

`!profile [@user]` shows the account's display name, username, ID, and creation date alongside an avatar thumbnail. Omitting the mention shows the caller's profile.

```js
const { buildProfileCard } = require('./src/templates/profileCard');
const user = message.mentions.users.first() ?? message.author;
await sendCard(message, buildProfileCard(user));
```

![Profile Card Preview](./assets/profile-card.png)

### Music player

`!music` shows the current track, artist, duration, and playlist position. Below the divider, the caller can select **Previous**, **Pause/Resume**, or **Next**. The demo simulates playback by updating the card.

```js
const { buildMusicPlayerCard } = require('./src/templates/musicPlayer');
await sendCard(message, buildMusicPlayerCard(message.author.id));
```

For a custom playlist, pass `(ownerId, index, paused, tracks)`, where `tracks` is a nonempty array of objects with `title`, `artist`, and `duration` strings. Use the same playlist when processing button clicks. The runner includes the owner check and message update logic. [Button handler](./src/index.js)

![Music Player Preview](./assets/music-player.png)

### Help menu

`!help` groups commands under General, Music, and Moderation. Each category is a separate text display in an accented container, so you can edit one category without rebuilding the layout.

```js
const { buildHelpMenuCard } = require('./src/templates/helpMenu');
await sendCard(message, buildHelpMenuCard());
```

![Help Menu Preview](./assets/help-menu.png)

### Moderation log

`!modlog [@user] [reason]` previews a record containing the target, moderator, timestamp, and reason. The runner uses the caller as the moderator. Creating the card only displays the record.

```js
const { buildModLogCard } = require('./src/templates/modLogCard');
const card = buildModLogCard({
  target: message.mentions.users.first() ?? message.author,
  moderator: message.author,
  reason: 'Repeated off-topic posts after a reminder.',
});
await sendCard(message, card);
```

![Mod Log Preview](./assets/mod-log.png)

## Components V2 Rules & Gotchas

- Set `flags: MessageFlags.IsComponentsV2` when sending or updating a card. Once enabled, the flag persists for the life of the message. Put visible text inside components and omit the top-level `content`, `embeds`, `poll`, and `stickers` fields. [Discord component reference](https://docs.discord.com/developers/components/reference)
- Count the entire component tree toward the **40-component limit per message**. For example, the profile card uses five components across one container, one section, two text displays, and one thumbnail.
- Keep the **combined text across all text displays within 4,000 characters per message**. Include headings and Markdown formatting when calculating the total. [discord.js display components guide](https://discordjs.guide/legacy/popular-topics/display-components)
- Give each `SectionBuilder` **one to three** text displays and **one accessory**, either a `ThumbnailBuilder` or a `ButtonBuilder`. For text-only layouts such as the help menu, add text displays directly to the container. [Discord section reference](https://docs.discord.com/developers/components/reference#section)
- Include `allowedMentions: { parse: [] }` in sends, replies, and updates so user-supplied text can display mentions without notifying anyone.

## Contributing

Fork the repository and create a branch for your change. Keep each template self-contained and document its inputs and return value with JSDoc. Run `npm run check` before opening a pull request. Describe which command or template changed and how you verified it. For layout changes, a screenshot from a test server helps reviewers compare the result.

## License

Released under the [MIT License](./LICENSE).

---
*Not affiliated with or endorsed by Discord Inc. "Discord" is a registered trademark of Discord Inc.*
