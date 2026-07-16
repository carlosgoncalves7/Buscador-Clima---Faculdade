export function Hero(hero) {
    const weathericons = {
        0: "sol.svg",1: "nuvem.svg",2: "nuvem.svg",3: "nuvem.svg",45: "nuvem.svg",
        51: "chuva.svg",61: "chuva.svg",80: "chuva.svg",95: "trovoada.svg",71: "neve.svg"
    };

    const cidadeContainer = document.querySelector(".cidade-container")

    cidadeContainer.innerHTML = `<div class="cidade-content">
                <div class="text-content">
                <h2 class="cidade">${hero.city.name}</h2>
                <span class="data">${hero.time.value}</span>
                </div>
                <div class="flex-content">
                <img src="src/assets/light-icon/${weathericons[hero.weathercode]}" alt="" class="vector-clima"></img>
                <p class="temperatura">${hero.temperature.value}<sup>°C</sup></p>
                </div
            </div>`;
    return
}

export function CardsHero(details) {
    return `
        <div class="card">
            <p class="titulo">${details.name}</p>
            <span class="valor">${details.value}${details.units}</span>
        </div>`
}