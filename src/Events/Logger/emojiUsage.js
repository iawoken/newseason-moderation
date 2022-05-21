const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (message) => {
  const log = await message.guild.kanalBul('emoji-log');
  if (!log) return;

  const Emoji = /(\p{ExtPict}(?:\p{EComp}(?:\p{ExtPict}|\p{EMod}|\p{EBase}))*\p{EComp}?|\d\u{FE0F}\u{20E3}|[\u{1F1E6}-\u{1F1FF}][\u{1F1E6}-\u{1F1FF}]?)/u;
  const customEmoji = /<(?:a)?:([a-zA-Z0-9_]{2,32}):(\d{17,})>/;

  if (!message.author.bot && message.content.match(Emoji) || message.content.match(customEmoji)) {
    const emojixd = message.content.find(mesajcik => mesajcik.includes(Emoji || customEmoji))
    if (emojixd) {
        const parse = Discord.Util.parseEmoji(emojixd);
        
    };
  };
};

module.exports.config = {
    Event: "message"
}