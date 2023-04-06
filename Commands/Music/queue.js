const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require('discord.js')
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show music queue.'),

  async execute(interaction) {
    const { member, guild } = interaction;

    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor('Red').setDescription('You must be in voice channel.');
      return interaction.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor('Red').setDescription(`Player already active in <#${guild.members.me.voice.channelId}>`)
      return interaction.reply({ embeds: [embed] });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
          embed.setColor("Red").setDescription("There is no active queue.");
          return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      embed.setColor('Purple').setDescription(`${queue.songs.map(
        (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
      )}`);
      return interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log(err);
      
      embed.setColor('Red').setDescription('Something went wrong...');
      return interaction.reply({ embeds: [embed] });
    }
  }
}
