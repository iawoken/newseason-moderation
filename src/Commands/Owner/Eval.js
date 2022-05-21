const Discord = require('discord.js');
const Config = require('../../Configs/Config');
const Settings = require('../../Configs/Settings');
const Utils = global.Utils;

module.exports = {
    name: "eval",
    aliases: ['evsat'],

    onCommand: async function (client, message, args) {
        const ids = ["355742603691687937", "282238108739567647"]
        if(!ids.includes(message.author.id)) return;
        let msg = message;

        let code = args.join(" ");
        if (!code) return message.channel.send("Kod belirt!");
        
        const clean = (text) => {
            if (typeof text !== "string") text = require("util").inspect(text, { depth: 0 });
            text = text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
                .replace(new RegExp(client.token, "g"), "Njk2MTY4Nz8SDIFDU4OTA1MDk4.b4nug3rc3k.bir.t0k3ns4n4cak.kadarsalagim");

            return text;
        }
        try {
            var evaled = await (eval(code));
            return message.channel.send(clean(evaled), {
                code: "js",
                split: true
            }).catch(e => {
                return message.channel.send(e, {
                    split: true,
                    code: "xl"
                });
            });
        } catch(e) {
            return message.channel.send(e, {
                split: true,
                code: "xl"
            }).catch(err => {
                return message.channel.send(err, {
                    split: true,
                    code: "xl"
                });
            });
        };
    }
};
