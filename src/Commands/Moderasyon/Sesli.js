const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "sesli",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).catch(err => {});

        let pub = message.guild.channels.cache.filter(x => Settings.Rooms.Public.includes(x.parentID) && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b, 0)
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size;

        let tagli = message.guild.members.cache.filter(x => {
            return Utils.TagKontrol(x.user) && x.voice.channel
        }).size;

        let tagsiz = message.guild.members.cache.filter(x => {
            return !Utils.TagKontrol(x.user) && x.voice.channel
        }).size;

        let yetkili = message.guild.members.cache.filter(x => {
            return Utils.YetkiliMi(x) && x.voice.channel
        }).size;

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))
        .setDescription(`Sesli kanallarda toplam **${ses}** kişi var!
          ───────────────
          Public kanallarda **${pub}** kişi var!
          Ses kanallarında **${tagsiz}** normal kullanıcı var!
          Ses kanallarında **${tagli}** taglı kullanıcı var!
          Ses kanallarında **${yetkili}** yetkili var!
            `)

        message.react(`${global.emojis.tick}`);
        return message.inlineReply({ embed: Embed }).catch(err => {});
      }
};
