const apiKey = "1853243ce1334676915235348252505"; // ← pon aquí tu key válida de WeatherAPI
const cities = [
  "Madrid,ES",
  "Valencia,ES",
  "Sevilla,ES",
  "Barcelona,ES",
  "Malaga,ES",
  "Cuenca,ES",
  "Alicante,ES",
  "Tarragona,ES",
  "Cordoba,ES",
  "Zaragoza,ES",
  "Albacete,ES",
]; // solo ciudades españolas

async function fetchWeather(city) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=2&aqi=no&alerts=no&lang=es`
  );
  return await res.json();
}

function createCard(city, data) {
  const current = data.current;
  const now = new Date();

  const hoursToday = data.forecast.forecastday[0].hour;
  const hoursTomorrow = data.forecast.forecastday[1]?.hour || [];
  const allHours = [...hoursToday, ...hoursTomorrow];

  const futureHours = allHours
    .filter((h) => {
      const forecastTime = new Date(h.time.replace(" ", "T"));
      return forecastTime > now;
    })
    .slice(0, 24);

  const card = document.createElement("div");
  card.className = "weather-card";

  card.innerHTML = `
  <div class="card-content">
    <div class="left">
      <div class="city">${data.location.name}</div>
      <div class="current">
        <img src="https:${current.condition.icon}"/>
        <div class="temp-desc">
          <div class="temp">${current.temp_c.toFixed(0)}°C</div>
        </div>
      </div>
    </div>
    <div class="hours">
      ${futureHours
        .map(
          (h) => `
        <div class="hour">
          <div>${new Date(h.time).getHours()}:00</div>
          <img src="https:${h.condition.icon}" />
          <div>${h.temp_c.toFixed(0)}°</div>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
    </div>
`;

  return card;
}

async function loadWeather() {
  const container = document.getElementById("weather-cards");
  container.innerHTML = ""; // Limpia por si recarga

  for (const city of cities) {
    const data = await fetchWeather(city);
    const card = createCard(city, data);
    container.appendChild(card);
  }

  startCarousel();
}

function startCarousel() {
  const cards = document.querySelectorAll(".weather-card");
  let index = 0;

  // Inicializa
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === 0);
  });

  setInterval(() => {
    cards[index].classList.remove("active");
    index = (index + 1) % cards.length;
    cards[index].classList.add("active");
  }, 7000);
}

// Ejecuta todo al cargar
document.addEventListener("DOMContentLoaded", loadWeather);
