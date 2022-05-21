const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "top",
    aliases: ['topkayıt'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.registerPerm.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        let Registers = await Register.find({});

        Registers = Registers
            .filter(veri => message.guild.members.cache.has(veri.userID) && veri.Registers.totalMan > 0 || veri.Registers.totalWoman > 0)
            .slice(0, 20)
            .sort((a, b) => Number(b.Registers.totalMan + b.Registers.totalWoman) - Number(a.Registers.totalMan + a.Registers.totalWoman));

        if(Registers.length == 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu sunucu ile ilgili veri tabanında kayıt verisi bulunamadı!`).then(x => x.delete({timeout: 6000})).catch(err => {});
        let Sayi = 1;
        const Rank = Registers.find(xd => xd.userID == message.author.id);

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setTitle(`Teyit Sıralaması`)
        .setFooter(`${Settings.EmbedFooter} | Toplam ${Registers.map(xd => Number(xd.Registers.totalMan + xd.Registers.totalWoman)).reduce((a, b) => b + a, 0)} kayıt işlemi yapılmış.`, message.guild.iconURL({ dynamic: true }))
        .setDescription(`${global.emojis.tick} Sunucuda en çok üye kayıt eden kişiler aşağıda belirtilmiştir. ${Rank ? `Siz **${Registers.indexOf(Rank) +1}.** sırada bulunuyorsunuz. Toplam ${[`**${Rank.Registers.totalMan}** erkek`, `**${Rank.Registers.totalWoman}** kız`].filter(xd => !xd.startsWith('**0**')).map(x => x).join(', ')} kayıt etmişsiniz.` : `Sen bu sıralamada malesef bulunmuyorsun.`}\n\n`)

        for (data of Registers) {
            Embed.description += `\`${Sayi}.\` ${message.guild.members.cache.get(data.userID) ? message.guild.members.cache.get(data.userID) : 'Bilinmeyen Kullanıcı'} » **${Number(data.Registers.totalMan + data.Registers.totalWoman).toLocaleString()}** kayıt\n`;
            Sayi++;
        };

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({ embed: Embed });
    }
};
