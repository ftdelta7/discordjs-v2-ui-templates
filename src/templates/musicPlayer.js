const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, escapeMarkdown } = require('discord.js');

const demoTracks = [
  { title: 'Night Train', artist: 'Signal House', duration: '3:42' },
  { title: 'Morning Tide', artist: 'Coastline', duration: '4:08' },
  { title: 'Window Seat', artist: 'Field Notes', duration: '2:56' },
];

// Each button encodes its destination so existing demos survive a bot restart.
/**
 * Build a playlist card with controls for its owner.
 * @param {string} ownerId Discord user ID allowed to use the controls.
 * @param {number} [index=0] Zero-based track index.
 * @param {boolean} [paused=false] Whether the player is paused.
 * @param {Array<{title: string, artist: string, duration: string}>} [tracks] Nonempty playlist.
 * @returns {import('discord.js').ContainerBuilder} A new message container.
 */
function buildMusicPlayerCard(ownerId, index = 0, paused = false, tracks = demoTracks) {
  const track = tracks[index];
  function control(label, destination, pause, style) {
    return new ButtonBuilder()
      .setLabel(label)
      .setStyle(style)
      .setCustomId(`music:${ownerId}:${destination}:${Number(pause)}:${label.toLowerCase()}`);
  }

  const previous = (index + tracks.length - 1) % tracks.length;
  const next = (index + 1) % tracks.length;
  const controls = new ActionRowBuilder().addComponents(
    control('Previous', previous, false, ButtonStyle.Secondary),
    control(paused ? 'Resume' : 'Pause', index, !paused, ButtonStyle.Primary),
    control('Next', next, false, ButtonStyle.Secondary),
  );

  return new ContainerBuilder()
    .setAccentColor(0x21834d)
    .addTextDisplayComponents(
      text => text.setContent(paused ? '## Paused' : '## Now playing'),
      text => text.setContent(`**${escapeMarkdown(track.title)}**\n${escapeMarkdown(track.artist)} · ${track.duration}\nTrack ${index + 1} of ${tracks.length}`),
    )
    .addSeparatorComponents(separator => separator.setDivider(true))
    .addActionRowComponents(controls);
}

module.exports = { buildMusicPlayerCard, demoTracks };
