const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Joined = require('../../Schemas/JoinedAt.js');
const moment = require('moment');
const ms = require('ms');
require('moment-duration-format');

module.exports = {
    name: "sesbilgi",
    aliases: ['ses-bilgi'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

      if(!member) return message.inlineReply(global.cevaplar.üye).catch(err => {});
      const user = member.user;

      if(member.voice.channelID == null) return message.inlineReply(`Hata: Bu kullanıcı herhangi bir ses kanalına bağlı değil!`).catch(err => {});
      let giris = message.guild.channels.cache.get(member.voice.channelID).permissionsFor(message.author.id).has(['CONNECT']);
      let vData = await Joined.findOne({userID: user.id});
      message.reply(vData.data)
        
      const members = message.guild.members.cache.filter(awoken => awoken.voice.channelID !== null & awoken.voice.channelID == member.voice.channelID).map(x => x).slice(0, 10);

      const selfInfo = "```diff\n"+ `• Kullanıcı "${member.guild.channels.cache.get(member.voice.channelID).name}" isimli kanalda bulunuyor!\n\n+ Mikrofon Durumu: ${member.voice.selfMute ? "Kapalı" : "Açık"}\n\u200b \u200b \u200b> Sunucu Susturması: ${member.voice.serverMute ? "Susturulmuş" : "Susturulmamış"}\n\u200b \u200b \u200b> Kişisel Susturma: ${member.voice.selfMute ? "Susturmuş" : "Susturmamış"}\n\n+ Kulaklık Durumu: ${member.voice.selfDeaf ? "Kapalı" : "Açık"}\n\u200b \u200b \u200b> Sunucu Sağırlaştırması: ${member.voice.serverDeaf ? "Sağırlaştırılmış" : "Sağırlaştırılmamış"}\n\u200b \u200b \u200b> Kişisel Sağırlaştırma: ${member.voice.selfDeaf ? "Sağırlaştırmış" : "Sağırlaştırmamış"}\n\n+ Odaya Giriş İzniniz: ${giris == true ? "Var" : "Yok"}\n\u200b \u200b \u200b> Odanın Limiti: ${message.guild.channels.cache.get(member.voice.channelID).userLimit}\n\u200b \u200b \u200b> Odadaki Kullanıcı Sayısı: ${message.guild.members.cache.filter(awoken => awoken.voice.channelID !== null & awoken.voice.channelID == member.voice.channelID).size} ${message.guild.channels.cache.get(member.voice.channelID).userLimit > 0 ? `\n\u200b \u200b \u200b> Odanın Doluluk Oranı: ${`%${Math.round((message.guild.members.cache.filter(awoken => awoken.voice.channelID !== null & awoken.voice.channelID == member.voice.channelID).size / message.guild.channels.cache.get(member.voice.channelID).userLimit) * 100) > 100 ? 100 : Math.round((message.guild.members.cache.filter(awoken => awoken.voice.channelID !== null & awoken.voice.channelID == member.voice.channelID).size / message.guild.channels.cache.get(member.voice.channelID).userLimit) * 100)}`}` : ``}` +"\n```";
      const odaBilgi = "```xl\n"+ `# Odadaki Bazı Kişiler;\n\n${members.map(user => `${user.user.username} - ${user.user.id} ${user.user.bot ? `[BOT]` : `[USER]`}`).join("\n")}` +"\n```";

      const embed = new Discord.MessageEmbed()
      .setColor(Settings.Color)
      .setAuthor(`${member.displayName} | Ses Bilgileri`, user.avatarURL({ dynamic: true }))
      .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
      .setDescription(`Selam \`${message.member.displayName}\`, bakmış olduğunuz \`${member.displayName}\` kullanıcısının ses bilgileri aşağıda belirtilmiştir.\n${selfInfo}\n${odaBilgi}\n\n${global.emojis.tick} Kişi bu kanalda ${moment.duration(vData?.data ?? 0).format(`${(vData?.data ?? 0) < 1000 * 60 ? 's [saniye]' : 'H [saat], m [dakika]'}`)} süredir bulunuyor.`)

      message.react(global.emojis.tick);
      return message.inlineReply({embed: embed}).catch(err => {});
    }
};
