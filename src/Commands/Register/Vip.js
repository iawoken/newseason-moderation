const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Register = require('../../Schemas/Register.js');
module.exports = {
    name: "vip",
    aliases: [],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
        if (!Settings.registerPerm.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.yetkiyok).then(x => x.delete({timeout: 6000})).catch(err => {});

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member) return message.react(global.emojis.cross) && message.inlineReply(global.cevaplar.üye).then(x => x.delete({timeout: 6000})).catch(err => {});

        const CezaPuan = await Utils.CezaPuanGetir(member) || 0;

        if (CezaPuan > 150) {
            const Cezaciklarxd = await Utils.CezalariGetir(member, {type: "category"});

            const CPuanError = new Discord.MessageEmbed()
            .setColor(Settings.Color)
            .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
            .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, format: "png" }))
            //.setDescription(`Hey, bu kullanıcının toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü işlem iptal edildi!\n\nBu kişi toplamda ${Cezaciklarxd} cezaları almış!`)
            .setDescription(`${global.emojis.cross} ${member.toString()} kişisinin toplam ceza puanı **${CezaPuan}**. Bu sebepten ötürü işlem iptal edildi! Sunucumuzda tüm işlemlerin kayıt altına alındığını unutmayın. Sorun teşkil eden, sunucu düzenini bozan ve kurallara uymayan kişiler sunucumuza kayıt olamaz, sistemlerimizden faydanalanamazlar!\n\nBelirtilen üye toplamda ${Cezaciklarxd} cezaları almış!`)
            
            return message.react(global.emojis.cross) && message.inlineReply({embed: CPuanError}).catch(err => {});
        };

        await member.roles.cache.has(Settings.vipRol) ? member.roles.remove(Settings.vipRol) : member.roles.add(Settings.vipRol);
        if (!member.roles.cache.has(Settings.vipRol)) {
            message.react(`${global.emojis.tick}`);
            return message.inlineReply(`${global.emojis.tick} Kullanıcıya başarılı bir şekilde **${message.guild.roles.cache.get(Settings.vipRol).name}** rolü verildi!`).catch(err => {});
        } else {
            message.react(`${global.emojis.tick}`);
            return message.inlineReply(`${global.emojis.tick} Kullanıcıdan başarılı bir şekilde **${message.guild.roles.cache.get(Settings.vipRol).name}** rolü alındı!`).catch(err => {});
        };
    }
};
