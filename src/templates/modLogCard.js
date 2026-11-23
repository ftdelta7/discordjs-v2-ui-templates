const { ContainerBuilder, escapeMarkdown } = require('discord.js');

/**
 * Build a moderation record preview.
 * @param {object} options Record details.
 * @param {import('discord.js').User} options.target Account referenced by the record.
 * @param {import('discord.js').User} options.moderator Account recording the action.
 * @param {string} options.reason Reason shown on the card.
 * @param {number} [options.timestamp] Unix time in milliseconds.
 * @returns {import('discord.js').ContainerBuilder} A new message container.
 */
function buildModLogCard({ target, moderator, reason, timestamp = Date.now() }) {
  return new ContainerBuilder()
    .setAccentColor(0xd97706)
    .addTextDisplayComponents(text => text.setContent('## Moderation log preview'))
    .addSeparatorComponents(separator => separator.setDivider(true))
    .addTextDisplayComponents(
      text => text.setContent(`**Target** · <@${target.id}>\n**Moderator** · <@${moderator.id}>\n**Time** · <t:${Math.floor(timestamp / 1000)}:f>`),
      text => text.setContent(`**Reason**\n${escapeMarkdown(reason.trim() || 'No reason supplied.').slice(0, 2000)}`),
    );
}

module.exports = { buildModLogCard };
