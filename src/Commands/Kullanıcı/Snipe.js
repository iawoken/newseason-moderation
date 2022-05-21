const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');

module.exports = {
    name: "snipe",
    aliases: ['snipes'],

    onLoad: function (client) {
      client.on("messageDelete", async message => {
        if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
        global.snipes.set(message.id, {
          ID: message.id,
          Kanal: message.channel.id,
          Author: message.author.id,
          Yazilma: message.createdTimestamp,
          Silinme: Date.now(),
          Mesaj: message.content ? message.content : `Yok`,
          Dosya: message.attachments.first() ? true : false
        });
      });
    },

    onCommand: async function (client, message, args) {
      if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});
      let Snipes = global.snipes.filter(data => data.Kanal == message.channel.id).map(xd => xd);
      Snipes = Snipes.sort((a, b) => Number(b.Yazilma) - Number(a.Yazilma));
      Snipes = Snipes.slice(0, 1);
      if(!Snipes || Snipes.length <= 0) return message.inlineReply(`Hata: Bu kanalda silinen bir mesaj bulunamadı.`).catch(err => {});

      const Embed = new Discord.MessageEmbed()
      .setColor(Settings.Color)
      .setAuthor(message.guild, message.guild.iconURL({ dynamic: true }))
      .setFooter(Settings.EmbedFooter, message.author.avatarURL({ dynamic: true, size: 2048 }))
      .setDescription(`${global.emojis.tick} Bu kanalda silinen son **${Snipes.length}** mesaj aşağıda belirtilmiştir.\n\u200b`);

      Snipes.map((data) => {
        Embed.addField(`${message.guild.members.cache.get(data.Author).user.tag} - ${data.ID}`, `» Mesaj Sahibi: <@${data.Author}> \`-\` **${data.Author}**\n» Yazılma Tarihi: \`${Utils.tarih(data.Yazilma)}\`\n» Silinme Tarihi: \`${Utils.tarih(data.Silinme)}\`\n» Mesaj İçeriği: ${data.Mesaj !== "Yok" ? data.Mesaj : `İçerik bulunamadı.`}\n» Dosya mı? ${data.Dosya == true ? "[Evet](https://github.com/iawoken 'awoken was here!')" : "[Hayır](https://github.com/iawoken 'awoken was here!')"}`)
      });

      message.react(global.emojis.tick);
      return message.inlineReply({ embed: Embed }).catch(err => {});
    }
};
