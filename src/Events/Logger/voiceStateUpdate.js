const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (oldState, newState) => {
  const Embed = new Discord.MessageEmbed()
  .setAuthor(newState.member.displayName, newState.member.user.avatarURL({ dynamic: true }))
  .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
  .setColor(Settings.Color)
  .setTimestamp()

  const kanal = oldState.member.guild.kanalBul('voice-log');
  if (!kanal) return;
  const member = oldState.member;

  if (!oldState.channelID && newState.channelID) {
    kanal.send({ embed: Embed.setDescription(`<@${member.id}> (\`${member.user.tag}\`) kişisi \`${member.guild.channels.cache.get(newState.channelID) ? member.guild.channels.cache.get(newState.channelID).name : 'Bilinmeyen'}\` isimli ses kanalına giriş yaptı!`) }).catch(err => {});
  } else if (oldState.channelID && !newState.channelID) {
    kanal.send({ embed: Embed.setDescription(`<@${member.id}> (\`${member.user.tag}\`) kişisi \`${member.guild.channels.cache.get(oldState.channelID) ? member.guild.channels.cache.get(oldState.channelID).name : 'Bilinmeyen'}\` isimli ses kanalından çıkış yaptı!`) }).catch(err => {});
  } else if (oldState.channelID && newState.channelID && oldState.channelID != newState.channelID) {
    kanal.send({ embed: Embed.setDescription(`<@${member.id}> (\`${member.user.tag}\`) kişisi ses kanalını değiştirdi! (\`${member.guild.channels.cache.get(oldState.channelID) ? member.guild.channels.cache.get(oldState.channelID).name : 'Bilinmeyen'}\` **→** \`${member.guild.channels.cache.get(newState.channelID) ? member.guild.channels.cache.get(newState.channelID).name : 'Bilinmeyen'}\`)`) }).catch(err => {});
  };
};

module.exports.config = {
    Event: "voiceStateUpdate"
}
