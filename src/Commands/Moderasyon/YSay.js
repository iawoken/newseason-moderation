const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "yetkilisay",
    aliases: ['ysay', 'yetkili-say'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        let Users = message.guild.members.cache.filter(x => {
            return Utils.YetkiliMi(x) && !x.voice.channel && x.user.presence.status !== "offline"
        });

        message.react(`${global.emojis.tick}`);
        message.channel.send(`Aktif olup ses kanallarında olmayan yetkili sayısı: ${Users.size}\n${Users.size > 0 ? '───────────────' : ``}\n${Users.map(x => x.toString()).join(", ")}`, { split: true });
        return;
      }
};
