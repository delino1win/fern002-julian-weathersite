const API_KEY = "95d7bf4716c1776336210c7f3faf9940";

// function error () {

//   document.querySelector("#search").innerHTML = ''
//   return window.location.reload()
// }


let navbarLocation = document.querySelector("#navbarLocation")
let country = document.querySelector("#country")
let timeZoneDisplay = document.querySelector("#timezone")

async function fetchLocation (location) {

  try {
    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`)
    
    if(!res.ok) {
      // alert("fail to fetch location")
      console.error(res.status)
    }

    // console.log("res is ok")

    const locationData = await res.json()
    // console.log("locationData : ", locationData[0].name, locationData[0].state)

    const {name, lat, lon, country, state} = await locationData[0]

    const objLocation = {
      name,
      lat,
      lon,
      country,
      state
    }

    if(!state) {
      objLocation.state = ''
    } else if(!country) {
      objLocation.country = ''
    }

    // console.log(objLocation)
    return objLocation

  } catch (error) {
    console.error(error)
    // return window.location.reload();   
  }
}


async function mainController(location) {
  // console.log(loader.style.display)
    let loader = document.querySelector("#loading").style
    loader.display = "block"
    // console.log("submit search Form loader:", loader.display)
  const pontianak = {
    name: "Pontianak",
    lat: 0.061651,
    lon: 111.4828467,
    country: "ID",
    state: "West Kalimantan",
  };

  if (!location) {
    location = { ...pontianak };
  }

  try {
    const getCurrWeather = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`
    );

    const getWeatherOverview = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall/overview?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
    );

    console.log("passing main control")

    if (!getCurrWeather.ok) {
      alert("fail fetch data");
      console.error(getCurrWeather.status);
      // return window.location.reload();

    }

    if (!getWeatherOverview.ok) {
      alert("fail fetch Overview");
      console.error(getWeatherOverview.status);
      // return window.location.reload();
    }

    const weatherCurr = await getCurrWeather.json();
    const weatherOverview = await getWeatherOverview.json();

    console.log("weatherData: ", weatherCurr);

    await displayData(weatherCurr, weatherOverview);

  } catch (error) {
    console.error(error);
    return window.location.reload()
  } finally {
    // const redefineLoader = document.getElementById("loading").style.display = 'none'
    // console.log("finally loader state:", redefineLoader)

    loader.display = 'none'
  }
}

// function searchCity () {}


async function displayData(data, overview) {
  
  try {
    // console.log("displayData: ", data);

    const {
      dt,
      weather,
      temp,
      humidity,
      uvi,
      clouds,
      feels_like,
      wind_speed,
      wind_deg,
      wind_gust,
    } = await data.current;


    // console.log("wind_gust :", wind_gust)

    const {timezone, hourly, daily } = await data;

    const { weather_overview } = await overview;
    // console.log(hourly)


    const currDt = document.querySelector("#date");
    const currTitle = document.querySelector("#title");
    const currDesc = document.querySelector("#desc");
    const currWeatherIcon = document.querySelector("#weather_icon");
    const currTemp = document.querySelector("#temp");
    const currClouds = document.querySelector("#clouds");
    const currUvi = document.querySelector("#uvi");
    const currFeelsLike = document.querySelector("#feelsLike");
    const currHum = document.querySelector("#humidity");
    const currWindSpeed = document.querySelector("#windSpeed");
    const currWindDirection = document.querySelector("#windDirection");
    const currWindGust = document.querySelector("#windGust");

    const weatherDesc = document.querySelector("#weather_desc");

    
    timeZoneDisplay.innerHTML = `Time zone: <i>${timezone}</i>`
    currTitle.innerHTML = weather[0].main;
    currDesc.innerHTML = weather[0].description;
    currWeatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    currTemp.innerHTML = temp + "&#xb0" + " C";
    currClouds.innerHTML = clouds + "%"
    currUvi.innerHTML = uvi;
    currFeelsLike.innerHTML = feels_like + "&#xb0" + " C";
    currHum.innerHTML = humidity + "%";
    currWindSpeed.innerHTML = "<i>speed</i> " + wind_speed + " metre/sec";
    currWindGust.innerHTML = "<i>gust</i> " + wind_gust + " metre/sec";
    currWindDirection.innerHTML = wind_deg + "&#xb0";

    const convertCurrTime = convertUnixTime(dt, timezone)
    // console.log("convertCurrTime")
    const dailyData = await dailyForecast(daily, timezone);
    const hourlyData = await hourlyForecast(hourly, timezone);
    // console.log(hourlyData)

    const dailyList = document.querySelector(".daily_summaries")
    const hourlyList = document.querySelector(".hourly_summaries");

    dailyData.shift()
    dailyList.innerHTML = dailyData.map((item) => item);
    dailyList.innerHTML = dailyList.innerHTML.replace(/,/g, "");

    currDt.innerHTML = convertCurrTime
    hourlyList.innerHTML = hourlyData.map((item) => item);
    hourlyList.innerHTML = hourlyList.innerHTML.replace(/,/g, "");

    weatherDesc.innerHTML = weather_overview;

    if(!wind_gust) {  
      currWindGust.innerHTML = "Uncalibrated"
    }

    return (
      timeZoneDisplay.innerHTML,
      currDt.innerHTML,
      currTitle.innerHTML,
      currDesc.innerHTML,
      currWeatherIcon.src,
      currTemp.innerHTML,
      currHum.innerHTML,
      currWindSpeed.innerHTML,
      currWindDirection.innerHTML,
      currWindGust.innerHTML,
      hourlyList.innerHTML,
      weatherDesc.innerHTML
    );
  } catch (error) {
    console.error(error);
  }
}

async function dailyForecast(dailyData, timezone) {
  const dailyList = [...dailyData];

  const dailyDetail = dailyList.map((obj) => {
    let timeConverter = convertDailyUnix(obj.dt, timezone);
    return `
      <div class="daily_card">
        <div id="dailyDate">
          ${timeConverter}
        </div>
        <div id="dailyIcon">
          <img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png" alt="">
        </div>
        <div id="dailyTemp">
          <div class="temp_indicator"><div style="background-color: yellow;" class="sun"></div>${obj.temp.morn} &#xb0 C</div>
          <div class="temp_indicator"><div style="background-color: rgb(255, 255, 177); box-shadow: 0 0 5px white;" class="sun"></div>${obj.temp.day} &#xb0 C</div>
          <div class="temp_indicator"><div style="background-color: black" class="sun"></div>${obj.temp.night} &#xb0 C</div>
        </div>
      </div>
    `;
  });

  return dailyDetail
}

async function hourlyForecast(hourlyData, timezone) {
  
  try {
    const hourlyList = [...hourlyData];
    console.log(hourlyList);
    const hourlyDetail = hourlyList.map((obj) => {
      // console.log(obj.dt)
      let timeConverter = convertUnixTime(obj.dt, timezone);
      return `
        <div class="hourly_detail">
           <div id="hourlyClock">
             ${timeConverter}
           </div>
           <div id="hourlyIcon">
             <img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png" alt="">
           </div>
           <div id="hourlyTemp">
             ${obj.temp} &#xb0 C
           </div>
         </div>
      `;
    });

    // document.querySelector(".hourly_summaries").innerHTML = hourlyDetail
    // console.log(hourlyDetail)
    return hourlyDetail;
  } catch (error) {
    console.error(error);
  }
}

function convertDailyUnix(dt, timezone) {
  const date = new Date(dt * 1000);
  const options = {
    weekday: "short",
    month: "long",
    day: "numeric",
    timeZone: timezone
  };

  const time = date.toLocaleString("en-US", options);

  return time;
}

function convertUnixTime(dt, timezone) {
  const date = new Date(dt * 1000);
  const options = {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
    hour12: true,
  };

  const time = date.toLocaleString("en-US", options);

  return time;
}
