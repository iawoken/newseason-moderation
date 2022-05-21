const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Puancik = require('../../Schemas/Puan');
const Tagged = require('../../Schemas/Taggeds')
const ms = require('ms');

module.exports = {
    name: "senkronize",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        
      if (Settings.Systems.Yetki == false) return;
      if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross);
      if (!global.ranks || global.ranks.length <= 0) return message.inlineReply(`Hata: Yetki sistemine henüz bir rol eklenmemiş.`).then(x => x.delete({timeout: 6000}))

      if (args[0] && args[0] == "kişi" || args[0] == "user" || args[0] == "üye") {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!member) return message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000}));

        let userRole = global.ranks.filter(xd => member.roles.cache.has(xd.id));
        userRole = message.guild.roles.cache.get(userRole[userRole.length -1] ? userRole[userRole.length -1].id : Settings.baslangicYetki)
        if (!userRole) return message.inlineReply(`Hata: Bu kullanıcının rolü senkronize edilemedi!`).then(x => x.delete({timeout: 6000}))

        const PData = await Puancik.findOne({ userID: member.id });
        if (PData && PData.Yetki == role.id) return message.inlineReply(`Hata: Bu kullanıcının rolleri veri tabanında zaten güncel!`).then(x => x.delete({timeout: 6000}))

        member.roles.add(userRole.id).catch(err => {});
        const Rol = global.ranks.find(obj => obj.id == userRole.id);
        if (Rol.hammers || Rol.hammers.length > 0) {
          Rol.hammers.forEach((role) => {
            if (!member.roles.cache.has(role)) member.roles.add(role).catch(err => {});
          });
        };

        await Puancik.findOneAndUpdate({ userID: member.id }, { $set: { Yetki: userRole.id } }, { upsert: true });
        message.react(`${global.emojis.tick}`)
        return message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisinin yetki rolü veri tabanında \`${userRole.name}\` olarak senkronize edildi.`);
      } else if (args[0] && args[0] == "role" || args[0] == "rol") {
        const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if (!rol) return message.inlineReply(`Hata: Lütfen bir rol etiketleyin veya ID'sini girin.`).then(x => x.delete({timeout: 6000}));
        if (rol.members.size <= 0) return message.inlineReply(`Hata: Bu rolde herhangi bir kullanıcı bulunmuyor.`);
        if (!global.ranks.some(xd => xd.id == rol.id)) return message.inlineReply(`Hata: Girilen rol yetki sisteminde bulunmuyor.`);

        rol.members.filter(mem => !mem.user.bot).forEach(async (member) => {
          if (global.ranks.some(perm => member.roles.cache.has(perm.id))) {
            let Role = global.ranks.filter(xd => member.roles.cache.has(xd.id));
            Role = message.guild.roles.cache.get(Role[Role.length -1] ? Role[Role.length -1].id : Settings.baslangicYetki);

            await Puancik.findOneAndUpdate({ userID: member.id }, { $set: { Yetki: Role.id } }, { upsert: true });
            message.react(`${global.emojis.tick}`)
            return message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisinin yetki rolü başarılı bir şekilde \`${Role.name}\` olarak senkronize edildi.`);
          };
        });
      } else {
        return message.react(`${global.emojis.cross}`);
      };
    }
};
