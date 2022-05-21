const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "sil",
    aliases: ['temizle'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const miktar = args[0];
        if (!miktar) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Silmek istediğiniz mesaj miktarını belirtin.`).then(x => x.delete({timeout: 6000}));

        await message.channel.bulkDelete(Number(miktar)).then(() => {
          message.react(`${global.emojis.tick}`);
          return message.channel.send(`${global.emojis.tick} **${miktar}** adet mesaj başarılı bir şekilde silindi!`).then(x => x.delete({timeout:3000}))
        }).catch(err => {
          message.react(`${global.emojis.cross}`);
          return message.channel.send(`${global.emojis.cross} Bu kanaldan **${miktar}** mesaj silinemedi!`).then(x => x.delete({timeout: 6000}))
        })
      }
};
