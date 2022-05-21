const Discord = require('discord.js');
const Utils = global.Utils;
const Settings = require('../../Configs/Settings.js');
const Puancik = require('../../Schemas/Puan');
const Tagged = require('../../Schemas/Taggeds')
const Tasks = require('../../Schemas/Task');
const Davetxd = require('../../Schemas/Invite');
const Parentxd = require('../../Schemas/voiceParent')
const ms = require('ms');


const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "yetkim",
    aliases: ['ystat'],

    onLoad: function (client) {

    },

    onCommand: async function (client, message, args) {
	    
      if (Settings.Systems.Yetki == false) return;
      if (!Settings.staffRoles.some(perm => message.member.roles.cache.has(perm)) && !message.member.permissions.has(8)) return message.react(global.emojis.cross);

      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member,
            user = member.user;

      if (!Utils.YetkiliMi(member)) return message.inlineReply(`Hata: Belirttiğiniz kullanıcı sunucumuzda yetkili değil. Bu nedenle yetkili verilerini görüntüleyemezsiniz.`)
        
      const Puan = await Puancik.findOne({ userID: user.id });
      let puanData = Puan ? Puan.Puan : 0;

      let nowRole = global.ranks.find(obj => obj.id == (Puan ? Puan.Yetki : Settings.baslangicYetki));
      let nextRole = global.ranks.find(role => role.index == (nowRole ? nowRole.index+1 : global.ranks[global.ranks.length -1].index));
      if (!nextRole) nextRole = global.ranks[global.ranks.length -1];
      let maxYetki = false;
      if (!nextRole || nextRole.puan <= puanData) maxYetki = true;

      const Taggeds = await Tagged.findOne({ userID: user.id });
      let tagData = Taggeds ? Taggeds.members ? (Taggeds.members.length) : 0 : 0;
      let tagPuan = (tagData * 30);
      const Registers = await Utils.toplamKayıt(member) || 0;
      let registerPuan = (Registers * 3);

      let Davet = await Davetxd.findOne({ userID: user.id }) || 0;
      if (Davet) Davet = Number(Davet.toplam);
      let davetPuan = (Davet * 3);

      let Cezacik = await Utils.CezalariGetir(member) || [];
      Cezacik = Cezacik.filter(xd => xd.Tip == "Uyarı");
      let cezapuanDurum = Cezacik.length > 3 ? (Cezacik.length -3) * 250 : 0;

      let yetkiAtlama;
      let yetkiAtlamaYuzde = Math.round((puanData / nextRole.puan) * 100);
      if(yetkiAtlamaYuzde < 60) yetkiAtlama = `Atlamaya uygun değil`;
      if(yetkiAtlamaYuzde >= 60) yetkiAtlama = `Atlamaya yakın`;
      if(yetkiAtlamaYuzde >= 100) yetkiAtlama = `Atlamaya uygun`;

      let Task = await Tasks.find({ userID: user.id });
      let gorevPuan = Task.length > 0 ? Task.filter(task => task.tamamlandi == true).map((xd) => xd.puan).reduce((a, b) => a + b, 0) : 0;

      let KullaniciYetkisi;
      if (nowRole) {
        KullaniciYetkisi = `Şu an <@&${nowRole.id}> rolündesiniz. <@&${nextRole.id}> rolüne ulaşmak için \`${(nextRole.puan - puanData) <= 0 ? 0 : (nextRole.puan - puanData)}\` puan daha kazanmanız gerekiyor!`;
      };
      if (nextRole == global.ranks[global.ranks.length -1]) {
        KullaniciYetkisi = `Şu an son yetkidesiniz! Emekleriniz için teşekkür ederiz.`;
      };
        
        const category = async (parentsArray, type = 'data') => {
		if (type == 'data') {
			const data = await Parentxd.find({ userID: user.id });
			const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
			let voiceStat = 0;
			for (var i = 0; i <= voiceUserParentData.length; i++) {
				voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
			}
			return moment.duration(voiceStat).format("H [saat], m [dakika] s [saniye]");
		} else if (type == 'point') {
			const data = await Parentxd.find({ userID: user.id });
			const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
			let voiceStat = 0;
			
			for (var i = 0; i <= voiceUserParentData.length; i++) {
				voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
			}
			
			if (parentsArray == Settings.Rooms.Public) return Number (Math.floor(parseInt(data/1000/60) / 1) * 0.4);
			else if (parentsArray.includes('745409926045761624')) return Number(Math.floor(parseInt(data/1000/60) / 1) * 0.34);
			else if (parentsArray.includes('749386210044280873')) return Number(Math.floor(parseInt(data/1000/60) / 1) * 0.4);
			else if (parentsArray.includes('745421315468689509')) return Number(Math.floor(parseInt(data/1000/60) / 1) * 0.17);
		};
	};


      const Embed = new Discord.MessageEmbed()
      .setColor(member.roles.highest.hexColor !== "#000000" ? member.roles.highest.hexColor : Settings.Color)
      .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
      .setDescription(`${member.toString()} kullanıcısının yetki yükseltim bilgileri aşağıda belirtilmiştir.`)
      .addField(`Notlar`, `Şuan da \`${Cezacik.length || 0}\` uyarın görünmekte eğer uyarı sayın 3'ün üzerine çıkarsa aldığın her uyarı kalıcı olarak sana \`-250\` ve katı şeklinde puan ekleyecektir. (\`Ceza Puan: ${cezapuanDurum}\`)\n\u200b`)
      .addField(`${global.emojis.star} Ceza Puan Durumu`, `${global.emojis.stat} Toplam Puan: \`${puanData} (Ceza Etkisi: -${cezapuanDurum} => ${Math.round((puanData))})\`\n${global.emojis.stat} Yetki atlama durumunuz \`${yetkiAtlama}\``)
      .addField(`${global.emojis.star2} Ses Bilgileri`, `${global.emojis.stat} Public Kanallar: \`${await category(Settings.Rooms.Public)}\`\n${global.emojis.stat} Kayıt Kanalları: \`${await category(["745409926045761624"])}\`\n${global.emojis.stat} Stream Odaları: \`${await category(["749386210044280873"])}\`\n${global.emojis.stat} Private Odaları: \`${await category(["745421315468689509"])}\``)
      .addField(`${global.emojis.star} Genel Puan Durumu`, `${global.emojis.stat} Taglı Puan: \`${tagData} adet (Puan Etkisi: +${tagPuan} => ${puanData})\`\n${global.emojis.stat} Teyit Puan: \`${Registers} adet (Puan Etkisi: +${registerPuan} => ${puanData})\`\n${global.emojis.stat} Davet Puan: \`${Davet} adet (Puan Etkisi: +${davetPuan} => ${puanData})\`\n${global.emojis.stat} Görev Puan: \`${Task.filter(xd => xd.tamamlandi).length} adet (Puan Etkisi: +${gorevPuan} => ${puanData})\`\n\u200b`)
      .addField(`${global.emojis.star2} Puan Durumu`, `- Puanınız: \`${puanData}\` Gereken: \`${nextRole.puan}\`\n${client.progressBar(puanData, nextRole.puan, 8)} \`${puanData} / ${nextRole.puan}\``)
      .addField(`${global.emojis.star2} ${(nextRole == global.ranks[global.ranks.length -1]) ? 'Tebrikler!' : 'Yetki Durumu'}`, KullaniciYetkisi)

      return message.inlineReply({ embed: Embed });
    }
};
