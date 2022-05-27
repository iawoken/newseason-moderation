module.exports = {
    Tag: [
        { activity: true, type: "username", tag: "ibidi" },
                { activity: true, type: "discriminator", tag: "0001" }

    ],

    YasakliTaglar: [
        { activity: true, type: "username", tag: "" }
    ],

    Taglialim: true,
    yasGerekli: true,

    Sunucuadi: "AWOKEN İBİDİ",
    Sunucuid: "",
    JailRol: "",
    SupheliRol: "",
    YasaklıTagRol: "",
    yaşSınır: 13,
    TagsizSembol: "TAGSIZ TAG",
    TagliSembol: "TAG",
    Color: "RANDOM",
    EmbedFooter: "",

    unregisterRol: [''],
    erkekRol: [''],
    kizRol: [''],
    vipRol: "",
    familyRol: "",
    chatMuteRol: "",
    boosterRol: "",
    baslangicYetki: "",

    ibidi: [],
    staffRoles: [],
    yonetimRoller: [],
    registerPerm: [],
    banHammer: [],
    jailHammer: [],
    muteHammer: [],
    teleportHammer: [],
    reklamciyonetimRoller: [],
    yetenekRoller: [],
    yetkiliAlimDM: [],
    dcCezalıYonetim: [],
    dcGenelBaskan: [],
    vkGenelBaskan: [],
    vkCezalıYonetim: [],
    streamGenelBaskan: [],
    streamCezalıYonetim: [],
    etkinlikGenelBaskan: [],

    Channels: {
        Welcome: "",
        Rules: "",
        Chat: ""
    },

    Rooms: {
        Public: [''], // Public Ses Kanallarının bulunduğu kategoriler
        Gecersiz: [''], // Buraya girilen ses kanallarında (KATEGORI ID SI GIRME!) puan kazanılamayacak.
        GecersizChat: ['', '', ''] // Buraya girilen kanallarda bot sistemleri çalışmayacak. (Puan kazanma gibi...)
    },

    Yetenekler: {
        Yazilim: "",
        Muzisyen: "",
        Stream: "",
        Vokal: "",
        Ressam: "",
        Sair: "",
        Tasarimci: ""
    },

    Task: {
      Types: ['invite', 'ses', 'taglı', 'mesaj', 'kayıt'], // Görev türleri (değiştirmene gerek yok)
    },

    Systems: {
        Yetki: false, // Yetki sistemi buradan açılıp kapanır. (true / false),
        Gorev: false,
        Market: false
    }
};
