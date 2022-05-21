const Discord = require('discord.js');
const Utils = global.Utils;
const Roles = require('../../Schemas/Role');
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "rol",
    aliases: ['r'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        if (args[0] && args[0] == "ekle" || args[0] == "ver" || args[0] == "add") {
          const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
          if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye);

          const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
          if (!role) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir rol etiketleyin veya ID'sini girin.`).then(x => x.delete({timeout: 6000}));
          if (Settings.staffRoles.includes(role.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yetkili rolleri ile işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (Settings.yonetimRoller.includes(role.id) || role.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yönetim rolleri ile işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (member.roles.cache.has(role.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Belirtilen rol kullanıcı üzerinde bulunuyor.`).then(x => x.delete({timeout: 6000}));

          const AddEmbed = new Discord.MessageEmbed()
          .setAuthor(member.displayName, member.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
          .setColor(Settings.Color)
          .setTimestamp()
          .setDescription(`${global.emojis.tick} ${member.toString()} **-** (\`${member.user.id}\`) kullanıcısına yeni bir rol eklendi.`)
          .addField(`Ekleyen Kişi`, `${message.author} **-** (\`${message.author.id}\`)`)
          .addField(`Eklenen Rol`, `${role.toString()} **-** (\`${role.id}\`)`)
          if (message.guild.kanalBul('rol-log')) message.guild.kanalBul('rol-log').send({ embed: AddEmbed });

          await Roles.findOneAndUpdate({ userID: member.user.id }, { userID: member.user.id, $push: { Roles: {Rol: role.id, Yetkili: message.author.id, Tarih: Date.now(), islem: "Ekleme"} } }, { upsert: true });
          await member.roles.add(role.id).catch(err => {});

          message.react(`${global.emojis.tick}`);
          return message.inlineReply(`${global.emojis.tick} ${member.toString()} (\`${member.user.id}\`) kişisine \`${role.name}\` rolü başarıyla verildi.`);
        } else if (args[0] && args[0] == "al" || args[0] == "remove") {
          const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
          if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000}));

          const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
          if (!role) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir rol etiketleyin veya ID'sini girin.`).then(x => x.delete({timeout: 6000}));
          if (Settings.staffRoles.includes(role.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yetkili rolleri ile işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (Settings.yonetimRoller.includes(role.id) || role.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yönetim rolleri ile işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.`).then(x => x.delete({timeout: 6000}));
          if (!member.roles.cache.has(role.id)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Belirtilen rol kullanıcı üzerinde bulunmuyor.`).then(x => x.delete({timeout: 6000}));

          const RemoveEmbed = new Discord.MessageEmbed()
          .setAuthor(member.displayName, member.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
          .setColor(Settings.Color)
          .setTimestamp()
          .setDescription(`${global.emojis.tick} ${member.toString()} **-** (\`${member.user.id}\`) kullanıcısından bir rol alındı.`)
          .addField(`Alan Kişi`, `${message.author} **-** (\`${message.author.id}\`)`)
          .addField(`Alınan Rol`, `${role.toString()} **-** (\`${role.id}\`)`)
          if (message.guild.kanalBul('rol-log')) message.guild.kanalBul('rol-log').send({ embed: RemoveEmbed });

          await Roles.findOneAndUpdate({ userID: member.user.id }, { userID: member.user.id, $push: { Roles: {Rol: role.id, Yetkili: message.author.id, Tarih: Date.now(), islem: "Kaldırma"} } }, { upsert: true });
          await member.roles.remove(role.id).catch(err => {});

          message.react(`${global.emojis.tick}`);
          return message.inlineReply(`${global.emojis.tick} ${member.toString()} (\`${member.user.id}\`) kişisinden \`${role.name}\` rolü başarıyla alındı.`);
        } else if (args[0] && args[0] == "bilgi" || args[0] == "info" || args[0] == "log") {
          const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
          if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000}));

          let Roller = await Roles.findOne({ userID: member.user.id });
          if (!Roller || Roller.Roles.length < 1 ? true : false) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Belirtilen kullanıcının veri tabanında rol bilgisi bulunmuyor.`).then(x => x.delete({timeout: 6000}));
          Roller = Roller.Roles;

          Roller = Roller.sort((a, b) => Number(b.Tarih) - Number(a.Tarih)).slice(0, 10);
          const yeniRol = Roller.map(data => `${data.islem == "Ekleme" ? global.emojis.tick : global.emojis.cross} Rol: <@&${data.Rol}> Yetkili: <@${data.Yetkili}>\nTarih: ${Utils.tarih(data.Tarih)}`);
          const Embedcik = new Discord.MessageEmbed()
          .setAuthor(member.displayName, member.user.avatarURL({ dynamic: true }))
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
          .setColor(Settings.Color)
          .setTimestamp()
          .setDescription(`${member.toString()} (\`${member.user.id}\`) kişisinin rol bilgileri aşağıda belirtilmiştir.\n\n${yeniRol.join("\n─────────────────\n")}`)

          message.react(`${global.emojis.tick}`);
          return message.inlineReply({ embed: Embedcik });
        } else return message.react(`${global.emojis.cross}`);

      }
};
