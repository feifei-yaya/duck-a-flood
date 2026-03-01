document.addEventListener("DOMContentLoaded", async function () {
  // Initialize the map centered on Georgia
  const map = L.map('map').setView([32.1656, -82.9001], 7);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const cityListDiv = document.getElementById("cityList");

  // List of Georgia cities
  const cities = ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'St. Simons', 'Macon', 'Albany', 'Athens', 'Roswell'];

  function getRiskCategory(risk) {
    if (risk > 0.7) return "high";
    if (risk > 0.4) return "medium";
    return "low";
  }

  function getRiskColor(risk) {
    if (risk > 0.7) return "#ef4444"; // red
    if (risk > 0.4) return "#f59e0b"; // amber
    return "#10b981"; // green
  }

  // Fetch risk data from backend for each city
  for (const city of cities) {
    try {
      const res = await fetch(`http://localhost:8000/score?city=${city}`);
      const data = await res.json();

      // Assuming backend returns: { "name": "Atlanta", "lat": 33.7490, "lng": -84.3880, "risk": 0.33 }
      const { name, lat, lng, risk } = data;

      // Add to sidebar
      const category = getRiskCategory(risk);
      const cityDiv = document.createElement("div");
      cityDiv.className = `city-item ${category}`;
      cityDiv.innerHTML = `<strong>${name}</strong><br>Risk Score: ${risk.toFixed(2)}`;
      cityListDiv.appendChild(cityDiv);

      // Add marker to map
      L.circleMarker([lat, lng], {
        radius: 10,
        fillColor: getRiskColor(risk),
        color: "#ffffff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map).bindPopup(`<strong>${name}</strong><br>Risk Score: ${risk.toFixed(2)}`);

    } catch (err) {
      console.error(`Error fetching data for ${city}:`, err);
    }
  }
});