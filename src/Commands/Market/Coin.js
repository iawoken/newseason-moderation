const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');

module.exports = {
    name: "coin",
    aliases: ['coinim'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      if (Settings.Systems.Market !== true) return;
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
      const coin = await member.coinGetir() || 0;

      return message.inlineReply(`${global.emojis.reward} ${member.toString()}: \`${Number(coin).toLocaleString()}\` coin.`);
    }
};
