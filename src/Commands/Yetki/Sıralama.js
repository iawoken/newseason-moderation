const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Puancik = require('../../Schemas/Puan');
const Tagged = require('../../Schemas/Taggeds')
const ms = require('ms');

module.exports = {
    name: "puantop",
    aliases: ['puansiralama', 'puansira', 'puansıralama', 'puansıra'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        
      if (Settings.Systems.Yetki == false) return;
      if (!Settings.yonetimRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.roles.cache.has('798667309665222670') && !message.member.permissions.has(8)) return message.react(global.emojis.cross);

      let Puanx = await Puancik.find({}).sort({Puan: -1}).limit(args[0] ? !isNaN(args[0]) ? Number(args[0]) : 20 : 20);
     // Puanx = Puanx.filter(xd => message.guild.members.cache.get(xd.userID));
     let awo = 0;
     for (i of Puanx) awo += i.Puan;

     const Embed = new Discord.MessageEmbed()
      .setColor(message.member.roles.highest.hexColor !== "#000000" ? member.roles.highest.hexColor : Settings.Color)
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setDescription(`Sunucuda en çok puanı olan ${args[0] ? !isNaN(args[0]) ? args[0] : 20 : 20} kişi aşağıda belirtilmiştir.\n\n`)
      .setFooter(`Toplam "${String(awo).split('.')[0]}" puan toplanmış.`)

      Puanx.map((data, index) => {
         Embed.description += `\`${index+1}.\` <@!${data.userID}>: **${Number(data.Puan).toLocaleString()}** puan.\n`;
      });

      message.inlineReply(Embed)
    }
};
