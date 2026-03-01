document.addEventListener("DOMContentLoaded", async function () {
  const map = L.map('map').setView([32.5, -83.5], 7); // centered on Georgia

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // City coordinates — dict generated from Claude, Google Maps verified 
  const cityData = [
    { name: "Atlanta",    lat: 33.7490, lng: -84.3880 },
    { name: "Savannah",   lat: 32.0835, lng: -81.0998 },
    { name: "Augusta",    lat: 33.4735, lng: -82.0105 },
    { name: "Columbus",   lat: 32.4610, lng: -84.9877 },
    { name: "St. Simons", lat: 31.1355, lng: -81.3926 },
    { name: "Macon",      lat: 32.8407, lng: -83.6324 },
    { name: "Albany",     lat: 31.5785, lng: -84.1557 },
    { name: "Athens",     lat: 33.9519, lng: -83.3576 },
    { name: "Roswell",    lat: 34.0232, lng: -84.3616 },
  ];

  function getRiskCategory(risk) {
    if (risk > 0.65) return "high";
    if (risk > 0.35) return "medium";
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