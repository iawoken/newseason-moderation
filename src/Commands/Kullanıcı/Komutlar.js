const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const ms = require('ms');

module.exports = {
    name: "komutlar",
    aliases: ['commands'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      const Embed = new Discord.MessageEmbed()
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
      .setColor(Settings.Color)
      .setDescription(global.commands.filter(x => !['eval'].includes(x.name)).map(komut => `\`${komut.name}\``).join(" | "))

      return message.inlineReply({ embed: Embed });
    }
};
