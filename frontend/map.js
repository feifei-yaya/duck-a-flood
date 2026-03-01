document.addEventListener("DOMContentLoaded", async function () {
  const map = L.map('map').setView([32.5, -83.5], 7); // centered on Georgia

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // City coordinates — dict generated from Claude, Google Maps verified 
  const cityData = [
    {name:"Houston", lat:29.7604, lng:-95.3698, risk:0.82},
    {name:"New Orleans", lat:29.9511, lng:-90.0715, risk:0.67},
    {name:"Miami", lat:25.7617, lng:-80.1918, risk:0.41},
    {name:"Atlanta", lat:33.7490, lng:-84.3880, risk:0.33}
  ];

<<<<<<< HEAD
  // Sort by risk descending
  cityData.sort((a,b) => b.risk - a.risk);
=======
  // List of Georgia cities
  const cities = ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'St. Simons', 'Macon', 'Albany', 'Athens', 'Roswell'];
>>>>>>> 79b4b98c5f46400ce5d8630cbc0aef2a4ee8f619

  // Functions for category & color
  function getRiskCategory(risk){
    if(risk > 0.7) return "high";
    if(risk > 0.4) return "medium";
    return "low";
  }

  function getRiskColor(risk) {
    if (risk > 0.65) return "#ef4444";
    if (risk > 0.35) return "#f59e0b";
    return "#10b981";
  }

  // Fetch risk score from  backend for one city
  async function fetchRisk(cityName) {
    try {
      const response = await fetch(`http://localhost:8000/score?city=${encodeURIComponent(cityName)}`)
      const data = await response.json()
      return data.risk_score
    } catch (err) {
      console.error(`Failed to fetch risk for ${cityName}:`, err)
      return null  // null means the fetch failed
    }
  }

  const cityListDiv = document.getElementById("cityList");

  // fetch all cities in parallel --> much faster than one at a time
  const results = await Promise.all(
    cityData.map(async (city) => {
      const risk = await fetchRisk(city.name)
      return { ...city, risk }
    })
  );

  // sort cities by risk descending
  results.sort((a, b) => b.risk - a.risk);

  results.forEach(city => {
    // if fetch failed skip  city
    if (city.risk === null) return;

    const category = getRiskCategory(city.risk);
    const color    = getRiskColor(city.risk);

    // add city to sidebar
    const cityDiv = document.createElement("div");
    cityDiv.className = `city-item ${category}`;
    cityDiv.innerHTML = `<strong>${city.name}</strong><br>Risk Score: ${city.risk.toFixed(2)}`;
    cityListDiv.appendChild(cityDiv);

    //  marker
    L.circleMarker([city.lat, city.lng], {
      radius: 10,
      fillColor: color,
      color: "#ffffff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`<strong>${city.name}</strong><br>Risk Score: ${city.risk.toFixed(2)}`);
  });
});