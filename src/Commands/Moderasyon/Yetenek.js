const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "yetenek",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.yetenekRoller.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});
        if (member.user.id == message.author.id) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.kendi).then(x => x.delete({timeout: 6000})).catch(err => {});

        const Embed = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({dynamic: true}))

        let ID,
            Name;

        switch (args[1]) {
            case "Vokal": case "vokal":
                ID = Settings.Yetenekler.Vokal;
                Name = "Vokal";
                break

            case "Müzisyen": case "müzisyen":
                ID = Settings.Yetenekler.Muzisyen;
                Name = "Müzisyen";
                break

            case "Yazılımcı": case "yazılımcı":
                ID = Settings.Yetenekler.Yazilim;
                Name = "Yazılımcı";
                break

            case "Tasarımcı": case "tasarımcı":
                ID = Settings.Yetenekler.Tasarimci;
                Name = "Tasarımcı";
                break

            case "Yayıncı": case "yayıncı":
                ID = Settings.Yetenekler.Stream;
                Name = "Yayıncı";
                break

            case "Şair": case "şair":
                ID = Settings.Yetenekler.Sair;
                Name = "Şair";
                break

            case "Ressam": case "ressam":
                ID = Settings.Yetenekler.Ressam;
                Name = "Ressam";
                break
            case "Golive": case "golive":
                ID = Settings.Yetenekler.Golive;
                Name = "Golive";
                break

            default:
                message.inlineReply({embed: Embed.setDescription(`${global.emojis.cross} Geçersiz bir yetenek belirtildi! Aşağıda tüm yeteneklerin ismi belirtilmiştir.\n\n\`\`\`• Vokal\n• Müzisyen\n• Yazılımcı\n• Yayıncı\n• Tasarımcı\n• Ressam\n• Şair\`\`\``)}).catch(err => {});
                break
        }

        member.roles.cache.has(ID) ? member.roles.remove(ID) : member.roles.add(ID);
        if (!member.roles.cache.has(ID)) {
            if (message.guild.kanalBul("yetenek-log")) message.guild.kanalBul("yetenek-log").wsend(Embed.setDescription(`${member.toString()} (\`${member.user.tag}\` **-** \`${member.user.id}\`) kişisine **${Utils.tarih(Date.now())}** tarihinde ${message.author} tarafından **${Name}** isimli rol verildi.`));
            message.inlineReply(`${global.emojis.tick} Başarılı bir şekilde ${member.toString()} kişisine **${Name}** rolü verildi.`).catch(err => {});
            return message.react(`${global.emojis.tick}`);
        } else {
            if (message.guild.kanalBul("yetenek-log")) message.guild.kanalBul("yetenek-log").wsend(Embed.setDescription(`${member.toString()} (\`${member.user.tag}\` **-** \`${member.user.id}\`) kişisinden **${Utils.tarih(Date.now())}** tarihinde ${message.author} tarafından **${Name}** isimli rol alındı.`));
            message.inlineReply(`${global.emojis.tick} Başarılı bir şekilde ${member.toString()} kişisinden **${Name}** rolü alındı.`).catch(err => {});
            return message.react(`${global.emojis.tick}`);
        };
    }
};
