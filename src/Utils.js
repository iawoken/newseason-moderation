const Discord = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');
const ms = require('ms');
const Settings = require('./Configs/Settings');
const client = global.client;
require('moment-duration-format');
require('moment-timezone')

class Awoken {
    static tarih(tarih) {
        const Aylar = {
            "01": "Ocak",
            "02": "Şubat",
            "03": "Mart",
            "04": "Nisan",
            "05": "Mayıs",
            "06": "Haziran",
            "07": "Temmuz",
            "08": "Ağustos",
            "09": "Eylül",
            "10": "Ekim",
            "11": "Kasım",
            "12": "Aralık"
        };

        let tarihxd = moment(tarih).tz("Europe/Istanbul").format("DD") + " " + Aylar[moment(tarih).tz("Europe/Istanbul").format("MM")] + " " + moment(tarih).tz("Europe/Istanbul").format("YYYY HH:mm")
        return tarihxd;
    };

    static turkishDate (date) {
        if (!date || typeof date !== "number") return;
        const awoken = require('pretty-ms');
        let convert = awoken(date, { verbose: true })
          .replace("minutes", "dakika")
          .replace("minute", "dakika")
          .replace("hours", "saat")
          .replace("hour", "saat")
          .replace("seconds", "saniye")
          .replace("second", "saniye")
          .replace("days", "gün")
          .replace("day", "gün")
          .replace("years", "yıl")
          .replace("year", "yıl");
        return convert
    }

    static async getUser (userID) {
        try {
            return await global.client.users.fetch(userID);
        } catch (error) {
            return undefined;
        };
    };

    /////////////////////////////////////////////////////////////////

    static async cezaNumarasiGetir () {
        const Cezafln = require('./Schemas/Ceza');
        let Cezalar = await Cezafln.find({});
        if(!Cezalar || Cezalar.length <= 0) return 1;

        return Number(Cezalar[Cezalar.length -1].ID)+1;
    };

    static async CezaEkle (member, yetkili, type, reason = "Sebep Belirtilmemiş.", Times = {}) {
        const Cezafln = require('./Schemas/Ceza');
        const CezaID = await this.cezaNumarasiGetir();

        // Chat Mute, Voice Mute, Uyarı, Jail, Ban

        await Cezafln.insertMany({
            ID: CezaID,
            Aktif: true,
            userID: member.id,
            yetkiliID: yetkili.user.id,
            Tip: type,
            Sebep: reason,
            Kaldiran: "Kaldırılmamış.",

            Other: {
                Tarih: Date.now(),
                Sure: Times.Sure ? Times.Sure : null,
                Bitis: Times.Bitis ? Times.Bitis : null
            }
        }).catch(err => console.log(this.logger('warn', `${CezaID} ID'sine sahip ceza veri tabanına kayıt edilirken bir hata oluştu!`)));
    };

    static async CezaBilgi (cezaID) {
        const Cezafln = require('./Schemas/Ceza');
        const Ceza = await Cezafln.findOne({ ID: cezaID });

        return Ceza;
    };

    static async CezaPuanGetir (member) {
        const Cezafln = require('./Schemas/Ceza');
        const Ceza = await Cezafln.find({ userID: member.user.id });

        if (!Ceza) return 0;
        let filterArr = Ceza.map(x => (x.Tip));

        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0;
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0;
        let jail = filterArr.filter(x => x == "Jail").length || 0;
        let ban = filterArr.filter(x => x == "Ban").length || 0;
        let uyarı = filterArr.filter(x => x == "Uyarı").length || 0;

        let point = (chatMute * 8) + (voiceMute * 10) + (jail * 15) + (ban * 20) + (uyarı * 3);
        return point;
    };

    static async CezalariGetir (member, options = {}) {
        const Cezafln = require('./Schemas/Ceza');
        const Ceza = await Cezafln.find({ userID: member.id });

        if(options.type == "category") {
            let Datas = [
                { name: "Yasaklama", data: Ceza.filter(C => C.Tip == "Ban").length },
                { name: "Jail", data: Ceza.filter(C => C.Tip == "Jail").length },
                { name: "Sohbet Susturması", data: Ceza.filter(C => C.Tip == "Chat Mute").length },
                { name: "Ses Susturması", data: Ceza.filter(C => C.Tip == "Voice Mute").length },
                { name: "Uyarı", data: Ceza.filter(C => C.Tip == "Uyarı").length },
            ]
            Datas = Datas.filter(xd => xd.data > 0);

            const Text = [];
            for(let index = 0; index < Datas.length; index++) {
                const Data = Datas[index];

                Text.push(`**${Data.data}** adet **${Data.name}**`);
            };

            return Text.join(', ');
        };

        return Ceza;
    };

    static async TeyitEkle (member, cinsiyet) {
        const Registerxd = require('./Schemas/Register');

        await Registerxd.findOne({ userID: member.id }, (error, data) => {
            if (!data) {
                const Data = new Registerxd({
                    userID: member.id,
                    yetkiliID: null,
                    Nicknames: [],

                    Registers: {
                        totalMan: cinsiyet == "Erkek" ? 1 : 0,
                        totalWoman: cinsiyet == "Kız" ? 1 : 0,
                    }
                });

                return Data.save();
            } else {
                if(cinsiyet == "Erkek") data.Registers.totalMan++;
                else if(cinsiyet == "Kız") data.Registers.totalWoman++;

                return data.save();
            };
        });
    };

    static async KayitEt (member, yetkili, options = { age: "Yok" }) {
        const Registerxd = require('./Schemas/Register');

        const UserRegister = await Registerxd.findOne({ userID: member.id });
        const YetkiliRegister = await Registerxd.findOne({ userID: yetkili.id });

        if (!YetkiliRegister) {
            const newYetkiliRegister = new Registerxd({
                userID: yetkili.id,
                yetkiliID: null,
                Nicknames: [],

                Registers: {
                    totalMan: options.cinsiyet == "Erkek" ? 1 : 0,
                    totalWoman: options.cinsiyet == "Kız" ? 1 : 0,
                }
            });

            newYetkiliRegister.save();
        } else {
            if (options.cinsiyet == "Erkek") YetkiliRegister.Registers.totalMan++;
            if (options.cinsiyet == "Kız") YetkiliRegister.Registers.totalWoman++;

            YetkiliRegister.save();
        };

        if (!UserRegister) {
            const newUserRegister = new Registerxd({
                userID: member.id,
                yetkiliID: yetkili.id,
                Nicknames: [{tarih: Date.now(), isim: options.name, yas: options.age, fullname: `${options.name}${options.age == null ? `` : ` | ${options.age}`}`, cinsiyet: options.cinsiyet, islem: 'Kayıt'}],

                Registers: {
                    totalMan: 0,
                    totalWoman: 0,
                }
            });

            newUserRegister.save();
        } else {
            const opt = {tarih: Date.now(), isim: options.name, yas: options.age, fullname: `${options.name}${options.age == null ? `` : ` | ${options.age}`}`, cinsiyet: options.cinsiyet, islem: 'Kayıt'};

            UserRegister.yetkiliID = yetkili.id;
            if (UserRegister.Nicknames.length > 0) UserRegister.Nicknames.push(opt);
            else UserRegister.Nicknames = [opt];

            UserRegister.save();
        };

        await yetkili.puanEkle(3);
        await yetkili.gorevGuncelle('kayıt', 1);
        return "awokenxd"
    };

    static async isimDegistir (member, options = { age: "Yok" }) {
        const Registerxd = require('./Schemas/Register');
        const UserName = await Registerxd.findOne({ userID: member.id });

        if (!UserName) {
            const newUsername = new Registerxd({
                userID: member.id,
                yetkiliID: null,
                Nicknames: [{tarih: Date.now(), isim: options.name, yas: options.age, fullname: `${options.name}${options.age == null ? `` : ` | ${options.age}`}`, cinsiyet: "Yok", islem: 'İsim Değişikliği'}],

                Registers: {
                    totalMan: 0,
                    totalWoman: 0
                }
            });

            newUsername.save();
        } else {
            UserName.Nicknames.push({tarih: Date.now(), isim: options.name, yas: options.age, fullname: `${options.name}${options.age == null ? `` : ` | ${options.age}`}`, cinsiyet: "Yok", islem: 'İsim Değişikliği'})
            UserName.save();
        };

        return "awokenxd";
    };

    static async toplamKayıt (member, options = {}) {
        const Registerxd = require('./Schemas/Register');
        const Register = await Registerxd.findOne({ userID: member.id });

        if (options.getir == "members") {
            const Uyecik = await Registerxd.find({ yetkiliID: member.id }).map(xd => xd) || [];
            return Uyecik;
        } else if (options.getir == "total") {
            const Datacik = await Registerxd.findOne({ userID: member.id });
            if (!Datacik) return [];
            const Arr = [`**${Datacik.Registers.totalMan}** erkek`, `**${Datacik.Registers.totalWoman}** kız`].filter(xd => !xd.startsWith('**0**')).map(x => x);
            return Arr.length > 0 ? Arr.join(', ') : null;
        };

        if (!Register) return 0

        return Number(Register.Registers.totalMan || 0) + Number(Register.Registers.totalWoman || 0);
    };

    static KayıtKontrol (member) {
        if (Settings.erkekRol.some(perm => member.roles.cache.has(perm)) || Settings.kizRol.some(perm => member.roles.cache.has(perm))) return true;
        return false
    };

    static YetkiliMi (member) {
        let mem = member;
        if (mem instanceof Discord.GuildMember === false) mem = global.client.guilds.cache.get(Settings.Sunucuid).members.cache.get(mem.id);
        if (Settings.staffRoles.some(perm => member.roles.cache.has(perm))) return true
        return false
    };

    static BoostKontrol (member) {
        const Guild = client.guilds.cache.get(Settings.Sunucuid);
        if (!Guild) return false;
        if (Guild.members.cache.get(member.id).premiumSinceTimestamp > 0) return true;
        return false;
    };

    static TagKontrol (user, options = {}) {
        if (!user) return false;
        let TotalTags = Settings.Tag.filter(tag => tag.activity == true),
            Tags = [];

        TotalTags.forEach((item) => {
          if (item.type && item.type == "username" && String(user.username).includes(item.tag)) Tags.push(item)
          else if (item.type && item.type == "discriminator" && String(user.discriminator).includes(item.tag)) Tags.push(item);
        });

        if(options.type == "tags") return {
          Tags: Tags.map(xd => xd),
          Taglimi: Tags.length > 0 ? true : false
        };

        return Tags.length > 0 ? true : false;
    };

    static YasaklıTag (user, options = {}) {
      if (!user) return false;
      let Yasaklılar = Settings.YasakliTaglar.filter(tag => tag.activity == true),
          Tags = [];

      Yasaklılar.forEach((item) => {
        if (item.type && item.type == "username" && String(user.username).includes(item.tag)) Tags.push(item)
        else if (item.type && item.type == "discriminator" && String(user.discriminator).includes(item.tag)) Tags.push(item);
      });

      if(options.type == "tags") return {
        Tags: Tags.map(xd => xd),
        Taglimi: Tags.length > 0 ? true : false
      };

      return Tags.length > 0 ? true : false;
    };

    static KufurKontrol (content) {
        let badwords = ["allahoc","allahoç","allahamk","allahaq","0r0spuc0cu","4n4n1 sk3r1m","p1c","@n@nı skrm","evladi","orsb","orsbcogu","amnskm","anaskm","oc","abaza","abazan","ag","a\u011fz\u0131na s\u0131\u00e7ay\u0131m","fuck","shit","ahmak","seks","sex","allahs\u0131z","amar\u0131m","ambiti","am biti","amc\u0131\u011f\u0131","amc\u0131\u011f\u0131n","amc\u0131\u011f\u0131n\u0131","amc\u0131\u011f\u0131n\u0131z\u0131","amc\u0131k","amc\u0131k ho\u015faf\u0131","amc\u0131klama","amc\u0131kland\u0131","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","am\u0131k","am\u0131na","amına","am\u0131nako","am\u0131na koy","am\u0131na koyar\u0131m","am\u0131na koyay\u0131m","am\u0131nakoyim","am\u0131na koyyim","am\u0131na s","am\u0131na sikem","am\u0131na sokam","am\u0131n feryad\u0131","am\u0131n\u0131","am\u0131n\u0131 s","am\u0131n oglu","am\u0131no\u011flu","am\u0131n o\u011flu","am\u0131s\u0131na","am\u0131s\u0131n\u0131","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyay\u0131m","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk \u00e7ocu\u011fu","amlarnzn","aml\u0131","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","ams\u0131z","amsiz","amsz","amteri","amugaa","amu\u011fa","amuna","ana","anaaann","anal","analarn","anam","anamla","anan","anana","anandan","anan\u0131","anan\u0131","anan\u0131n","anan\u0131n am","anan\u0131n am\u0131","anan\u0131n d\u00f6l\u00fc","anan\u0131nki","anan\u0131sikerim","anan\u0131 sikerim","anan\u0131sikeyim","anan\u0131 sikeyim","anan\u0131z\u0131n","anan\u0131z\u0131n am","anani","ananin","ananisikerim","anani sikerim","ananisikeyim","anani sikeyim","anann","ananz","anas","anas\u0131n\u0131","anas\u0131n\u0131n am","anas\u0131 orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","aq","a.q","a.q.","aq.","ass","atkafas\u0131","atm\u0131k","att\u0131rd\u0131\u011f\u0131m","attrrm","auzlu","avrat","ayklarmalrmsikerim","azd\u0131m","azd\u0131r","azd\u0131r\u0131c\u0131","babaannesi ka\u015far","baban\u0131","baban\u0131n","babani","babas\u0131 pezevenk","baca\u011f\u0131na s\u0131\u00e7ay\u0131m","bac\u0131na","bac\u0131n\u0131","bac\u0131n\u0131n","bacini","bacn","bacndan","bacy","bastard","b\u0131z\u0131r","bitch","biting","boner","bosalmak","bo\u015falmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","cikar","cim","\u00e7\u00fck","dalaks\u0131z","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domald\u0131","domald\u0131n","domal\u0131k","domal\u0131yor","domalmak","domalm\u0131\u015f","domals\u0131n","domalt","domaltarak","domalt\u0131p","domalt\u0131r","domalt\u0131r\u0131m","domaltip","domaltmak","d\u00f6l\u00fc","d\u00f6nek","d\u00fcd\u00fck","eben","ebeni","ebenin","ebeninki","ebleh","ecdad\u0131n\u0131","ecdadini","embesil","emi","fahise","fahi\u015fe","feri\u015ftah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","giberim","giberler","gibis","gibi\u015f","gibmek","gibtiler","goddamn","godo\u015f","godumun","gotelek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","goyiim","goyum","goyuyim","goyyim","g\u00f6t","g\u00f6t deli\u011fi","g\u00f6telek","g\u00f6t herif","g\u00f6tlalesi","g\u00f6tlek","g\u00f6to\u011flan\u0131","g\u00f6t o\u011flan\u0131","g\u00f6to\u015f","g\u00f6tten","g\u00f6t\u00fc","g\u00f6t\u00fcn","g\u00f6t\u00fcne","g\u00f6t\u00fcnekoyim","g\u00f6t\u00fcne koyim","g\u00f6t\u00fcn\u00fc","g\u00f6tveren","g\u00f6t veren","g\u00f6t verir","gtelek","gtn","gtnde","gtnden","gtne","gtten","gtveren","hasiktir","hassikome","hassiktir","has siktir","hassittir","haysiyetsiz","hayvan herif","ho\u015faf\u0131","h\u00f6d\u00fck","hsktr","huur","\u0131bnel\u0131k","ibina","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnerator","ibnesi","idiot","idiyot","imansz","ipne","iserim","i\u015ferim","ito\u011flu it","kafam girsin","kafas\u0131z","kafasiz","kahpe","kahpenin","kahpenin feryad\u0131","kaka","kaltak","kanc\u0131k","kancik","kappe","karhane","ka\u015far","kavat","kavatn","kaypak","kayyum","kerane","kerhane","kerhanelerde","kevase","keva\u015fe","kevvase","koca g\u00f6t","kodu\u011fmun","kodu\u011fmunun","kodumun","kodumunun","koduumun","koyarm","koyay\u0131m","koyiim","koyiiym","koyim","koyum","koyyim","krar","kukudaym","laciye boyad\u0131m","libo\u015f","madafaka","malafat","malak","mcik","meme","memelerini","mezveleli","minaamc\u0131k","mincikliyim","mna","monakkoluyum","motherfucker","mudik","oc","ocuu","ocuun","O\u00c7","o\u00e7","o. \u00e7ocu\u011fu","o\u011flan","o\u011flanc\u0131","o\u011flu it","orosbucocuu","orospu","orospucocugu","orospu cocugu","orospu \u00e7oc","orospu\u00e7ocu\u011fu","orospu \u00e7ocu\u011fu","orospu \u00e7ocu\u011fudur","orospu \u00e7ocuklar\u0131","orospudur","orospular","orospunun","orospunun evlad\u0131","orospuydu","orospuyuz","orostoban","orostopol","orrospu","oruspu","oruspu\u00e7ocu\u011fu","oruspu \u00e7ocu\u011fu","osbir","ossurduum","ossurmak","ossuruk","osur","osurduu","osuruk","osururum","otuzbir","\u00f6k\u00fcz","\u00f6\u015fex","patlak zar","penis","pezevek","pezeven","pezeveng","pezevengi","pezevengin evlad\u0131","pezevenk","pezo","pic","pici","picler","pi\u00e7","pi\u00e7in o\u011flu","pi\u00e7 kurusu","pi\u00e7ler","pipi","pipi\u015f","pisliktir","porno","pussy","pu\u015ft","pu\u015fttur","rahminde","revizyonist","s1kerim","s1kerm","s1krm","sakso","saksofon","saxo","sekis","serefsiz","sevgi koyar\u0131m","sevi\u015felim","sexs","s\u0131\u00e7ar\u0131m","s\u0131\u00e7t\u0131\u011f\u0131m","s\u0131ecem","sicarsin","sie","sik","sikdi","sikdi\u011fim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikesicenin","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmi\u015f","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","siki\u015f","siki\u015fen","siki\u015fme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikko","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinbaya","siksinler","siksiz","siksok","siksz","sikt","sikti","siktigimin","siktigiminin","sikti\u011fim","sikti\u011fimin","sikti\u011fiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktim","siktimin","siktiminin","siktir","siktir et","siktirgit","siktir git","siktirir","siktiririm","siktiriyor","siktir lan","siktirolgit","siktir ol git","sittimin","sittir","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokar\u0131m","sokarim","sokarm","sokarmkoduumun","sokay\u0131m","sokaym","sokiim","soktu\u011fumunun","sokuk","sokum","soku\u015f","sokuyum","soxum","sulaleni","s\u00fclaleni","s\u00fclalenizi","s\u00fcrt\u00fck","\u015ferefsiz","\u015f\u0131ll\u0131k","taaklarn","taaklarna","tarrakimin","tasak","tassak","ta\u015fak","ta\u015f\u015fak","tipini s.k","tipinizi s.keyim","tiyniyat","toplarm","topsun","toto\u015f","vajina","vajinan\u0131","veled","veledizina","veled i zina","verdiimin","weled","weledizina","whore","xikeyim","yaaraaa","yalama","yalar\u0131m","yalarun","yaraaam","yarak","yaraks\u0131z","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraam\u0131","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarra\u011f","yarra\u011f\u0131m","yarra\u011f\u0131m\u0131","yarraimin","yarrak","yarram","yarramin","yarraminba\u015f\u0131","yarramn","yarran","yarrana","yarrrak","yavak","yav\u015f","yav\u015fak","yav\u015fakt\u0131r","yavu\u015fak","y\u0131l\u0131\u015f\u0131k","yilisik","yogurtlayam","yo\u011furtlayam","yrrak","z\u0131kk\u0131m\u0131m","zibidi","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiiin","ziksiin","zulliyetini","zviyetini"];
        if ((badwords).some(word => new RegExp("(\\b)+(" + word + ")+(\\b)", "gui").test(content.replaceAll('_', '')))) return true;
        return false;
    };

    static ReklamKontrol (content) {
        let invite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
        if (invite.test(content.replaceAll('_', ''))) return true;

        let link = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;
        if (link.test(content.replaceAll('_', ''))) return true;

        return false;
    };

    /////////////////////////////////////////////////////////////////

    static logger(type = "info", text) {
        const chalk = require('chalk');
        switch (type) {
            case "error":
            case "err":
                return console.log(`[${chalk.red("ERROR")}] ${text}`);
                break

            case "info":
                return console.log(`[${chalk.blue("INFO")}] ${text}`);
                break

            case "warn":
                return console.log(`[${chalk.keyword("orange")('WARN')}] ${text}`);
                break

            default:
                return console.log(`[${chalk.green(type)}] ${text ? text : "Bilinmiyor."}`);
                break
        };
    };
}

module.exports = Awoken;
