const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (invite) => {
  global.davetler.set(invite.guild.id, await invite.guild.fetchInvites());
};

module.exports.config = {
    Event: "inviteCreate"
}
