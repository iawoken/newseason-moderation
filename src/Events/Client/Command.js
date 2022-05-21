const { Message, MessageEmbed } = require("discord.js");
const Settings = require('../../Configs/Settings.js');

 /**
 * @param {Message} message
 */

module.exports = async (message) => {
  if (message.author.bot ||!global.config.Prefix.some(xd => message.content.startsWith(xd)) || !message.channel || message.channel.type == "dm") return;

  if([".tag", "!tag"].includes(message.content.toLowerCase())){
    return message.channel.wsend("`"+Settings.Tag.filter(x => x.activity == true).map(tag => `${tag.type == "discriminator" ? `#${tag.tag}` : tag.tag}`).join(" | ")+"`");
  };

  const Prefix = global.config.Prefix.find(xd => message.content.startsWith(xd));
  if(!Prefix) return;

  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0].slice(Prefix.length);
  command = command.toLowerCase();

  const bot = message.client;
  let cmd = global.commands.get(command) || global.aliases.get(command);

  if (cmd) {
   
    let orospuEvlatları = [];
    if (orospuEvlatları.includes(message.author.id)) {
     const oclarainat = new MessageEmbed()
     .setColor("RANDOM")
     .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
     .setFooter('Awoken was here!', client.user.avatarURL({dynamic: true}))
     .setDescription(`Hey, ne yazık ki sistemlerimizden **kalıcı** olarak yasaklanmışsınız. ${global.emojis.cross}\n\nMiddle Earth olarak adaletli ve güvenilir bir ortam oluşturmak için çabalamaktayız. Sorun teşkil eden kullanıcılar sunucumuza erişemez ve sistemlerimizden faydalanamazlar.\n\nEğer ki bir hata yapıldığını düşünüyorsan bir üst yetkili ile iletişime geç!`)
     
     return message.inlineReply(oclarainat);
    }
   
    if (message.member.roles.cache.has(Settings.JailRol) || message.member.roles.cache.has(Settings.YasaklıTagRol) || message.member.roles.cache.has(Settings.ŞüpheliRol)) return message.react(`${global.emojis.cross}`);
    cmd.onCommand(client, message, args);
  };
}

module.exports.config = {
    Event: "message"
};
