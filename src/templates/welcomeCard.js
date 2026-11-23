const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

/**
 * Builds a clean Components V2 welcome card for new server members.
 *
 * @param {object} options
 * @param {string} options.username - Display name or tag of the joining member
 * @param {string} options.avatarUrl - Member's avatar URL
 * @param {string} options.serverName - Name of the Discord server
 * @param {number} options.memberCount - Updated total member count
 * @param {string} [options.rulesUrl] - Optional link to server rules or website
 * @returns {ContainerBuilder}
 */
function buildWelcomeCard({
  username,
  avatarUrl,
  serverName,
  memberCount,
  rulesUrl = 'https://discord.com',
}) {
  const headerSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## Welcome to ${serverName}!`),
      new TextDisplayBuilder().setContent(
        `Hey **${username}**, glad you joined us. You are member **#${memberCount}**.`
      )
    )
    .setThumbnailAccessory(
      new ThumbnailBuilder()
        .setURL(avatarUrl)
        .setDescription(`${username}'s avatar`)
    );

  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Server Rules')
      .setStyle(ButtonStyle.Link)
      .setURL(rulesUrl)
  );

  return new ContainerBuilder()
    .setAccentColor(0xe50914)
    .addSectionComponents(headerSection)
    .addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(true)
    )
    .addActionRowComponents(actionRow);
}

module.exports = { buildWelcomeCard };
