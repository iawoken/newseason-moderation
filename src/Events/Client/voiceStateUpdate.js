const Discord = require('discord.js');
const client = global.client;
const Utils = global.Utils;
const Settings = global.settings;

module.exports = async (oldState, newState) => {
    if(oldState.channelID && !newState.channelID) return;

    let Cezalarxd = await Utils.CezalariGetir(oldState);
    Cezalarxd = Cezalarxd.filter(xd => xd.Aktif == true && xd.Tip == "Voice Mute");
    if (!Cezalarxd || Cezalarxd.length <= 0) return;

    if(newState.member.manageable && newState.serverMute == false) {
    	await newState.setMute(true)
    };
};

module.exports.config = {
    Event: "voiceStateUpdate"
}
