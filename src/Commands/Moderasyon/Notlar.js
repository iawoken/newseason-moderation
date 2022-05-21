const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Notes = require('../../Schemas/Notes');
const table = require('table')

module.exports = {
    name: "notlar",
    aliases: ['notes'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.react(global.emojis.cross) &&  message.inlineReply(global.cevaplar.üye);

        let Notlar = await Notes.findOne({ userID: member.user.id });
        if (!Notlar) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Bu kişinin herhangi bir ceza notu bulunmuyor.`).then(x => x.delete({timeout: 6000}));
        Notlar = Notlar.Notes;
        Notlar = Notlar.sort((a, b) => Number(b.Tarih) - Number(a.Tarih));

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))
        .setDescription(`${global.emojis.tick} ${member.toString()} kişisinin ceza notları aşağıdaki gibidir.\n\n${Notlar.slice(0, 10).map(xD => `> Yetkili:  <@${xD.Yetkili}> \`-\` **${xD.Yetkili}**\n> Tarih: \`${Utils.tarih(xD.Tarih)}\`\n> Not: \`${xD.Not}\``).join("\n\n")}`)

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({ embed: Embed });
      }
};
