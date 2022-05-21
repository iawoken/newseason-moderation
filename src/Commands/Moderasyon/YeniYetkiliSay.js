const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');

module.exports = {
    name: "rolses",
    aliases: ['rs', 'yetkilirol','rol-ses','sessay'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!global.config.Owners.includes(message.author.id) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});
        let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == "805795954187567105")
        let üyeler = message.guild.members.cache.filter(x => {
            return x.roles.cache.has(roles.id) && !x.voice.channel && x.user.presence.status !== "offline"
        })
        message.channel.send("Online olup seste olmayan \`"+roles.name+"\` rolündeki yetkili sayısı: " + üyeler.size + "")
        if(üyeler.size == 0) return
       message.react(`${global.emojis.tick}`) && message.channel.send("" + üyeler.map(x => "<@" + x.id + ">").join(",") + "", {split: true})
        

        return;
      }
};
