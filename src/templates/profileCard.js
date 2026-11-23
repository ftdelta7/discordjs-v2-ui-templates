const {
  ContainerBuilder, SectionBuilder, ThumbnailBuilder, escapeMarkdown,
} = require('discord.js');

/**
 * Build a profile section with an avatar thumbnail.
 * @param {import('discord.js').User} user Discord account to display.
 * @returns {import('discord.js').ContainerBuilder} A new message container.
 */
function buildProfileCard(user) {
  const created = Math.floor(user.createdTimestamp / 1000);
  const avatar = new ThumbnailBuilder()
    .setURL(user.displayAvatarURL({ size: 256 }))
    .setDescription('Profile avatar');

  const section = new SectionBuilder()
    .addTextDisplayComponents(
      text => text.setContent(`## ${escapeMarkdown(user.displayName)}`),
      text => text.setContent(`**Username** · ${escapeMarkdown(user.username)}\n**User ID** · ${user.id}\n**Created** · <t:${created}:D>`),
    )
    .setThumbnailAccessory(avatar);

  return new ContainerBuilder().setAccentColor(0x5865f2).addSectionComponents(section);
}

module.exports = { buildProfileCard };
