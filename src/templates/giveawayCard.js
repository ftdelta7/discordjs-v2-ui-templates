const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  escapeMarkdown,
} = require('discord.js');

/**
 * Builds a Components V2 card for an active giveaway.
 *
 * @param {object} options
 * @param {string} options.prize - Prize offered to the winner
 * @param {string} options.hostId - Discord user ID of the host
 * @param {number} options.endsAt - Giveaway end time in Unix milliseconds
 * @param {number} [options.entryCount=0] - Current number of entries
 * @returns {ContainerBuilder}
 */
function buildGiveawayCard({ prize, hostId, endsAt, entryCount = 0 }) {
  const actionRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('giveaway:join')
      .setLabel('Join Giveaway')
      .setStyle(ButtonStyle.Success)
  );

  return new ContainerBuilder()
    .setAccentColor(0x21834d)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Active giveaway'),
      new TextDisplayBuilder().setContent(
        `**Prize** · ${escapeMarkdown(prize)}\n**Host** · <@${hostId}>\n**Ends** · <t:${Math.floor(endsAt / 1000)}:R>\n**Entries** · ${entryCount}`
      )
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .addActionRowComponents(actionRow);
}

module.exports = { buildGiveawayCard };
