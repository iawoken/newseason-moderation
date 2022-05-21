const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Alarm = require('../../Schemas/Alarm.js');
const moment = require('moment');
const ms = require('ms');
moment.locale('tr');

module.exports = {
    name: "alarm",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      let Surecik = args[0];
      const Reason = args.slice(1).join(" ");

      if(!Surecik || (Surecik && ms(Surecik) == undefined)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir alarm süresi belirtmelisiniz!`).catch(err => {});
      Surecik = ms(Surecik);
      if (!Reason) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir alarm sebebi belirtmelisiniz.`);
      let roleMention = /<@&(\d+)>/;
      let everyoneMention = /@everyone|@here/;

      if (Utils.ReklamKontrol(Reason) == true) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Gerçekten mi? Bu alarmı reklam yapmak için mi ekleyeceksin?`);
      if (Utils.KufurKontrol(Reason) == true) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Alarm sebebi küfür içeremez!`);
      if (everyoneMention.test(message.content) == true || roleMention.test(message.content) == true) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Alarm sebebi geçersiz karakter veya bir rol içeremez.`);
      await Alarm.findOneAndUpdate({ userID: message.author.id }, { userID: message.author.id, durum: true, sebep: Reason, bitis: Date.now() + Surecik, kanal: message.channel.id }, { upsert: true }).catch(err => {});
      const Kalan = moment(Date.now() + Surecik).fromNow();
      message.react(`${global.emojis.tick}`);
      return message.inlineReply(`:alarm_clock: | Alarm başarılı bir şekilde kuruldu! Sana **${Kalan}** bunu hatırlatacağım.`);
    }
};
