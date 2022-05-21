const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const ms = require('ms');

module.exports = {
    name: "vmute",
    aliases: ['voicemute', 'voice-mute'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (!Settings.muteHammer.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      let Surecik = args[1];
      const Reason = args.slice(2).join(" ");

      if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});
      if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});
      if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));
      if(!Surecik || (Surecik && ms(Surecik) == undefined)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir susturma süresi belirtmelisiniz!`).then(x => x.delete({timeout: 6000})).catch(err => {});
      Surecik = ms(Surecik);
      if (!Reason) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir susturma sebebi belirtin!`).then(x => x.delete({timeout: 6000})).catch(err => {});

      await Utils.CezaEkle(member, message.member, "Voice Mute", Reason, {
          Tarih: Date.now(),
          Sure: Surecik,
          Bitis: Date.now() + Surecik
      });

      if (member.voice && member.voice.channelID !== null) await member.voice.setMute(true).catch(err => {});

      message.react(`${global.emojis.tick}`);
      message.channel.send(`${global.emojis.vmute} ${member.toString()} kişisi __${Reason}__ sebebi ile **${Utils.turkishDate(Surecik)}** boyunca sesli kanallarda susturuldu! (Ceza Numarası: \`#${await Utils.cezaNumarasiGetir()-1}\`)`);
      return message.guild.log(member, message.member, 'Voice Mute', 'mute-log', { ID: await Utils.cezaNumarasiGetir()-1, Sebep: Reason }).catch(err => {});
    }
};
