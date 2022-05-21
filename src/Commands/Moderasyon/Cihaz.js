const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "cihaz",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.inlineReply(global.cevaplar.üye).catch(err => {});
        let user = member.user;
        if (user.presence.status == "offline") return message.react(global.emojis.cross) && message.inlineReply(`Hata: \`${user.tag}\` kullanıcısı çevrimdışı olduğundan dolayı cihaz bilgisini tespit edemiyorum.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        let cihaz = "";
        let giris = Object.keys(user.presence.clientStatus);
        if (giris[0] == "mobile") cihaz = "Mobil Telefon";
        if (giris[0] == "desktop") cihaz = "Masaüstü Uygulama";
        if (giris[0] == "web") cihaz = "İnternet Tarayıcısı";

        message.react(`${global.emojis.tick}`);
        return message.inlineReply(`\`${user.tag}\` kullanıcısının kullandığı cihaz: \`${cihaz}\``).catch(err => {});
      }
};
