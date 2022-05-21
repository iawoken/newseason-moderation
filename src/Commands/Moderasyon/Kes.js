const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const ms = require('ms');

module.exports = {
    name: "kes",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye);
      if (member.voice && member.voice.channelID == null) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bağlantısını kesmeye çalıştığınız üye bir ses kanalına bağlı değil.`).then(x => x.delete({timeout: 6000}));

      await member.voice.kick().then(() => {
        message.react(`${global.emojis.tick}`);
        return message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisinin ses bağlantısı başarıyla kesildi.`);
      }).catch(err => {
        message.react(`${global.emojis.cross}`);
        return message.inlineReply(`Hata: Belirtilen üyenin ses bağlantısı kesilemedi!`).then(x => x.delete({timeout: 6000}));
      });
    }
};
