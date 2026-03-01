document.addEventListener("DOMContentLoaded", function () {
  // Create the map
  const map = L.map('map').setView([39.5, -98.35], 4);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Sample city data
  const cityData = [
    {name:"Houston", lat:29.7604, lng:-95.3698, risk:0.82},
    {name:"New Orleans", lat:29.9511, lng:-90.0715, risk:0.67},
    {name:"Miami", lat:25.7617, lng:-80.1918, risk:0.41},
    {name:"Atlanta", lat:33.7490, lng:-84.3880, risk:0.33}
  ];

  // Sort by risk descending
  cityData.sort((a,b) => b.risk - a.risk);
  // List of Georgia cities
  const cities = ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'St. Simons', 'Macon', 'Albany', 'Athens', 'Roswell'];

  // Functions for category & color
  function getRiskCategory(risk){
    if(risk > 0.7) return "high";
    if(risk > 0.4) return "medium";
    return "low";
  }

  function getRiskColor(risk){
    if(risk > 0.7) return "#ef4444";
    if(risk > 0.4) return "#f59e0b";
    return "#10b981";
  }

  const cityListDiv = document.getElementById("cityList");

  cityData.forEach(city => {
    // Add city to sidebar
    const category = getRiskCategory(city.risk);
    const color = getRiskColor(city.risk);
    const cityDiv = document.createElement("div");
    cityDiv.className = `city-item ${category}`;
    cityDiv.innerHTML = `<strong>${city.name}</strong><br>Risk Score: ${city.risk.toFixed(2)}`;
    cityListDiv.appendChild(cityDiv);

    // Add marker on map
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