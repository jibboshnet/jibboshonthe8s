// ===============================
// REQUIRED GLOBAL VARIABLES
// ===============================

// Location
let latitude;
let longitude;
let cityName = "";

// Current conditions
let currentTemperature;
let currentCondition;
let windSpeed;
let gusts;
let feelsLike;
let visibility;
let humidity;
let dewPoint;
let pressure;
let pressureTrend;
let currentIcon;

// Forecast + outlook ARRAYS (THIS FIXES YOUR ERROR)
let forecastTemp = [];
let forecastIcon = [];
let forecastNarrative = [];
let forecastPrecip = [];

let outlookHigh = [];
let outlookLow = [];
let outlookCondition = [];
let outlookIcon = [];

// Alerts
let alerts = [];
let alertsActive = false;

// Radar
let radarImage;
let zoomedRadarImage;

// ===============================
// ZIP GUESS (DISABLED)
// ===============================

function guessZipCode() {
  // Disabled — AIRPORT mode only
  return;
}

// ===============================
// ALERTS
// ===============================

function fetchAlerts() {
  var alertCrawl = "";
  alerts = [];

  const url = `https://api.weather.com/v3/alerts/headlines?geocode=${latitude},${longitude}&format=json&language=en-US&apiKey=${CONFIG.secrets.twcAPIKey}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        console.warn("TWC Alerts Error, no alerts will be shown");
        fetchForecast();
        return;
      }
      return response.json();
    })
    .then(data => {
      if (!data || !data.alerts || data.alerts.length === 0) {
        fetchForecast();
        return;
      }

      if (data.alerts.length === 1) {
        alerts[0] =
          data.alerts[0].eventDescription +
          "<br>" +
          (data.alerts[0].headlineText || "");
        alertCrawl += " " + (data.alerts[0].detailText || "");
      } else {
        for (let i = 0; i < data.alerts.length; i++) {
          alerts[i] = data.alerts[i].eventDescription;
          alertCrawl += " " + (data.alerts[i].detailText || "");
        }
      }

      if (alertCrawl !== "") {
        CONFIG.crawl = alertCrawl.replace(/\*/g, "").replace(/\.\.\./g, " ");
      }

      alertsActive = alerts.length > 0;
      fetchForecast();
    })
    .catch(err => {
      console.warn("TWC Alerts Fetch Failed:", err);
      fetchForecast();
    });
}

// ===============================
// FORECAST
// ===============================

function fetchForecast() {
  fetch(`https://api.weather.com/v1/geocode/${latitude}/${longitude}/forecast/daily/10day.json?language=${CONFIG.language}&units=${CONFIG.units}&apiKey=${CONFIG.secrets.twcAPIKey}`)
    .then(response => {
      if (!response.ok) {
        console.log("forecast request error");
        return;
      }
      return response.json();
    })
    .then(data => {
      let forecasts = data.forecasts;

      isDay = forecasts[0].day;

      let ns = [];
      ns.push(forecasts[0].day || forecasts[0].night);
      ns.push(forecasts[0].night);
      ns.push(forecasts[1].day);
      ns.push(forecasts[1].night);

      for (let i = 0; i <= 3; i++) {
        let n = ns[i];
        forecastTemp[i] = n.temp;
        forecastIcon[i] = n.icon_code;
        forecastNarrative[i] = n.narrative;
        forecastPrecip[i] =
          `${n.pop}% Chance<br/> of ${n.precip_type.charAt(0).toUpperCase() + n.precip_type.substr(1).toLowerCase()}`;
      }

      for (let i = 0; i < 7; i++) {
        let fc = forecasts[i + 1];
        outlookHigh[i] = fc.max_temp;
        outlookLow[i] = fc.min_temp;
        outlookCondition[i] =
          (fc.day ? fc.day : fc.night).phrase_32char
            .split(" ")
            .join("<br/>")
            .replace("Thunderstorm", "Thunder</br>storm");
        outlookIcon[i] = (fc.day ? fc.day : fc.night).icon_code;
      }

      fetchRadarImages();
    });
}

// ===============================
// CURRENT CONDITIONS (AIRPORT)
// ===============================

function fetchCurrentWeather() {
  let location = "";

  if (CONFIG.locationMode === "AIRPORT") {
    let len = airportCode.length;
    if (len === 3) location = `iataCode=${airportCode}`;
    else if (len === 4) location = `icaoCode=${airportCode}`;
    else {
      alert("Invalid airport code");
      return;
    }
  } else {
    alert("AIRPORT mode required");
    return;
  }

  fetch(`https://api.weather.com/v3/location/point?${location}&language=${CONFIG.language}&format=json&apiKey=${CONFIG.secrets.twcAPIKey}`)
    .then(response => {
      if (!response.ok) {
        alert("Location not found");
        return;
      }
      return response.json();
    })
    .then(data => {
      cityName = airportDisplayName.toUpperCase();
      latitude = data.location.latitude;
      longitude = data.location.longitude;

      return fetch(`https://api.weather.com/v1/geocode/${latitude}/${longitude}/observations/current.json?language=${CONFIG.language}&units=${CONFIG.units}&apiKey=${CONFIG.secrets.twcAPIKey}`);
    })
    .then(response => response.json())
    .then(data => {
      let unit = data.observation[CONFIG.unitField];

      currentTemperature = Math.round(unit.temp);
      currentCondition = data.observation.phrase_32char;
      windSpeed = `${data.observation.wdir_cardinal} ${unit.wspd} ${CONFIG.units === 'm' ? 'km/h' : 'mph'}`;
      gusts = unit.gust || "NONE";
      feelsLike = unit.feels_like;
      visibility = Math.round(unit.vis);
      humidity = unit.rh;
      dewPoint = unit.dewpt;
      pressure = unit.altimeter.toPrecision(4);
      pressureTrend = data.observation.ptend_code == 1 || data.observation.ptend_code == 3 ? "▲" :
                      data.observation.ptend_code == 0 ? "" : "▼";
      currentIcon = data.observation.icon_code;

      fetchAlerts();
    });
}

// ===============================
// RADAR
// ===============================

function fetchRadarImages() {
  radarImage = document.createElement("iframe");
  radarImage.src = "https://kaosfactor.github.io/radar/radar.html";
  radarImage.style.width = "1239px";
  radarImage.style.height = "1200px";
  radarImage.style.marginTop = "-670px";
  radarImage.style.overflow = "hidden";

  if (alertsActive) {
    zoomedRadarImage = document.createElement("iframe");
    zoomedRadarImage.src = "https://kaosfactor.github.io/radar/radar1.html";
    zoomedRadarImage.style.width = "1239px";
    zoomedRadarImage.style.height = "1200px";
    zoomedRadarImage.style.marginTop = "-370px";
    zoomedRadarImage.style.overflow = "hidden";
  }

  scheduleTimeline();
}
