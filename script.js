
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const message = document.getElementById("message");

// Weather condition function
function getWeather(code) {

    if (code === 0) {
        return ["Clear Sky", "☀️"];
    }
    else if ([1, 2, 3].includes(code)) {
        return ["Partly Cloudy", "⛅"];
    }
    else if ([45, 48].includes(code)) {
        return ["Foggy", "🌫️"];
    }
    else if ([51, 53, 55, 56, 57].includes(code)) {
        return ["Drizzle", "🌦️"];
    }
    else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return ["Rainy", "🌧️"];
    }
    else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return ["Snowy", "❄️"];
    }
    else if ([95, 96, 99].includes(code)) {
        return ["Thunderstorm", "⛈️"];
    }
    else {
        return ["Unknown", "🌤️"];
    }
}

// Main weather function
async function getWeatherData(city) {

    if (city.trim() === "") {
        message.textContent = "Please enter a city name!";
        return;
    }

    message.textContent = "Loading...";
    searchBtn.disabled = true;

    try {

        // Step 1: Find city location
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Location service error");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get live weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather service error");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Step 3: Get weather condition
        const result = getWeather(current.weather_code);

        // Step 4: Display data
        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${Math.round(current.temperature_2m)}°C`;

        condition.textContent = result[0];

        weatherIcon.textContent = result[1];

        humidity.textContent =
            `${current.relative_humidity_2m}%`;

        wind.textContent =
            `${current.wind_speed_10m} km/h`;

        message.textContent = "";

    }
    catch (error) {

        message.textContent = error.message === "City not found!"
            ? "City not found! Try another city."
            : "Something went wrong. Please try again.";

    }
    finally {
        searchBtn.disabled = false;
    }
}

// Search button event
searchBtn.addEventListener("click", function() {
    getWeatherData(cityInput.value);
});

// Enter key event
cityInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        getWeatherData(cityInput.value);
    }
});

// Default city
getWeatherData("Lucknow");
