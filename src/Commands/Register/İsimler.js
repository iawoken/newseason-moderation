const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "isimler",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.registerPerm.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});

        const Registerfln = require('../../Schemas/Register.js');
        let Usernames = await Registerfln.findOne({ userID: member.user.id });
        if (Usernames) {
            Usernames = Usernames.Nicknames;
            Usernames = Usernames.sort((a, b) => Number(b.tarih) - Number(a.tarih))
        }
        else Usernames = [];
        if (Usernames.length <= 0) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kullanıcının herhangi bir isim kayıtı bulunamadı!`).then(x => x.delete({timeout: 6000})).catch(err => {});

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(member.displayName, member.user.avatarURL({ dynamic: true }))
        .setFooter(Settings.EmbedFooter, message.author.avatarURL({ dynamic: true, size: 2048 }))
        .setDescription(`${global.emojis.tick} ${member.toString()} kullanıcısının **${Usernames.length}** adet isim kayıtı bulunmaktadır.\n\n`);

        for (nicks of Usernames) {
            Embed.description += `\`${Utils.TagKontrol(member.user) ? Settings.TagliSembol : Settings.TagsizSembol} ${nicks.isim}${Settings.yasGerekli == true ? `${nicks.yas !== "Yok" ? ` | ${nicks.yas}` : ``}` : ``}\` (${nicks.cinsiyet.replace(/erkek/i, Settings.erkekRol.filter(xd => message.guild.roles.cache.has(xd)).map(rol => message.guild.roles.cache.get(rol).toString()).join(", ")).replace(/kız/i, Settings.kizRol.filter(xd => message.guild.roles.cache.has(xd)).map(rol => message.guild.roles.cache.get(rol).toString()).join(", ")).replace(/yok/i, nicks.islem)})\n`;
        };

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({embed: Embed}).catch(err => {});
    }
};
