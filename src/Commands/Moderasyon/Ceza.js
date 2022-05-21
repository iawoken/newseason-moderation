const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "ceza",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const ID = args[0];
        if(!ID || isNaN(ID)) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Geçerli bir Ceza ID'si belirtin.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        const Ceza = await Utils.CezaBilgi(ID);
        if(!Ceza) return message.react(global.emojis.cross) && message.inlineReply(`Hata: (\`#${ID}\`) numaralı ceza bulunamadı.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        const User = await Utils.getUser(Ceza.userID);
        const Yetkili = await Utils.getUser(Ceza.yetkiliID);

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(User ? User.tag : message.guild.name, User ? User.avatarURL({ dynamic: true }) : message.guild.iconURL({ dynamic: true }))
        .setFooter(`${Settings.EmbedFooter} | Ceza Numarası: #${Ceza.ID}`, client.user.avatarURL({ dynamic: true, format: "png" }))
        .setDescription(`
            <@${User.id}> kişisine uygulanan **#${Ceza.ID}** ID'li ceza bilgileri aşağıdadır.
            ─────────────────
            » Üye Bilgisi: ${User ? `<@${User.id}> (\`${User.tag}\` **-** \`${User.id}\`)` : `<@${Ceza.userID}> **-** \`${Ceza.userID}\``}
            » Yetkili Bilgisi: ${Yetkili ? `<@${Yetkili.id}> (\`${Yetkili.tag}\` **-** \`${Yetkili.id}\`)` : `<@${Ceza.yetkiliID}> **-** \`${Ceza.yetkiliID}\``}
            » Ceza Tarihi: \`${Utils.tarih(Number(Ceza.Other.Tarih))}\`
            » Ceza Sebebi: \`${Ceza.Sebep}\`
            » Ceza Süresi: \`${Ceza.Other.Sure ? Utils.turkishDate(Number(Ceza.Other.Sure)) : `Yok!`}\`
            » Ceza Durumu: \`${Ceza.Aktif == true ? `✅ Devam Ediyor!` : `❌ Bitmiş!`}\`
            ${Ceza.Kaldiran !== "Kaldırılmamış." ? `» Cezayı Kaldıran: <@${Ceza.Kaldiran}> (\`${Ceza.Kaldiran}\`)` : ``}
            `)

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({embed: Embed}).catch(err => {});
      }
};
