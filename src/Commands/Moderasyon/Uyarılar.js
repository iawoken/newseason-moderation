const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "uyarılar",
    aliases: ['uyarilar', 'warns'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});
        let user = member.user;

        let Cezalar = await Utils.CezalariGetir(member);
        Cezalar = Cezalar.filter(xd => xd.Tip == "Uyarı");
        if(!Cezalar || Cezalar.length == 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcının veri tabanında bir ceza kayıtı bulunamadı.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        let sayi = 1;
        const Uyarılar = Cezalar.map((ceza) => `- ${sayi++}. uyarı ${client.users.cache.has(ceza.yetkiliID) ? client.users.cache.get(ceza.yetkiliID).tag : "Bilinmeyen Kullanıcı"} tarafından ${Utils.tarih(Number(ceza.Other.Tarih))} tarihinde "${ceza.Sebep}" sebebiyle verildi.\n`).join('\n');

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))
        .setDescription(`${member.toString()} kullanıcısının uyarıları aşağıda belirtilmiştir:\n\n\`\`\`${Uyarılar}\`\`\``)

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({ embed: Embed }).catch(err => {});
      }
};
