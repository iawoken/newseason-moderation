const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "kanal",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});
        if(args[0] & args[0] !== "kilit" && args[0] !== "aç") return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen geçerli bir argüman kullanın.`).catch(err => {});

        if (args[0] == "kilit") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(() => {
              message.react(`${global.emojis.tick}`);
              message.inlineReply(`${global.emojis.tick} Kanal başarıyla kilitlendi!`).catch(err => {});
            });
        };

        if (args[0] == "aç") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            }).then(() => {
              message.react(`${global.emojis.tick}`);
              message.inlineReply(`${global.emojis.tick} Kanalın kilidi başarıyla açıldı!`).catch(err => {});
            });
        };
      }
};
