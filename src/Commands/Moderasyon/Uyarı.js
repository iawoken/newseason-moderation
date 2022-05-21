const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "warn",
    aliases: ['uyarı', 'uyari'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));
        const Reason = args.slice(1).join(" ");
        if (!Reason) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Lütfen bir uyarı sebebi belirtin.`).then(x => x.delete({timeout: 6000})).catch(err => {});

        await Utils.CezaEkle(member, message.member, "Uyarı", Reason, {
            Tarih: Date.now(),
            Sure: null,
            Bitis: null
        });

        let Cezacik = await Utils.CezalariGetir(member) || [];
        Cezacik = Cezacik.filter(xd => xd.Tip == "Uyarı");
        let cezaPuan = Cezacik.length > 3 ? (Cezacik.length -3) * 250 : 0;
        await member.puanEkle(-cezaPuan);

        await message.react(`${global.emojis.tick}`);
        message.inlineReply(`${global.emojis.tick} ${member.toString()} kişisi __${Reason}__ sebebi ile uyarıldı! (Ceza Numarası: \`#${await Utils.cezaNumarasiGetir()-1}\`)`).catch(err => {});

        return message.guild.log(member, message.member, 'Warn', 'warn-log', { ID: await Utils.cezaNumarasiGetir()-1, Sebep: Reason }).catch(err => {});;
      }
};
