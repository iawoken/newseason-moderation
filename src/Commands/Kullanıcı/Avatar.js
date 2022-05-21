  
const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');

module.exports = {
    name: "avatar",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
    if (message.channel.id !== "745417744937386060") return message.channel.send("<#745417744937386060>");  
    const ibiş = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    return message.inlineReply(`${ibiş.displayAvatarURL({ dynamic: true, size: 2048})}`);
    }
  }
  
