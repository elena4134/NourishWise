let hungerData = {};

fetch('hungerData.json')
  .then(response => response.json())
  .then(data => {
    hungerData = data;

    // 
    initCountryClickEvents(); // a function that attaches all your event listeners
  })
  .catch(err => console.error("Failed to load hungerData.json", err));

  function initCountryClickEvents() {
    countries.forEach(country => {
      country.addEventListener("click", function (e) {
        const clickedCountry = e.target.getAttribute("name");
  
        const info = hungerData[clickedCountry];
        if (!info) {
          // fallback to restcountries API
          fetch(`https://restcountries.com/v3.1/name/${clickedCountry}?fullText=true`)
            .then(response => response.json())
            .then(data => {
              setTimeout(() => {
                countryNameOutput.innerText = data[0].name.common;
                countryFlagOutput.src = data[0].flags.png;
                hungerOutput.innerHTML = data[0].capital ? `Capital: ${data[0].capital[0]}` : "No capital found";
                deathsOutput.innerText = `Est. population: ${data[0].population.toLocaleString()}`;
                container.classList.remove("hide");
                loading.innerText = "";
              }, 300);
            })
            .catch(err => {
              loading.innerText = "No data available.";
              console.error(err);
            });
          return;
        }        
  
        countryNameOutput.innerText = clickedCountry;
        countryFlagOutput.src = info.flag;
        hungerOutput.innerHTML = info.stats.map(line => `• ${line}`).join("<br>");
        sidePanel.classList.add("side-panel-open");
      });
    });
  }   

// Scroll count animation
const counter = document.getElementById("hungerCount");
let count = 0;
const target = 130948;

window.addEventListener("scroll", () => {
  const statsTop = counter.getBoundingClientRect().top;
  if (statsTop < window.innerHeight && count === 0) {
    const interval = setInterval(() => {
      count += Math.floor(target / 100);
      counter.innerText = count.toLocaleString();
      if (count >= target) {
        counter.innerText = target.toLocaleString();
        clearInterval(interval);
      }
    }, 30);
  }
});

// Slideshow for Nutritional Guide
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".nutri-btn");
    const slides = document.querySelectorAll(".slide");
  
    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        // Remove active from all
        buttons.forEach(b => b.classList.remove("active"));
        slides.forEach(s => s.classList.remove("active"));
  
        // Activate current
        btn.classList.add("active");
        slides[index].classList.add("active");
      });
    });
  });
  
//map
//get needed element rom the DOM
// FIX: typo, incorrect selectors
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const hungerOutput = document.querySelector(".hunger");
const deathsOutput = document.querySelector(".deaths");

// FIX: country hover/fill logic
countries.forEach(country => {
  country.addEventListener("mouseenter", function() {
    const classList = [...this.classList].join('.');
    const selector = '.' + classList;
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = "#c99aff");
  });

  country.addEventListener("mouseout", function() {
    const classList = [...this.classList].join('.');
    const selector = '.' + classList;
    const matchingElements = document.querySelectorAll(selector);
    matchingElements.forEach(el => el.style.fill = "#443d4b");
  });

  country.addEventListener("click", function(e) {
    loading.innerText = "Loading...";
    container.classList.add("hide");
    let clickedCountryName = e.target.getAttribute("name") || e.target.classList.value;

    sidePanel.classList.add("side-panel-open");

    // FIX: string template
    fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setTimeout(() => {
          countryNameOutput.innerText = clickedCountry;
          countryFlagOutput.src = info.flag || "";
          
          // Find the <li> items and fill them
          const liItems = container.querySelectorAll("li");
          
          // Hunger info
          if (liItems[0]) {
            liItems[0].querySelector(".hunger").innerText = info.hunger || "No hunger info.";
          }
          
          // Deaths from hunger
          if (liItems[1]) {
            liItems[1].querySelector(".deaths").innerText = info.deaths || "No data on deaths.";
          }
          
          // Access to nutritious food (we'll just replace the text content)
          if (liItems[2]) {
            const plainSpan = liItems[2].querySelector("span:not(.hunger):not(.deaths)");
            if (plainSpan) {
              plainSpan.innerText = info.access || "No data on access to nutritious food.";
            }
          }
          
          // Add population and starved people somewhere too
          deathsOutput.innerText = `Est. population: ${parseInt(info.population).toLocaleString()}`;
          hungerOutput.innerText = `Starved people: ${parseInt(info.starved).toLocaleString()}`;
        }, 500);
      })
      .catch(err => {
        loading.innerText = "Could not load data.";
        console.error(err);
      });
  });

  closeBtn.addEventListener("click", () => {
    sidePanel.classList.remove("side-panel-open");
  });
});

// Zoom 
let zoomValue = 100;
zoomOutBtn.disabled = true;

zoomInBtn.addEventListener("click", () => {
  zoomValue += 20;
  map.setAttribute("width", `${zoomValue}%`);
  map.setAttribute("height", `${zoomValue}%`);
  zoomValueOutput.innerText = `${zoomValue}%`;
  zoomOutBtn.disabled = false;
  if (zoomValue >= 200) zoomInBtn.disabled = true;
});

zoomOutBtn.addEventListener("click", () => {
  zoomValue -= 20;
  map.setAttribute("width", `${zoomValue}%`);
  map.setAttribute("height", `${zoomValue}%`);
  zoomValueOutput.innerText = `${zoomValue}%`;
  zoomInBtn.disabled = false;
  if (zoomValue <= 100) zoomOutBtn.disabled = true;
});

document.addEventListener("click", function (e) {
  const isClickInside = sidePanel.contains(e.target);
  const isMapClick = map.contains(e.target);
  if (!isClickInside && !isMapClick) {
    sidePanel.classList.remove("side-panel-open");
  }
});

/*const countryInfo = {
  Niger: "🍽️ 1.7 million people are food insecure.<br>👶 45% of children under 4 are malnourished.",
  Ethiopia: "🌾 20 million people need food assistance.<br>🌦️ Drought is severe."
};

panel.innerHTML = countryInfo[countryName] || "No data available.";*/

countryNameOutput.innerText = clickedCountry;
countryFlagOutput.src = info.flag || "";

const liElements = container.querySelectorAll("li");

if (liElements[0]) {
  liElements[0].querySelector(".hunger").innerText = info.hunger || "No hunger info.";
}
if (liElements[1]) {
  liElements[1].querySelector(".deaths").innerText = info.deaths || "No death info.";
}
if (liElements[2]) {
  const accessSpan = liElements[2].querySelector("span");
  if (accessSpan && accessSpan.className === "") {
    accessSpan.innerText = info.access || "No access data.";
  }
}

//map info box interact
const pins = document.querySelectorAll(".pin");
const infoBox = document.querySelector(".region-info-box");
const closeRegion = document.querySelector(".close-region");

const regionName = document.querySelector(".region-name");
const regionHunger = document.querySelector(".region-hunger");
const regionDeaths = document.querySelector(".region-deaths");
const regionAccess = document.querySelector(".region-access");

pins.forEach(pin => {
  pin.addEventListener("click", () => {
    const key = pin.classList[1]; // e.g., 'usa', 'france'

    const data = hungerRegionData[key];
    if (data) {
      regionName.innerText = data.name;
      regionHunger.innerText = data.hunger;
      regionDeaths.innerText = data.deaths;
      regionAccess.innerText = data.access;

      infoBox.classList.remove("hidden");
    }
  });
});

closeRegion.addEventListener("click", () => {
  infoBox.classList.add("hidden");
});
