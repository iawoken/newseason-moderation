const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (invite) => {
  setTimeout(async () => {
    global.davetler.set(invite.guild.id, await invite.guild.fetchInvites());
  }, 5000);
};

module.exports.config = {
    Event: "inviteDelete"
}
