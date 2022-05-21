const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Notes = require('../../Schemas/Notes');
const table = require('table')

module.exports = {
    name: "not",
    aliases: ['note'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000}));

        const Not = args.slice(1).join(" ");
        if (!Not) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Kişiye bırakmak istediğiniz notu girin.`).then(x => x.delete({timeout: 6000}));
        if (Utils.KufurKontrol(Not) || Utils.ReklamKontrol(Not)) return message.inlineReply(`Hata: Not içeriği reklam veya küfür içeremez.`).then(x => x.delete({timeout: 6000}));

        await Notes.findOneAndUpdate({ userID: member.user.id }, { userID: member.user.id, $push: { Notes: { Not: Not, Yetkili: message.author.id, Tarih: Date.now() } } }, { upsert: true });
        message.react(`${global.emojis.tick}`);
        return message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisine başarılı bir şekilde not bırakıldı!\n\n:no_entry_sign: | "${Not}"`)
      }
};
