const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const ms = require('ms');

module.exports = {
    name: "booster",
    aliases: ['b'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (!Utils.BoostKontrol(message.member) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});
      const isim = args.join(' ');
      if (!isim) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen bir isim belirtin!`).catch(err => {});

      if (Utils.KufurKontrol(isim)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen küfür içermeyen bir isim belirtin.`).catch(err => {});
      else if (Utils.ReklamKontrol(isim)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen reklam içermeyen bir isim belirtin.`).catch(err => {});

      if (message.member.manageable) {
        await message.member.setNickname(`${Utils.TagKontrol(message.author) ? Settings.TagliSembol : Settings.TagsizSembol} ${isim}`).then(awoken => {
          message.react(`${global.emojis.tick}`);
          return message.inlineReply(`${global.emojis.tick} Başarıyla isminizi değiştirdiniz! Yeni isminiz ile havanıza hava katın 😎`).catch(err => {});
        }).catch(error => {
          message.react(`${global.emojis.cross}`);
          return message.inlineReply(global.cevaplar.uzunisim).catch(err => {});
        });
      } else {
        message.react(`${global.emojis.cross}`);
        return message.inlineReply(global.cevaplar.dokunulmaz).catch(err => {});
      };
    }
};
