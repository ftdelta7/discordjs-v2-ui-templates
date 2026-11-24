const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const { buildProfileCard } = require('./templates/profileCard.js');
const { buildMusicPlayerCard, demoTracks } = require('./templates/musicPlayer.js');
const { buildHelpMenuCard } = require('./templates/helpMenu.js');
const { buildModLogCard } = require('./templates/modLogCard.js');

const { buildWelcomeCard } = require('./templates/welcomeCard.js');
const { buildTicketPanel } = require('./templates/ticketPanel.js');
const { buildGiveawayCard } = require('./templates/giveawayCard.js');

function payload(card) {
  return { flags: MessageFlags.IsComponentsV2, components: [card], allowedMentions: { parse: [] } };
}

async function handleCommand(message) {
  if (!message.inGuild() || message.author.bot || message.webhookId) return;
  const match = /^!(profile|music|help|modlog|welcome|ticket|giveaway)(?:\s+([\s\S]*))?$/i.exec(message.content.trim());
  if (!match) return;

  const args = (match[2] ?? '').trim();
  const mention = /^<@!?(\d+)>(?:\s+|$)/.exec(args);
  const target = mention ? message.mentions.users.get(mention[1]) : message.author;
  if (!target) return;

  let card;
  switch (match[1].toLowerCase()) {
    case 'welcome':
      card = buildWelcomeCard({
        username: target.displayName,
        avatarUrl: target.displayAvatarURL(),
        serverName: message.guild.name,
        memberCount: message.guild.memberCount,
        rulesUrl: message.guild.rulesChannel?.url,
      });
      break;
    case 'ticket':
      card = buildTicketPanel();
      break;
    case 'giveaway':
      card = buildGiveawayCard({
        prize: 'Community prize pack',
        hostId: message.author.id,
        endsAt: Date.now() + 3_600_000,
      });
      break;
    case 'profile':
      card = buildProfileCard(target);
      break;
    case 'music':
      card = buildMusicPlayerCard(message.author.id);
      break;
    case 'help':
      card = buildHelpMenuCard();
      break;
    case 'modlog':
      card = buildModLogCard({
        target,
        moderator: message.author,
        reason: args.slice(mention?.[0].length ?? 0),
      });
      break;
  }
  await message.channel.send(payload(card));
}

async function handleInteraction(interaction) {
  let preview;
  if (interaction.isStringSelectMenu() && interaction.customId === 'ticket:category') {
    preview = `Selected category: ${interaction.values[0]}.`;
  } else if (interaction.isButton() && interaction.customId === 'ticket:create') {
    preview = 'Ticket preview: connect this button to your support workflow.';
  } else if (interaction.isButton() && interaction.customId === 'giveaway:join') {
    preview = 'Giveaway preview: connect this button to your entry handler.';
  }
  if (preview) {
    await interaction.reply({ content: preview, flags: MessageFlags.Ephemeral, allowedMentions: { parse: [] } });
    return;
  }
  if (!interaction.isButton() || !interaction.customId.startsWith('music:')) return;
  const match = /^music:(\d+):(\d+):([01]):(?:previous|next|pause|resume)$/.exec(interaction.customId);
  if (!match || Number(match[2]) >= demoTracks.length) {
    await interaction.reply({ content: 'Open a fresh player with !music.', flags: MessageFlags.Ephemeral, allowedMentions: { parse: [] } });
    return;
  }
  if (interaction.user.id !== match[1]) {
    await interaction.reply({ content: 'Use !music to open your own player.', flags: MessageFlags.Ephemeral, allowedMentions: { parse: [] } });
    return;
  }
  const card = buildMusicPlayerCard(match[1], Number(match[2]), match[3] === '1');
  await interaction.update(payload(card));
}

if (require.main === module) {
  require('dotenv').config();
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    allowedMentions: { parse: [], repliedUser: false },
  });
  client.once(Events.ClientReady, ready => console.log(`Ready as ${ready.user.tag}`));
  client.on(Events.MessageCreate, message => handleCommand(message).catch(error => console.error('Command failed', error.message)));
  client.on(Events.InteractionCreate, interaction => handleInteraction(interaction).catch(error => console.error('Interaction failed', error.message)));
  client.on(Events.Error, error => console.error('Discord client error', error.message));
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => client.destroy());

  const token = process.env.TOKEN?.trim();
  if (!token) throw new Error('Set TOKEN in the environment or .env before starting.');
  client.login(token).catch(error => {
    console.error('Discord login failed', error.message);
    process.exitCode = 1;
    client.destroy();
  });
}

module.exports = {
  buildProfileCard, buildMusicPlayerCard, buildHelpMenuCard, buildModLogCard,
  buildWelcomeCard, buildTicketPanel, buildGiveawayCard,
};
