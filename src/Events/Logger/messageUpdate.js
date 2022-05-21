const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (oldMessage, newMessage) => {
  if (!oldMessage.content && !newMessage.content) return;
  if (oldMessage.author.bot) return;

  if (oldMessage.guild.kanalBul('message-log')) {
    const Embed = new Discord.MessageEmbed()
    .setAuthor(oldMessage.member.displayName, oldMessage.author.avatarURL({ dynamic: true }))
    .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
    .setColor(Settings.Color)
    .setTimestamp()
    .setDescription(`${global.emojis.tick} ${oldMessage.channel} kanalında ${oldMessage.author} kişisi mesajını düzenledi.`)
    .addField(`Eski Mesaj`, Utils.ReklamKontrol(oldMessage.content) || Utils.KufurKontrol(oldMessage.content) ? `||${oldMessage.content}||` : oldMessage.content)
    .addField(`Yeni Mesaj`, Utils.ReklamKontrol(newMessage.content) || Utils.KufurKontrol(newMessage.content) ? `||${newMessage.content}||` : newMessage.content)

    oldMessage.guild.kanalBul('message-log').send({ embed: Embed });
  };
};

module.exports.config = {
    Event: "messageUpdate"
}
