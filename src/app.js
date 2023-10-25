"use strict";

function getNewCity(e) {
  e.preventDefault();
  const cityInput = document.getElementById("new-city");
  const cityInputValue = cityInput.value.trim().toLowerCase();
  getApiUrl(cityInputValue);
  cityInput.value = "";
}

function getApiUrl(city, lat, long) {
  const apiKey = "97c2f6a3b34509ac62090edc5d18d949";
  let apiUrl;
  let unit = celsius ? "metric" : "imperial";
  if (city != "blank") {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}`;
  } else {
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`;
  }
  getCityData(apiUrl, apiKey);
}

function getDayTime(utcMilliseconds) {
  const currentDayTime = document.getElementById("current-day-time");
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(utcMilliseconds);
  const day = days[date.getUTCDay()];
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return (currentDayTime.textContent = `${day} · ${hours}:${minutes}`);
}

function get5Days(utcMilliseconds) {
  const date = new Date(utcMilliseconds);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[date.getUTCDay()];
  return day;
}

function getCityData(apiUrl, apiKey) {
  fetch(`${apiUrl}&appid=${apiKey}`).then((response) => {
    if (response.ok) {
      axios.get(`${apiUrl}&appid=${apiKey}`).then((find) => {
        tempCelsius = find.data.main.temp;
        let temp = Math.round(find.data.main.temp);
        let city = find.data.name;
        let humidity = find.data.main.humidity;
        let wind;
        if (celsius) {
          wind = `${Math.round(find.data.wind.speed * 3.6)}km/h`;
        } else {
          wind = `${Math.round(find.data.wind.speed)}mph`;
        }

        let description = find.data.weather[0].description;
        formatNewCity(city, temp, humidity, wind, description);
        icon = find.data.weather[0].icon;
        changeIcon(icon, description);
        getDayTime((find.data.dt + find.data.timezone) * 1000);
        getForecast(find.data.coord, apiKey);
      });
    } else {
      alert(
        "☹️ City not found. Please check you have entered a valid city and try again!"
      );
    }
  });
}

function getForecast(coord, apiKey) {
  const fiveDayCtr = document.getElementById("five-day-ctr");
  while (fiveDayCtr.firstChild) {
    fiveDayCtr.removeChild(fiveDayCtr.firstChild);
  }
  const unit = celsius ? "metric" : "imperial";
  const apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiForecastUrl).then((find) => {
    for (let i = 0; i < 5; i++) {
      const forecastCard = document.createElement("div");
      forecastCard.classList.add("col", "forecast-card");
      fiveDayCtr.append(forecastCard);
      const dayForecastDiv = document.createElement("div");
      dayForecastDiv.textContent = get5Days(
        (find.data.daily[i].dt + find.data.timezone_offset) * 1000
      );
      const iconForecast = document.createElement("img");
      iconForecast.src = `https://openweathermap.org/img/wn/${find.data.daily[i].weather[0].icon}@2x.png`;
      const descForecastDiv = document.createElement("div");
      descForecastDiv.classList.add("desc");
      let description = find.data.daily[i].weather[0].description;
      descForecastDiv.textContent = description;
      iconForecast.alt = description;
      const maxForecastDiv = document.createElement("strong");
      maxForecastDiv.classList.add("temp");
      maxForecastDiv.textContent = `${Math.round(
        find.data.daily[i].temp.max
      )}°`;
      const minForecastSpan = document.createElement("span");
      minForecastSpan.classList.add("temp");

      minForecastSpan.textContent = ` · ${Math.round(
        find.data.daily[i].temp.min
      )}°`;
      forecastCard.append(
        dayForecastDiv,
        iconForecast,
        descForecastDiv,
        maxForecastDiv,
        minForecastSpan
      );
    }
  });
}

function formatNewCity(city, temp, humidity, wind, description) {
  const currentTemp = document.getElementById("current-temp-value");
  const currentHumidity = document.getElementById("current-humidity");
  const currentWind = document.getElementById("current-wind");
  const currentDescription = document.getElementById("current-description");
  currentCityCell.textContent = city;
  currentTemp.textContent = temp;
  currentDescription.textContent =
    description.charAt(0).toUpperCase() + description.slice(1);
  currentHumidity.textContent = humidity;
  currentWind.textContent = wind;
}

function changeIcon(icon, description) {
  const currentIcon = document.getElementById("current-icon");
  currentIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  currentIcon.alt = description;
  dayNight(icon);
}

function dayNight(sky) {
  const darkLight = document.querySelectorAll(".dark-light");
  const btns = document.querySelectorAll(".btn");
  sky = sky.slice(2);
  if (sky === "n") {
    darkLight.forEach((element) => {
      element.classList.add("dark");
      element.classList.remove("light");
    });
    btns.forEach((btn) => {
      btn.classList.add("dark-btn");
    });
  } else if (sky === "d") {
    darkLight.forEach((element) => {
      element.classList.remove("dark");
      element.classList.add("light");
    });
    btns.forEach((btn) => {
      btn.classList.remove("dark-btn");
    });
  }
}

function getUserLocation() {
  navigator.geolocation.getCurrentPosition(getLatLong, error);
}

function getLatLong(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  getApiUrl("blank", lat, long);
}

function error(error) {
  if (error.code == error.PERMISSION_DENIED) {
    alert(
      "☹️ Not found! Please check location services are enabled in your browser to use this feature."
    );
  }
}

function getTempType(celsius) {
  if (celsius) {
    degreesC.classList.remove("hidden");
    degreesF.classList.add("hidden");
    getApiUrl(currentCityCell.textContent);
  } else {
    degreesF.classList.remove("hidden");
    degreesC.classList.add("hidden");
    getApiUrl(currentCityCell.textContent);
  }
}

let celsius = true;
let icon = null;
let tempCelsius = null;
const currentTempCell = document.getElementById("current-temp-value");
const currentCityCell = document.getElementById("current-city");

const degreesC = document.getElementById("degrees-c");
degreesC.addEventListener("click", (e) => {
  e.preventDefault();
  celsius = true;
  getTempType(celsius);
});

const degreesF = document.getElementById("degrees-f");
degreesF.addEventListener("click", (e) => {
  e.preventDefault();
  celsius = false;
  getTempType(celsius);
});

const userSearchForm = document.getElementById("search-cities");
userSearchForm.addEventListener("submit", (e) => {
  getNewCity(e);
});

const currentLocationBtn = document.getElementById("current-location-btn");
currentLocationBtn.addEventListener("click", () => {
  getUserLocation();
});

getApiUrl("Bordeaux");
