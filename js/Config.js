// ============================
// AIRPORT LOCATION SETTINGS
// ============================

let airportCode = "YQB";                 // Airport data source
let airportDisplayName = "Quebec City";  // Forced display name
let zipCode = null;

// ============================
// CONFIG
// ============================

window.CONFIG = {
  crawl: `You are Watching JibboshTV, Canada's Least Trusted TV Weather channel, Located in New Brunswick, Canada!`,

  greetings: [
    "Bazinga!",
  ],

  volume: {
    voice: 1,
    music: 0,
    musicRed: 0,
    musicDuck: 0,
    musicRedDuck: 0,
    jingle: 0.25
  },

  language: "en-US",
  countryCode: "US",

  units: "m",
  unitField: "imperial",

  loop: false,
  standbyMode: false,

  // 🔒 FORCE AIRPORT MODE
  locationMode: "AIRPORT",

  secrets: {
    twcAPIKey: "71f92ea9dd2f4790b92ea9dd2f779061",
    radarAPIKey: "V2X2KYG9LLRKQL65NJEEFLURE",
  },

  musicTracks: [
    "assets/music/WX_Branding_Short.wav",
    "assets/music/new/1.mp3",
    "assets/music/new/2.mp3",
    "assets/music/new/3.mp3",
    "assets/music/new/4.mp3",
    "assets/music/new/5.mp3",
    "assets/music/new/6.mp3",
    "assets/music/new/7.mp3",
    "assets/music/new/8.mp3",
    "assets/music/new/9.mp3",
    "assets/music/new/10.mp3",
    "assets/music/new/11.mp3",
    "assets/music/new/12.mp3",
    "assets/music/new/13.mp3",
    "assets/music/new/14.mp3",
    "assets/music/new/15.mp3",
  ],

  redMusicTracks: [
    "assets/music/red/red_EOTS_1.wav",
    "assets/music/red/red_EOTS_2.wav",
    "assets/music/red/red_2018_1.wav",
    "assets/music/red/red_winter_1.mp3",
  ],

  mainBackgrounds: [
    "https://jibboshtvfiles.jibbosh.com/bg/Holidays.png"
  ],

  redModeBackgrounds: [
    "https://jibboshtvfiles.jibbosh.com/bg/Red Mode.png"
  ],

  subRedModeBackgrounds: [
    "https://jibboshtvfiles.jibbosh.com/bg/Red Mode.png"
  ],

  hurricaneBackgrounds: [
    "assets/backgrounds/Hurricane_Central_i2_xD.png"
  ],

  winterStormBackgrounds: [
    "assets/backgrounds/WinterRedBG_1.png",
  ],

  productionModeAssets: [
    "https://jibboshtvfiles.jibbosh.com/bg/Red Mode.png"
  ],

  // ============================
  // SETTINGS SYSTEM (UNCHANGED)
  // ============================

  options: [],

  addOption: (id, name, desc) => {
    CONFIG.options.push({ id, name, desc });
  },

  submit: () => {
    // 🔒 LOCK AIRPORT MODE
    CONFIG.locationMode = "AIRPORT";
    zipCode = null;

    CONFIG.unitField =
      CONFIG.units === "m"
        ? "metric"
        : CONFIG.units === "h"
        ? "uk_hybrid"
        : "imperial";

    // Fetch using airport
    fetchCurrentWeather(airportCode);

    // Force display name AFTER render
    setTimeout(forceAirportDisplayName, 500);
  },

  load: () => {
    let settingsPrompt = getElement("settings-prompt");
    let zipContainer = getElement("zip-container");
    let advancedSettingsOptions = getElement("advanced-settings-options");

    CONFIG.options.forEach((option) => {
      let label = document.createElement("div");
      label.classList.add("strong-text", "settings-item", "settings-text");
      label.appendChild(document.createTextNode(option.name));
      label.id = `${option.id}-label`;

      let textbox = document.createElement("input");
      textbox.classList.add("settings-item", "settings-text", "settings-input");
      textbox.type = "text";
      textbox.placeholder = option.desc;
      textbox.id = `${option.id}-text`;

      if (localStorage.getItem(option.id)) {
        textbox.value = localStorage.getItem(option.id);
      }

      let br = document.createElement("br");

      advancedSettingsOptions.appendChild(label);
      advancedSettingsOptions.appendChild(textbox);
      advancedSettingsOptions.appendChild(br);
    });

    let btn = document.createElement("button");
    btn.classList.add("setting-item", "settings-text", "settings-input", "button");
    btn.id = "submit-button";
    btn.onclick = CONFIG.submit;
    btn.appendChild(document.createTextNode("Start"));
    settingsPrompt.appendChild(btn);

    if (CONFIG.loop || CONFIG.standbyMode) {
      hideSettings();
      CONFIG.submit();
    }

    if (getQueryVariable(`autorun`) == "true") {
      CONFIG.submit();
    }
  },
};

// ============================
// FORCE DISPLAY NAME (CLEAN)
// ============================

function forceAirportDisplayName() {
  const ids = [
    "infobar-location-text",
    "hello-location-text",
    "location-text"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = airportDisplayName;
  });
}

// ============================
// UNIT FIELD RESOLUTION
// ============================

CONFIG.unitField =
  CONFIG.units === "m"
    ? "metric"
    : CONFIG.units === "h"
    ? "uk_hybrid"
    : "imperial";
