const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "kayıtsız",
    aliases: ['kayitsiz','unregister'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!global.config.Owners.includes(message.author.id) && !message.member.permissions.has(8) && !message.member.roles.cache.has(Settings.BotCommand) && !Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm))) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).catch(err => {});
        if (message.member.roles.highest.position <= member.roles.highest.position) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiust).then(x => x.delete({timeout: 6000}));

        if (!Utils.KayıtKontrol(member)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kayıtsız).then(x => x.delete({timeout: 6000})).catch(err => {});

        await member.setNickname(`${Settings.TagsizSembol} Kayıtsız`).catch(err => {});
        if (member.voice.channel) await member.voice.kick({ reason: `Yetkili: ${message.author.tag} | Kayıtsız atıldı.` });
        await member.roles.cache.has(Settings.boosterRol) ? member.roles.set(Settings.unregisterRol.concat(Settings.boosterRol)) : member.roles.set(Settings.unregisterRol).catch(e => { })

        message.react(`${global.emojis.tick}`);
        return message.inlineReply(`${global.emojis.tick} ${member.toString()} (\`${member.user.tag.replace('`', '')}\` **-** \`${member.user.id}\`) üyesi başarılı bir şekilde kayıtsıza atıldı!`).catch(err => {});
    }
};
