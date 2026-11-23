const { ContainerBuilder } = require('discord.js');

/**
 * Build the categorized command reference.
 * @returns {import('discord.js').ContainerBuilder} A new message container.
 */
function buildHelpMenuCard() {
  return new ContainerBuilder()
    .setAccentColor(0x238575)
    .addTextDisplayComponents(text => text.setContent('## Command menu'))
    .addSeparatorComponents(separator => separator.setDivider(true))
    .addTextDisplayComponents(
      text => text.setContent('### General\n`!help` — Show this menu.\n`!profile [@user]` — View an account profile.'),
      text => text.setContent('### Music\n`!music` — Open an interactive demo playlist.'),
      text => text.setContent('### Moderation\n`!modlog [@user] [reason]` — Preview a moderation record.'),
    );
}

module.exports = { buildHelpMenuCard };
