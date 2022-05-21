const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Registerxd = require('../../Schemas/Register');
const Ceza = require('../../Schemas/Ceza');
const table = require('table')

module.exports = {
    name: "unjail",
    aliases: ['un-jail'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.jailHammer.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).catch(err => {});
        if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));

        let Jail = await Utils.CezalariGetir(member) || [];
        Jail = Jail.filter(cezacik => cezacik.Aktif == true && cezacik.Tip == "Jail");
        if (Jail.length == 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcının davam eden bir cezası bulunmuyor.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        for (jails of Jail) {
          const usr = message.guild.members.cache.get(jails.userID);
          message.guild.unlog(usr, message.member, 'unjail', 'jail-log', {ID: jails.ID});
          await Ceza.findOneAndUpdate({ ID: jails.ID }, { Aktif: false, Kaldiran: message.author.id });

          const Register = await Registerxd.findOne({ userID: jails.userID });
          let Nicknames = []
          if (Register) {
            Nicknames = Register.Nicknames.filter(xd => xd.islem == "Kayıt").sort((a, b) => Number(b.tarih) - Number(a.tarih));

            if (Nicknames.length == 0) {
              await usr.roles.set(Utils.BoostKontrol(usr) ? Settings.unregisterRol.concat(Settings.boosterRol) : Settings.unregisterRol);
              await usr.setNickname(`${Settings.TagsizSembol} İsim | Yaş`);
            } else {
              await member.setNickname(`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${Nicknames[0].isim}${Settings.yasGerekli == true ? ` | ${Nicknames[0].yas}` : ``}`);
              if (Nicknames[0].cinsiyet == "Erkek") await member.roles.set(Utils.BoostKontrol(usr) ? Settings.erkekRol.concat(Settings.boosterRol) : Settings.erkekRol);
              else if (Nicknames[0].cinsiyet == "Kız") await member.roles.set(Utils.BoostKontrol(usr) ? Settings.kizRol.concat(Settings.boosterRol) : Settings.kizRol);
            };
          }
        };

        await message.react(`${global.emojis.tick}`);
        return message.inlineReply(`${global.emojis.tick} ${member} kişisinin cezası başarılı bir şekilde kaldırıldı!`);
      }
};
