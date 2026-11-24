const {
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');

/**
 * Builds a Components V2 support ticket panel.
 *
 * @returns {ContainerBuilder}
 */
function buildTicketPanel() {
  const headerSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Support tickets'),
      new TextDisplayBuilder().setContent('Choose a category below, then select **Create Ticket**.')
    )
    .setButtonAccessory(
      new ButtonBuilder()
        .setCustomId('ticket:create')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
    );

  const actionRow = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('ticket:category')
      .setPlaceholder('Choose a ticket category')
      .addOptions(
        { label: 'General Support', value: 'general' },
        { label: 'Bug Report', value: 'bug' },
        { label: 'Billing', value: 'billing' }
      )
  );

  return new ContainerBuilder()
    .setAccentColor(0x5865f2)
    .addSectionComponents(headerSection)
    .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
    .addActionRowComponents(actionRow);
}

module.exports = { buildTicketPanel };
