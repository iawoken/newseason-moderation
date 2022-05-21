const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');

module.exports = {
    name: "çek",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
      if (!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).catch(err => {}).then(x => x.delete({timeout: 6000}));
      if (!message.member.voice.channel || !member.voice.channel) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yanına çekmek istediğin kullanıcı veya sen bir ses kanalında bulunmuyorsunuz.`).then(x => x.delete({timeout: 6000})).catch(err => {});
      if (message.member.voice.channelID == member.voice.channelID) return message.react(global.emojis.cross) && message.inlineReply(`Hata: Yanına çekmek istediğin kullanıcı ile aynı ses kanalında bulunuyorsunuz.`).then(x => x.delete({timeout: 6000})).catch(err => {});

      const Embed = new Discord.MessageEmbed()
      .setColor(Settings.Color)
      .setAuthor(member.displayName, member.user.avatarURL({dynamic: true}))
      .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))

      if (message.member.roles.highest.position < member.roles.highest.position) {
        const reactionFilter = (reaction, user) => {
          return ['✅'].includes(reaction.emoji.name) && user.id === member.id;
        };
          
        message.channel.send(`${member.toString()}`, { embed: Embed.setDescription(`${message.author} seni ses kanalına çekmek için izin istiyor! Onaylıyor musun?`) }).then(async (msg) => {
          await msg.react('✅');
          msg.awaitReactions(reactionFilter, {max: 1, time: 15000, error: ['time']}).then(c => {
            let cevap = c.first();
            if (cevap) {
                  member.voice.setChannel(message.member.voice.channelID).catch(err => {});;
              msg.delete();
              message.channel.send({ embed: Embed.setDescription(`${global.emojis.tick} ${message.member.toString()}, isimli üye ${member.toString()} isimli üyenin odasına izin ile çekildi!`) })
              return;
            } else {
              msg.delete();
              message.channel.send({ embed: Embed.setDescription(`${global.emojis.cross} **15** Saniye boyunca ${member.toString()} isimli kişiden cevap gelmediği için otomatik olarak iptal edildi!`) })
              return;
            };
          });
        });
      } else {
        if (Settings.teleportHammer.some(rol => message.member.roles.cache.has(rol)) || Settings.yonetimRoller.some(rol => message.member.roles.cache.has(rol)) || message.member.permissions.has(8)) {
              member.voice.setChannel(message.member.voice.channelID).catch(err => {});
          message.channel.send({ embed: Embed.setDescription(`${global.emojis.tick} ${message.member.toString()} isimli yetkili ${member.toString()} isimli üyenin odasına çekildi!`) })
          return;
        }
      };
    }
};
