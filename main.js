
function main () {
  const defaultData = 
  {
      "name": "Pontianak",
      "lat": -0.0226903,
      "lon": 109.3447488,
      "country": "ID",
      "state": "West Kalimantan",
      "timezone": "Asia/Pontianak",
  }

// console.log("display loader:", loader)
  navbarLocation.innerHTML = `${defaultData.name}, ${defaultData.state}`
  country.innerHTML = `Country Code: <i>${defaultData.country}</i>`
  timeZoneDisplay.innerHTML = `Timezone: <i>${defaultData.timezone}</i>`

  mainController(defaultData)

  const searchForm = document.querySelector("#searchForm")
  searchForm.addEventListener("submit", async (event) => {

    event.preventDefault()

    // loader = "none"
    // console.log("submit search Form loader:", loader)
    const getValue = document.querySelector("#search").value;
    // const navbarLocation = document.querySelector("#navbarLocation")
    
    try {
      const res = await fetchLocation(getValue)
      console.log("res in main :", res)

      if(!res) {
        // return window.location.reload()
        // console.log("this is res from main.js")
        let errorDisplay = document.querySelector(".error_page")
    let errorDesc = document.querySelector("#errorDesc")

      errorDisplay.style.display = 'flex'
      errorDesc.innerHTML = `ERROR OCCURED, Please Refresh The Page`
      }

      // console.log("res location: ", res)

      navbarLocation.innerHTML = `${res.name}, ${res.state}`
      country.innerHTML = `Country Code: <i>${res.country}</i>`

      mainController(res)
      
    } catch (error) {
      console.error(error)
    } 
  })  
}

document.addEventListener("DOMContentLoaded", main)
