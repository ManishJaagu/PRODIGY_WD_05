/* variables for different parameters/tools in the webpage*/ 
let cityInput = document.getElementById('city-input'),
    searchBtn = document.getElementById('search-btn'),
    locationBtn = document.getElementById('location-btn'),
    api_key = '[Your API KEY]',
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDayForecastCard = document.querySelectorAll('.day-forecast')[0],
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windSpeedVal = document.getElementById('windSpeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast'),
    aqi_list = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

// Fetch weather details using city coordinates
//LEFT SECTION - days forecast
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
        AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
        days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];


    // Fetch current weather data
    //LEFT SECTION - current weather
    fetch(WEATHER_API_URL)
        .then(res => res.json())
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                        <div class="weather-icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weatherIcon">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="fa-regular fa-calendar" style="padding-right: 12px"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot" style="padding-right: 12px"></i>${name}, ${country}</p>
                </div>
            `;

// Fetch Air Pollution details using city coordinates
//RIGHT SECTION - AIR POLLUTION details
        fetch(AIR_POLLUTION_API_URL)
        .then(res => res.json())
        .then(data => {
            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            aqiCard.innerHTML = `
                <div class="card-head">
                    <p>Air Quality index</p>
                    <p class="air-index aqi-${data.list[0].main.aqi}">${aqi_list[data.list[0].main.aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fa-solid fa-wind fa-3x"></i>
                    <div class="item">
                        <p>PM2.5</p>
                        <h2>${pm2_5}</h2>
                    </div>
                    <div class="item">
                        <p>PM10</p>
                        <h2>${pm10}</h2>
                    </div>
                    <div class="item">
                        <p>SO2</p>
                        <h2>${so2}</h2>
                    </div>
                    <div class="item">
                        <p>CO</p>
                        <h2>${co}</h2>
                    </div>
                    <div class="item">
                        <p>NO</p>
                        <h2>${no}</h2>
                    </div>
                    <div class="item">
                        <p>NO2</p>
                        <h2>${no2}</h2>
                    </div>
                    <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                    </div>
                    <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                    </div>
                </div>
            `;
        })
        .catch(() => {
            alert('Failed to fetch Air Quality Index');
        });

 // Fetch Sunrise Sunset details using city coordinates
            let { sunrise, sunset } = data.sys,
            { timezone, visibility } = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
            
            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon">
                            <img src="icons/sunrise.png" alt="sunrise">
                            <div class="desc">
                                <p>Sunrise</p>
                                <h2>${sRiseTime}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <img src="icons/sunset.png" alt="sunset">
                            <div class="desc">
                                <p>Sunset</p>
                                <h2>${sSetTime}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            `;// Fetch weather details using city coordinates
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${visibility / 1000}km`;
            windSpeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(() => {
            alert('Failed to fetch current weather');
        });

    // Fetch weather forecast data
    //BOTH SECTIONs - FORECAST data
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = '';
            for(i = 0; i <= 7; i++){
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if(hr < 12) a = 'AM';
                if(hr == 0) hr = 12;
                if(hr > 12) hr = hr - 12;
                hourlyForecastCard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                </div>
                `
            }

            let uniqueForecastDays = [];
            let fiveDayForecasts = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            fiveDayForecastCard.innerHTML = '';
            for (let i = 1; i < fiveDayForecasts.length; i++) {  // Fixed loop index to start from 0
                let date = new Date(fiveDayForecasts[i].dt_txt);
                fiveDayForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${fiveDayForecasts[i].weather[0].icon}.png" alt="icon-wrapper">
                            <span>${(fiveDayForecasts[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>  <!-- Fixed to use the correct day of the week -->
                    </div>
                `;
            }
        })
        .catch(() => {
            alert('Failed to fetch weather forecast');
        });
}

// Get city coordinates based on the city name
//HEADER - city coordinates
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
}

// Get city coordinates based on the location
//HEADER - location
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
        position => {
            let { latitude, longitude } = position.coords;
            let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

            fetch(REVERSE_GEOCODING_URL)
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        let { name, country, state } = data[0];
                        getWeatherDetails(name, latitude, longitude, country, state);
                    } else {
                        alert('Failed to retrieve location details.');
                    }
                })
                .catch(() => {
                    alert('Failed to fetch user coordinates.');
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation permission denied. Please reset location permission to grant access again.');
            } else {
                alert('Failed to retrieve location. Please try again.');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}



//button eventListeners
searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);
