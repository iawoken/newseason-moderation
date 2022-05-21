const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (message) => {
  if (message.author.bot || message.channel.type == "dm") return;

  if (message.guild.kanalBul('message-log')) {
    const Embed = new Discord.MessageEmbed()
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
    .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
    .setColor(Settings.Color)
    .setTimestamp()
    .setDescription(`${global.emojis.tick} ${message.channel} kanalından ${message.author} kişisinin mesajı silindi.`)
    .addField(`Mesaj Bilgileri`, `\`•\` Mesaj içeriği: ${Utils.ReklamKontrol(message.content) || Utils.KufurKontrol(message.content) ? `||${message.content}||` : message.content}\n\`•\` Mesaj ID: **${message.id}**\n\`•\` Silinme Tarihi: **${Utils.tarih(message.deletedTimestamp)}**`)
    .addField(`Gönderici Bilgileri`, `\`•\` Kullanıcı: ${message.member.toString()} **-** (\`${message.author.id}\`)\n\`•\` Oluşturulma Tarihi: **${Utils.tarih(message.author.createdTimestamp)}**`)

    message.guild.kanalBul('message-log').send({ embed: Embed });
  };
};

module.exports.config = {
    Event: "messageDelete"
}