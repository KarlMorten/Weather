import { ICON_MAP } from "./iconMap"
import "./style.css"
import { getWeather } from "./weather"
import { DAYNAME_MAP } from "./dayMap"

navigator.geolocation.getCurrentPosition(positionSuccess,positionError)


function positionSuccess({coords}){
  getWeather(coords.latitude,coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather).catch(err =>{
    console.error(err)
    alert("Error getting weather")
  })
}

function positionError(){
  alert("There was an error getting your location. Please allows us to use your location and refresh the page")
}

function renderWeather({current,daily,hourly}){
  renderCurrentWeather(current)
  renderDailyWeather(daily)
  renderHourlyWeather(hourly)
  document.body.classList.remove("blurred")
}

function setValue(selector, value, { parent=document } = {}){
  document.querySelector(`[data-${selector}]`).textContent = value
}

function getIconUrl(iconCode){
  return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const currentIcon = document.querySelector("[data-current-icon]")

function renderCurrentWeather(current){
  currentIcon.src = getIconUrl(current.iconCode)
  setValue("current-temp",current.currentTemp)
  setValue("current-high",current.highTemp)
  setValue("current-fl-high",current.highFeelsLike)
  setValue("current-wind",current.windSpeed)
  setValue("current-low",current.lowTemp)
  setValue("current-fl-low",current.lowFeelsLike)
  setValue("current-precip",current.precip)
}

function translateToDay(timestamp){
  let dayText = Intl.DateTimeFormat(undefined,{weekday: "long"}).format(timestamp);
  dayText = DAYNAME_MAP.get(`${dayText}`);
  return dayText
}

function translateToTime(timestamp){
  let timeText = Intl.DateTimeFormat(undefined,{hour: "numeric", minute: "numeric"}).format(timestamp);
  return timeText
}

function makeDayCard(dayInfo) {
  let html1 = `<div class="day-card">
            <img src=${getIconUrl(dayInfo.iconCode)} class="Weather-icon" />
            <div class="day-card-day">${translateToDay(dayInfo.timestamp)}</div>
            <div>${dayInfo.maxTemp}&deg;</div>
          </div>`
  return html1;       
}

function renderDailyWeather(daily) {
  let html = "";
  daily.forEach(day => {
    html += makeDayCard(day);
  })
  document.getElementById("day-section-cards").innerHTML = html;
}

function dayAndTime(timestamp){
  let html2 = ""
  html2 += `<td><div class="info-group"><div class="label">${translateToDay(timestamp)}</div><div>${translateToTime(timestamp)}</div></div></td>`
  return html2
}

function makeRowElement(displayText,unit,object){
  let html3 = ""
  html3 += `<td><div class="info-group"><div class="label">${displayText}</div><div>${object}${unit}</div></div></td>`
  return html3
}

function makeTableRow(hourData){
  let html1 = ""
  html1 += dayAndTime(hourData.timestamp)
  html1 += `<td><img src=${getIconUrl(hourData.iconCode)} class="weather-icon" /></td>`
  html1 += makeRowElement("TEMP","&deg;",hourData.temp)
  html1 += makeRowElement("KJENNEST SOM","&deg;",hourData.feelsLike)
  html1 += makeRowElement("VIND"," m/s",hourData.windSpeed)
  html1 += makeRowElement("NEDBØR"," mm",hourData.precip)
  return `<tr class="hour-row">${html1}</tr>`
}


function renderHourlyWeather(hourly){
let html = ""
hourly.forEach(hour => {
  html += makeTableRow(hour);
})
document.getElementById("weather-rows").innerHTML = `<tbody data-hour-section>${html}</tbody>`;
}