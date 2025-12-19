window.CONFIG = {
  crawl: `You are Watching JibboshTV, Canada's Least Trusted TV Weather channel, Located in New Brunswick, Canada!`,
  // crawl: `Funny Seasonal Message!`,
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
  language: "en-US", // Supported in TWC API
  countryCode: "US", // Supported in TWC API (for postal key)
  units: "m", // Supported in TWC API (e = English (imperial), m = Metric, h = Hybrid (UK)),
  unitField: "imperial", // Supported in TWC API. This field will be filled in automatically. (imperial = e, metric = m, uk_hybrid = h)
  loop: false,
  standbyMode: false,
  secrets: {
    // Possibly deprecated key: See issue #29
    // twcAPIKey: 'd522aa97197fd864d36b418f39ebb323'
    twcAPIKey: "71f92ea9dd2f4790b92ea9dd2f779061",
    radarAPIKey: "V2X2KYG9LLRKQL65NJEEFLURE",
    /* I KNOW THIS IS A BAD IDEA. If you're going to spam my API keys, please don't. <3*/
  },
  musicTracks: [
    /* Original Music */
    // "assets/music/WX_AMHQ_1.wav",
    // "assets/music/WX_AMHQ_2.wav",
    // "assets/music/WX_Tomorrows_Sunrise.wav",
    "assets/music/WX_Branding_Short.wav",
    // "assets/music/WX_Clouds_May_Come.wav",
    // "assets/music/WX_Song_6.wav",
    // "assets/music/WX_Song_7.wav",
    // "assets/music/WX_Song_11.wav",
    // "assets/music/WX_Wake_Up_With_Al_1.wav",
    // "assets/music/WX_Wake_Up_With_Al_2.wav",
    // "assets/music/WX_Weekend_Recharge_1.wav",
    // "assets/music/WX_Weekend_Recharge_2.wav",

    /* New Music */

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
  redModeBackgrounds: [
    "https://jibboshtvfiles.jibbosh.com/bg/Red Mode.png"
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

  // Config Functions (index.html settings manager)
  options: [],
  addOption: (id, name, desc) => {
    CONFIG.options.push({
      id,
      name,
      desc,
    });
  },
  submit: (btn, e) => {
    let args = {};
    CONFIG.options.forEach((opt) => {
      args[opt.id] = getElement(`${opt.id}-text`).value;
      localStorage.setItem(opt.id, args[opt.id]);
    });
    if (args.crawlText !== "") CONFIG.crawl = args.crawlText;
    if (args.greetingText !== "")
      CONFIG.greetings[selectRandomArray(CONFIG.greetings)] = args.greetingText;
    if (args.loop === "y") CONFIG.loop = true;
    if (getQueryVariable(`zip`) != false) {
      zipCode = getQueryVariable(`zip`);
    } else if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(args["zip-code"])) {
      zipCode = args["zip-code"];
    } else {
      alert("Enter valid ZIP code");
      return;
    }
    CONFIG.unitField =
      CONFIG.units === "m"
        ? "metric"
        : CONFIG.units === "h"
        ? "uk_hybrid"
        : "imperial";
    fetchCurrentWeather();
  },
  load: () => {
    let settingsPrompt = getElement("settings-prompt");
    let zipContainer = getElement("zip-container");
    let advancedSettingsOptions = getElement("advanced-settings-options");
    CONFIG.options.forEach((option) => {
      //<div class="regular-text settings-item settings-text">Zip Code</div>
      let label = document.createElement("div");
      label.classList.add("strong-text", "settings-item", "settings-text");
      label.appendChild(document.createTextNode(option.name));
      label.id = `${option.id}-label`;
      //<input class="settings-item settings-text" type="text" id="zip-code-text">
      let textbox = document.createElement("input");
      textbox.classList.add("settings-item", "settings-text", "settings-input");
      textbox.type = "text";
      textbox.style.fontSize = "20px";
      textbox.placeholder = option.desc;
      textbox.id = `${option.id}-text`;
      if (localStorage.getItem(option.id))
        textbox.value = localStorage.getItem(option.id);
      let br = document.createElement("br");
      if (textbox.id == "zip-code-text") {
        textbox.setAttribute("maxlength", "5");
        textbox.style.fontSize = "35px";
        label.style.width = "auto";
        zipContainer.appendChild(label);
        zipContainer.appendChild(textbox);
        zipContainer.appendChild(br);
      } else {
        advancedSettingsOptions.appendChild(label);
        advancedSettingsOptions.appendChild(textbox);
        advancedSettingsOptions.appendChild(br);
      }
      //<br>
    });
    let advancedButtonContainer = document.createElement("div");
    advancedButtonContainer.classList.add("settings-container");
    settingsPrompt.appendChild(advancedButtonContainer);
    let advancedButton = document.createElement("button");
    advancedButton.innerHTML = "Show advanced options";
    advancedButton.id = "advanced-options-text";
    advancedButton.setAttribute("onclick", "toggleAdvancedSettings()");
    advancedButton.classList.add("regular-text", "settings-input", "button");
    advancedButtonContainer.appendChild(advancedButton);
    //<button class="setting-item settings-text" id="submit-button" onclick="checkZipCode();" style="margin-bottom: 10px;">Start</button>-->
    let btn = document.createElement("button");
    btn.classList.add(
      "setting-item",
      "settings-text",
      "settings-input",
      "button"
    );
    btn.id = "submit-button";
    btn.onclick = CONFIG.submit;
    btn.style = "margin-bottom: 10px;";
    btn.appendChild(document.createTextNode("Start"));
    settingsPrompt.appendChild(btn);
    if (
      CONFIG.loop ||
      localStorage.getItem("loop") === "y" ||
      CONFIG.standbyMode
    ) {
      zipCode = getQueryVariable(`zip`);
      CONFIG.loop = true;
      hideSettings();
      CONFIG.submit();
    }
    if (getQueryVariable(`autorun`) == "true") {
      CONFIG.submit();
    }
    if (getQueryVariable("startScene") != false) {
      window.obsstudio.getCurrentScene(function (scene) {
        console.log(scene);
        if (scene == getQueryVariable("startScene")) {
          CONFIG.submit();
        }
      });
    }
  },
};

CONFIG.unitField =
  CONFIG.units === "m"
    ? "metric"
    : CONFIG.units === "h"
    ? "uk_hybrid"
    : "imperial";
