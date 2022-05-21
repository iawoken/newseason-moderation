
const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (oldUser, newUser) => {
    if(oldUser.bot) return;
    const client = oldUser.client;
    const guild = client.guilds.cache.get(Settings.Sunucuid);
    const user = guild.members.cache.get(oldUser.id);
    const nuser = guild.members.cache.get(oldUser.id);
    const Family = guild.roles.cache.get(Settings.familyRol);

    if (Utils.TagKontrol(oldUser) == true && Utils.TagKontrol(newUser) == false) {
        if (guild.kanalBul('tag-log')) await guild.kanalBul('tag-log').send(`─────────────────\n${global.emojis.cross} ${newUser.toString()} kişisi tagımızı çıkararak ailemizden ayrıldı. **(Toplam Taglı Üyemiz: ${guild.members.cache.filter(xd => Utils.TagKontrol(xd.user)).size})**\n\nÖnce: \`${oldUser.tag}\`\nSonra: \`${newUser.tag}\`\n─────────────────`);
        if (Family) await user.roles.remove(Family.id);
    
        if (Settings.Taglialim == true) {
            await user.setNickname(`${Settings.TagsizSembol} İsim | Yaş`);
            await user.roles.set(Utils.BoostKontrol(nuser) ? Settings.unregisterRol.concat(Settings.boosterRol) : Setting.unregisterRol);
        } else {
            await user.setNickname(user.displayName.replace('➹', '➷'));
        };

        const ibidigalpawo = new Discord.MessageEmbed()
        .setColor(Settings.Color)
        .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true }))
        .setAuthor(newUser.username, newUser.avatarURL({ dynamic: true }))
        
        if (Utils.YetkiliMi(user)) {
            if (Settings.Taglialim) {
                await user.setRol(Setting.unregisterRol)
                if (user.guild.kanalBul('salanlar')) return user.guild.kanalBul('salanlar').send(`${user} isimli üye **${Utils.tarih(Date.now())}** tarihinde yetkiyi saldı.\n\u200b \u200b \u200b \u200b Bırakmadan önceki yetkileri;\n${user.roles.cache.filter(xx => xx.id !== Settings.Sunucuid).map(x => x.toString()).join(', ')}`);
            } else {
                if (user.guild.kanalBul('salanlar')) return user.guild.kanalBul('salanlar').send(`${user} isimli üye **${Utils.tarih(Date.now())}** tarihinde yetkiyi saldı.\n\u200b \u200b \u200b \u200b Bırakmadan önceki yetkileri;\n${user.roles.cache.filter(xx => xx.id !== Settings.Sunucuid).map(x => x.toString()).join(', ')}`);  
                
                if (Settings.erkekRol.some(x => user.roles.cache.has(x))) {
                    await user.setRol(Settings.erkekRol);
                } else if (Settings.kizRol.some(x => user.roles.cache.has(x))) {
                    await user.setRol(Settings.kizRol);
                };
            };
        };
    } else if (Utils.TagKontrol(oldUser) == false && Utils.TagKontrol(newUser) == true) {
        if (guild.kanalBul('tag-log')) await guild.kanalBul('tag-log').send(`─────────────────\n${global.emojis.tick} ${newUser.toString()} kişisi tagımızı alarak ailemize katıldı. **(Toplam Taglı Üyemiz: ${guild.members.cache.filter(xd => Utils.TagKontrol(xd.user)).size})**\n\nÖnce: \`${oldUser.tag}\`\nSonra: \`${newUser.tag}\`\n─────────────────`);
        await user.setNickname(user.displayName.replace('➷', Settings.TagliSembol))
        if (Family) await user.roles.remove(Family.id);
    };

    if (Utils.YasaklıTag(oldUser) == false && Utils.YasaklıTag(newUser) == true) {
        const Taglar = Utils.YasaklıTag(newUser, { type: "tags" });
        await oldUser.send(`${global.emojis.cross} Selam, isminizde yasaklı bir tag olan **${Taglar.Tags[0].type == "username" ? Taglar.Tags[0].tag : `#${Taglar.Tags[0].tag}`}** tagını tespit ettik. Bu nedenle sunucuda **Cezalı** olarak işaretlendin! Tagı isminden çıkardığın vakit cezan iptal edilecektir.`)
        await user.setNickname(`${Settings.TagsizSembol} Cezalı`)
        await user.roles.set(user.roles.cache.has(Settings.boosterRol) ? [Settings.JailRol, Settings.boosterRol] : [Settings.JailRol]);
    } else if (Utils.YasaklıTag(oldUser) == true && Utils.YasaklıTag(newUser) == false) {
        const Taglar = Utils.YasaklıTag(oldUser, { type: "tags" });
        if (guild.channels.cache.has(Settings.Channels.Welcome)) guild.channels.cache.get(Settings.Channels.Welcome).send(`${global.emojis.tick} Selam, isminden **${Taglar.Tags[0].type == "username" ? Taglar.Tags[0].tag : `#${Taglar.Tags[0].tag}`}** tagını çıkardığın için teşekkürler. Tekrardan sunucumuza kayıt olabilirsin! ${oldUser.toString()}`)
        await oldUser.send(`${global.emojis.tick} Selam, isminden **${Taglar.Tags[0].type == "username" ? Taglar.Tags[0].tag : `#${Taglar.Tags[0].tag}`}** tagını çıkardığın için teşekkürler. Tekrardan sunucumuza kayıt olabilirsin!`)
        await user.setNickname(`${Settings.TagsizSembol} İsim | Yaş`)
        await user.roles.set(Utils.BoostKontrol(nuser) ? Settings.unregisterRol.concat(Settings.boosterRol) : Setting.unregisterRol);
    };
};

module.exports.config = {
    Event: "userUpdate"
};
