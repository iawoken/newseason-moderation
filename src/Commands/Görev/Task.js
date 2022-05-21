const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Tasks = require('../../Schemas/Task');
const ms = require('ms');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
    name: "görev",
    aliases: ['günlük', 'gunluk', 'daily', 'task', 'görevim', 'gorevim', 'gorevler', 'görevler'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (Settings.Systems.Gorev !== true) return;
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      const user = member.user;

      const Gorevler = await Tasks.find({ userID: user.id, durum: true });
      if (!Gorevler || Gorevler.length <= 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Herhangi bir görev bulunmamaktadır.`);

      const Embed = new Discord.MessageEmbed()
      .setColor(Settings.Color)
      .setFooter(`Görevler her gün saat 00.00'da sıfırlanır.`, client.user.avatarURL({ dynamic: true }))
      .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
      .setDescription(`**Bu günün görevleri** \`${moment.duration(Gorevler[Gorevler.length -1].bitis - Date.now()).format("H [saat], m [dk]")}\` **sonra yenilenecektir.**\nToplam ${Settings.Task.Types.length} görevi tamamlamak sana ekstra ${global.emojis.reward} **1000** Puan kazandıracak!\n\n**Görev Durumu**`)
      .setThumbnail('https://media.discordapp.net/attachments/660388738756771856/852187152586637332/sandik1.png')
      .setTimestamp()

      Gorevler.map((task) => {
        const emoji = task.tur.replace(/invite/i, global.emojis.community).replace(/mesaj/i, global.emojis.message).replace(/ses/i, global.emojis.message).replace(/taglı/i, global.emojis.community).replace(/kayıt/i, global.emojis.community)
        Embed.addField(task.gorevText, `${emoji} ${client.progressBar(task.tamamlanan, task.hedef, 8)} ${task.tur == "ses" ? `\`${moment.duration(task.tamamlanan).format("H [saat], m [dk]")} / ${moment.duration(task.hedef).format("H [saat], m [dk]")}\`` : ` \`${task.tamamlanan} / ${task.hedef}\``}\n**Ödül:** ${global.emojis.reward} \`${task.puan}\` Puan`)
      });

      return message.react(global.emojis.tick) && message.inlineReply({ embed: Embed });
    }
};
