"use strict";

function getNewCity(e) {
  e.preventDefault();
  let cityInput = document.getElementById("new-city");
  let cityInputValue = cityInput.value.trim().toLowerCase();
  getApiUrl(cityInputValue);
  cityInput.value = "";
}

function getApiUrl(city, lat, long) {
  let apiKey = "97c2f6a3b34509ac62090edc5d18d949";
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
  let currentDayTime = document.getElementById("current-day-time");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let date = new Date(utcMilliseconds);
  let day = days[date.getUTCDay()];
  let hours = String(date.getUTCHours()).padStart(2, "0");
  let minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return (currentDayTime.textContent = `${day} · ${hours}:${minutes}`);
}

function get5Days(utcMilliseconds) {
  let date = new Date(utcMilliseconds);
  console.log(date);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getUTCDay()];
  return day;
}

function getCityData(apiUrl, apiKey) {
  fetch(`${apiUrl}&appid=${apiKey}`).then((response) => {
    if (response.ok) {
      axios.get(`${apiUrl}&appid=${apiKey}`).then((find) => {
        console.log(find);
        tempCelsius = find.data.main.temp;
        // getTempType(celsius);
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
        getForecast(find.data.coord);
      });
    } else {
      alert(
        "☹️ City not found. Please check you have entered a valid city and try again!"
      );
    }
  });
}

function getForecast(coord) {
  console.log(coord);
  let apiKey = "97c2f6a3b34509ac62090edc5d18d949";
  const fiveDayCtr = document.getElementById("five-day-ctr");
  while (fiveDayCtr.firstChild) {
    fiveDayCtr.removeChild(fiveDayCtr.firstChild);
  }
  const unit = celsius ? "metric" : "imperial";
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=${unit}`;
  console.log(apiForecastUrl);
  axios.get(apiForecastUrl).then((find) => {
    console.log(find);
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
      descForecastDiv.textContent = find.data.daily[i].weather[0].description;
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
  let currentTemp = document.getElementById("current-temp-value");
  let currentHumidity = document.getElementById("current-humidity");
  let currentWind = document.getElementById("current-wind");
  let currentDescription = document.getElementById("current-description");
  currentCityCell.textContent = city;
  currentTemp.textContent = temp;
  currentDescription.textContent =
    description.charAt(0).toUpperCase() + description.slice(1);
  currentHumidity.textContent = humidity;
  currentWind.textContent = wind;
}

function changeIcon(icon, description) {
  let currentIcon = document.getElementById("current-icon");
  currentIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  currentIcon.alt = description;
  dayNight(icon);
}

function dayNight(sky) {
  let darkLight = document.querySelectorAll(".dark-light");
  let btns = document.querySelectorAll(".btn");
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
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
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
    // currentTempCell.innerText = Math.round(tempCelsius);
  } else {
    degreesF.classList.remove("hidden");
    degreesC.classList.add("hidden");
    getApiUrl(currentCityCell.textContent);
    // currentTempCell.innerText = Math.round((tempCelsius * 9) / 5 + 32);
  }
}

let currentCityCell = document.getElementById("current-city");
let celsius = true;
let icon = null;
let tempCelsius = null;
let currentTempCell = document.getElementById("current-temp-value");

let degreesC = document.getElementById("degrees-c");
degreesC.addEventListener("click", (e) => {
  e.preventDefault();
  celsius = true;
  getTempType(celsius);
});

let degreesF = document.getElementById("degrees-f");
degreesF.addEventListener("click", (e) => {
  e.preventDefault();
  celsius = false;
  getTempType(celsius);
});

let userSearchForm = document.getElementById("search-cities");
userSearchForm.addEventListener("submit", (e) => {
  getNewCity(e);
});

let currentLocationBtn = document.getElementById("current-location-btn");
currentLocationBtn.addEventListener("click", () => {
  getUserLocation();
});

getApiUrl("Bordeaux");

function createForecast() {}

createForecast();

// function Forecast(day, icon, description, tempMin, tempMax) {
//   return {
//     day,
//     icon,
//     description,
//     tempMin
//     tempMax
//   }
// }

// const getForecast = []
