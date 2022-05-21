const { Guild, TextChannel, GuildMember, MessageEmbed } = require('discord.js');
const Config = require('./Configs/Config');
const Settings = require('./Configs/Settings');
const client = global.client;
const Utils = global.Utils;
const Webhooklar = {};

Guild.prototype.log = async function (kullanıcı, yetkili, tip, kanal, ceza = {}) {
    const channel = this.channels.cache.find(kanalcik => kanalcik.name == kanal);
    const puanlog = this.channels.cache.find(kanalcik => kanalcik.name == "ceza-puan-log");
    let type;

    if(tip === "Mute") type = "metin kanallarında susturuldu!"
    if(tip === "Voice Mute") type = "ses kanallarında susturuldu!"
    if(tip === "Jail") type = "cezalandırıldı!"
    if(tip === "Warn") type = "uyarıldı!"
    if(tip === "Reklam") type = "reklam dolayısıyla cezalandırıldı!"
    if(tip === "Ban") type = "sunucudan yasaklandı!"

    if (channel) {
        const Embed = new MessageEmbed()
        .setColor(Settings.Color)
        .setAuthor(this.name, this.iconURL({ dynamic: true, size: 2048 }))
        .setFooter(`${Settings.EmbedFooter} • Ceza Numarası: #${ceza.ID}`, client.user.avatarURL({ dynamic: true, size: 2048 }))
        .setDescription(`${kullanıcı.toString()} **-** \`${kullanıcı.user.tag.replace('`', '')}\` kullanıcısı **${Utils.tarih(Date.now())}** tarihinde ${yetkili.toString()} tarafından **${ceza.Sebep}** nedeniyle ${type}`)

        channel.wsend(Embed);
        if (puanlog) puanlog.wsend(`${kullanıcı.toString()}: aldığınız **#${ceza.ID}** ID'li ceza ile **${await Utils.CezaPuanGetir(kullanıcı)}** ceza puanına ulaştınız.`);
        return;
    };
};

Guild.prototype.unlog = async function (uye, yetkili, tip, kanal, ceza = {}) {
    let channel = this.channels.cache.find(kanalcik => kanalcik.name === kanal);
    let type;

    if(!ceza.ID || ceza.ID == "x") {
        if(tip == "unban") type = "yasaklanması"
    } else {
        if(tip == "unban") type = `\`#${ceza.ID}\` numaralı yasaklanması`
        if(tip == "unjail") type = `\`#${ceza.ID}\` numaralı cezalandırılması`
        if(tip == "unmute") type = `\`#${ceza.ID}\` numaralı metin kanallarındaki susturulması`
        if(tip == "unvmute") type = `\`#${ceza.ID}\` numaralı ses kanallarındaki susturulması`
        if(tip == "unreklam") type = `\`#${ceza.ID}\` numaralı reklam cezası`
    }
    if (channel) {
        let embed = new MessageEmbed()
          .setAuthor(this.name, this.iconURL({ dynamic: true, size: 2048 }))
          .setColor(Settings.Color)
          .setDescription(`${uye.toString()} **-** \`${uye.user.tag.replace('`', '')}\` üyesinin ${type}, **${Utils.tarih(Date.now())}** tarihinde ${yetkili} tarafından kaldırıldı.`)
          .setFooter(Settings.EmbedFooter, client.user.avatarURL({ dynamic: true, size: 2048 }))

        return channel.wsend(embed)
    };
};

GuildMember.prototype.setRol = function (roles = []) {
    let rol = this.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(roles);
    return this.roles.set(rol);
};

Guild.prototype.getMember = async function (id) {
    let member = this.member(id);
    if (!member) {
        try {
            member = await this.members.fetch(id);
        }
        catch (err) {
            member = undefined;
        }
    }
    return member;
};

Guild.prototype.kanalBul = function(kanalcik) {
    let kanal = this.channels.cache.find(k => k.name === kanalcik)
    return kanal;
}

TextChannel.prototype.wsend = async function (content, options) {
    if (Webhooklar[this.id]) return (await Webhooklar[this.id].send(content, options));
    let entegrasyonlar = await this.fetchWebhooks();
    let webh = entegrasyonlar.find(e => e.name == client.user.username),
        result;
    if (!webh) {
        webh = await this.createWebhook(client.user.username, {
            avatar: client.user.avatarURL()
        });
        Webhooklar[this.id] = webh;
        result = await webh.send(content, options);
    } else {
        Webhooklar[this.id] = webh;
        result = await webh.send(content, options);
    };
    return result;
};

Array.prototype.chunk = function(chunk_size) {
    let myArray = Array.from(this);
    let tempArray = [];
    for (let index = 0; index < myArray.length; index += chunk_size) {
        let chunk = myArray.slice(index, index + chunk_size);
        tempArray.push(chunk);
    }
    return tempArray;
};

Array.prototype.random = function() {
  return this[Math.floor((Math.random()*this.length))];
};

/////////////////////////////////////////////////////////////////////////

GuildMember.prototype.puanGetir = async function () {
  if (Settings.Systems.Yetki !== true) return 0;
  const Puancik = require('./Schemas/Puan');
  const Data = await Puancik.findOne({ userID: this.id });
  if (!Data || !Data.Puan) return 0;
  return Number(Data.Puan);
};

GuildMember.prototype.puanAyarla = async function (puan) {
  if (Settings.Systems.Yetki !== true) return "awokenxd";
  const Puancik = require('./Schemas/Puan');
  await Puancik.findOneAndUpdate({ userID: this.id }, { userID: this.id, $set: { Puan: puan } }, { upsert: true });
  return "awokenxd";
};

GuildMember.prototype.puanEkle = async function (puan) {
  if (Settings.Systems.Yetki !== true) return "awokenxd";
  const Puancik = require('./Schemas/Puan');
  const Data = await Puancik.findOne({ userID: this.id });

  let Puan = Data ? Data.Puan ? Data.Puan : 0 : 0;
  let totalPuan = Number(Puan + puan);
  let yetkiAtladiMi = false;

  let nowRole = global.ranks.find(obj => obj.id == (Data ? Data.Yetki : Settings.baslangicYetki));
  let nextRole = global.ranks.find(role => role.index == nowRole.index+1);
  let yukselen = ["745428846081343514", "745428893909123073", "759166505903587369", "759166504678850621"];

  if (nextRole && nextRole !== global.ranks[global.ranks.length -1] && nextRole.puan <= totalPuan) {
    yetkiAtladiMi = true;
    if (this.guild.kanalBul('yetki-log')) this.guild.kanalBul('yetki-log').send(`${global.emojis.star} ${this.toString()} kişisi gereken **${nextRole.puan}** puana ulaştı ve \`${this.guild.roles.cache.has(nextRole.id) ? this.guild.roles.cache.get(nextRole.id).name : 'Bilinmeyen'}\` yetkisine yükseldi.`);
    
    if (yukselen.includes(nextRole.id)) {
    if (this.roles.cache.has(nowRole.id)) this.roles.remove(nowRole.id).catch(err => {});
    this.roles.add(nextRole.id).catch(err => {});

    if (nextRole && nextRole.hammers.length > 0) {
      nextRole.hammers.filter(rol => this.guild.roles.cache.has(rol)).forEach((item) => {
        const role = this.guild.roles.cache.has(item);
        if (!this.roles.cache.has(item)) this.roles.add(item).catch(err => {});
      });
    };
   }
  };
    
  await Puancik.findOne({ userID: this.id }, (err, data) => {
    if (!data) {
      const newData = new Puancik({
        userID: this.id,
        Yetki: yetkiAtladiMi == true ? nextRole.id : nowRole.id,
        Puan: puan
      });

      newData.save();
    } else {
      data.Yetki = yetkiAtladiMi == true ? nextRole.id : nowRole.id;
      data.Puan += Number(puan);

      data.save();
    };
  });

  if (yetkiAtladiMi == true) this.puanAyarla(0);
  return totalPuan;
};

/////////////////////////////////////////////////////////////////////////

GuildMember.prototype.gorevEkle = async function (type, hedef, puan, text) {
    if (Settings.Systems.Gorev !== true) return "awokenxd";
    const Task = require('./Schemas/Task.js');
    const Gorevler = await Task.find({ });

    return await new Task({ userID: this.id, durum: true, tamamlandi: false, tamamlanan: 0, hedef: hedef, puan: puan, tur: type, gorevText: text, tarih: Date.now(), bitis: Date.now() + require('ms')('24h') }).save();
};

GuildMember.prototype.gorevGuncelle = async function (type, count) {
  if (Settings.Systems.Gorev !== true) return "awokenxd";
  const Task = require('./Schemas/Task.js');
  const Gorevler = await Task.find({ userID: this.id, tur: type, durum: true });
  const aktifTamam = await Task.find({ userID: this.id, durum: true, tamamlandi: true });
  Gorevler.forEach(async (task) => {
    task.tamamlanan += Number(count);
    if (task.tamamlandi == false && task.tamamlanan >= task.hedef) {
      task.tamamlandi = true;
      await this.puanEkle(task.puan);
      if (aktifTamam.length +1 >= Settings.Task.Types.length) await this.puanEkle(1000);
      if (this.guild.kanalBul('task-log')) this.guild.kanalBul('task-log').send(`${global.emojis.star} ${this.toString()} kişisi **${type.charAt(0).toLocaleUpperCase() + type.slice(1)}** görevini başarıyla tamamladı!`);
    };
    await task.save();
  });
};

/////////////////////////////////////////////////////////////////////////

GuildMember.prototype.coinGetir = async function () {
  if (Settings.Systems.Market !== true) return "awokenxd";
  const Coinxd = require('./Schemas/Coin');
  let Coin = await Coinxd.findOne({ userID: this.id });
  return Coin ? Number(Coin.coin) : 0;
};

GuildMember.prototype.coinEkle = async function (coin) {
  if (Settings.Systems.Market !== true) return "awokenxd";
  const Coinxd = require('./Schemas/Coin');
  let Coin = await Coinxd.findOne({ userID: this.id });
  await Coinxd.findOneAndUpdate({ userID: this.id }, { userID: this.id, $inc: { coin: coin } }, { upsert: true });
  return Coin ? Number(Coin.coin) : 0;
};
