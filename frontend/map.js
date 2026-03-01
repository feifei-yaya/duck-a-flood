document.addEventListener("DOMContentLoaded", function (){
    const map=L.map('map').setView([39.5, -98.35], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    const cityRistData=[
        {name:"Houston", lat:29.7604, lng:-95.3698, risk:0.82},
        {name:"New Orleans", lat:29.9511, lng:-90.0715, risk:0.67},
        {name:"Miami", lat:25.7617, lng:-80.1918, risk:0.41},
        {name:"Atlanta", lat:33.7490, lng:-84.3880, risk:0.33}
    ];
    cityRistData.sort((a,b)=>b.risk-a.risk);
    function getRiskCategory(risk){
        if(risk>0.7) return "high";
        if(risk>0.4) return "medium";
        return "low";}
    function getRiskColor(risk){
        if(risk>0.7) return "#eb7575";
        if(risk>0.4) return "#ffa200";
        return "#29cd96";
    }
    const cityListDiv = document.getElementById("cityList");

    cityRistData.forEach(city=>{

        const category = getRiskCategrory(city.risk);
        const color = getRiskColor(city.risk);
        const cityDiv = document.createElement("div");
        cityDiv.className = `city-item ${category}`;
        cityDiv.innerHTML = `
        <strong>${city.name}</strong><br/>
        Risk Score: ${city.risk.toFixed(2)}
        `;
        cityListDiv.appendChild(cityDiv);
        L.circleMarker([city.lat, city.lng],{
            radius:10,
            fillColor:color,
            color:"#ffffff",
            weight:1,
            opacity:1,
            fillOpacity:0.8,
        }).addTo(map).bindPopup(`
        <strong>${city.name}</strong><br/>
        Risk Score: ${city.risk.toFixed(2)}
        `);
        })
})
