const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "say",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) & !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        let Sesli = message.guild.members.cache.filter(member => member.voice && member.voice.channelID !== null).size;

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, format: "png" }))
        .setDescription(`
          \`•\` Sunucumuzda toplam **${message.guild.members.cache.size}** kişi bulunuyor. (**${message.guild.members.cache.filter(mem => mem.presence.status !== "offline").size}** aktif)\n\`•\` Sunucumuzda toplam **${message.guild.members.cache.filter(member => Utils.TagKontrol(member.user) == true).size}** kişi tagımızı alarak bizi desteklemiş.\n\`•\` Sesli kanallarda **${Sesli}** kişi bulunuyor.\n\`•\` Sunucumuz **${message.guild.premiumSubscriptionCount}** takviyeye sahip. ${message.guild.premiumTier > 0 ? `(**${message.guild.premiumTier}.** seviye)` : ``}
          `)

          message.react(`${global.emojis.tick}`);
          return message.inlineReply({ embed: Embed });
      }
};
