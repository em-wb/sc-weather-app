"use strict";

const displayAppData = (() => {
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
    if (city != "blank") {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
    } else {
      apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`;
    }
    getCityData(apiUrl, apiKey);
  }

  function getCityData(apiUrl, apiKey) {
    fetch(`${apiUrl}&appid=${apiKey}`).then((response) => {
      if (response.ok) {
        axios.get(`${apiUrl}&appid=${apiKey}`).then((find) => {
          console.log(find);
          let temp = Math.round(find.data.main.temp);
          let city = find.data.name;
          let humidity = find.data.main.humidity;
          let wind = Math.round(find.data.wind.speed);
          let description = find.data.weather[0].description;
          formatNewCity(city, temp, humidity, wind, description);
          changeIcon(description);
        });
      } else {
        alert(
          "☹️ City not found. Please check you have entered a valid city and try again!"
        );
      }
    });
  }

  function formatNewCity(city, temp, humidity, wind, description) {
    let currentCityCell = document.getElementById("current-city");
    let currentTempCell = document.getElementById("current-temp-value");
    let currentHumidity = document.getElementById("current-humidity");
    let currentWind = document.getElementById("current-wind");
    let currentDescription = document.getElementById("current-description");
    currentCityCell.textContent = city;
    currentTempCell.textContent = temp;
    currentDescription.textContent = description;
    currentHumidity.textContent = humidity;
    currentWind.textContent = wind;
  }

  function changeIcon(description) {
    let currentIcon = document.getElementById("current-icon");
    currentIcon.classList.remove(...currentIcon.classList);
    currentIcon.classList.add("fa-solid");
    currentIcon.classList.add("current-icon");
    if (description.includes("rain")) {
      currentIcon.classList.add("fa-cloud-showers-heavy");
    } else if (description.includes("cloud") && !description.includes("rain")) {
      currentIcon.classList.add("fa-cloud-sun");
    } else if (
      !description.includes("cloud") &&
      (description.includes("sun") || description.includes("clear"))
    ) {
      currentIcon.classList.add("fa-sun");
    } else {
      currentIcon.classList.add("fa-temperature-half");
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

  getApiUrl("Bordeaux");

  let userSearchForm = document.getElementById("search-cities");
  userSearchForm.addEventListener("submit", (e) => {
    getNewCity(e);
  });

  let currentLocationBtn = document.getElementById("current-location-btn");
  currentLocationBtn.addEventListener("click", () => {
    getUserLocation();
  });
})();

const displayDayTime = (() => {
  function getDayTime(now) {
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
    let day = days[now.getDay()];
    let hour = now.getHours();
    let minutes = now.getMinutes();

    if (hour < 10) {
      hour = `0${hour}`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return (currentDayTime.textContent = `${day} · ${hour}:${minutes}`);
  }

  let now = new Date();
  getDayTime(now);
})();
