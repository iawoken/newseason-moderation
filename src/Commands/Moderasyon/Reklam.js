const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "reklam",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.reklamciyonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));
        
        await Utils.CezaEkle(member, message.member, "Reklam", "Reklam", {
            Tarih: Date.now(),
            Sure: null,
            Bitis: null
        });

        await message.react(`${global.emojis.tick}`);
        message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisi __Reklam__ sebebi ile sunucudan uzaklaştırıldı! (Ceza Numarası: \`#${await Utils.cezaNumarasiGetir()-1}\`)`).catch(err => {});
        
        await member.setRol(["916072334807408740"]);
        return message.guild.log(member, message.member, 'Reklam', 'reklam-log', { ID: await Utils.cezaNumarasiGetir()-1, Sebep: "Reklam" }).catch(err => {});;
      }
};
