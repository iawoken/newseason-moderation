const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const table = require('table')

module.exports = {
    name: "ilgiver",
    aliases: ["ilgi-ver"],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.inlineReply(global.cevaplar.üye).catch(err => {});
        let user = member.user;


        message.react(`🍪`); // ${global.emojis.tick}
        return message.inlineReply(`${message.author} adlı üye <@${user.id}> adlı üyeye ilgi verdi.`).then(x => x.delete({timeout: 6000})).catch(err => {});
      }
};
