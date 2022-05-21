const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "yenirolbilgi",
    aliases: ['yrb', 'yeni-rol-bilgi'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
        if (!role) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen bir rol etiketleyin veya ID'sini girin.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        let members = role.members.size;
        if (members > 200) return message.channel.send(`${role} rolünde toplam ${members} üye olduğundan dolayı rol bilgilerini gösteremiyorum.`).then(x => x.delete({timeout: 6000}))
        let Users = role.members.map(x => `\`<@${x.id}>\``)

        message.react(`${global.emojis.tick}`);
        return message.inlineReply(`- ${role} rol bilgileri;
- Rol Rengi: \`${role.hexColor}\`
- Rol ID: \`${role.id}\`
- Roldeki Kişi Sayısı: \`${members}\`
─────────────────
- Roldeki Kişiler:
${Users.join(" , ")}
            `, {split: true}).catch(err => {});
      }
};
