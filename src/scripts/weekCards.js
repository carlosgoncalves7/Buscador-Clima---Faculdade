export function WeekCards(prev) {
    const weathericons = {
        0: "sol.svg",
        1: "nuvem.svg",
        2: "nuvem.svg",
        3: "nuvem.svg",
        45: "nuvem.svg",
        51: "chuva.svg",
        61: "chuva.svg",
        80: "chuva.svg",
        95: "trovoada.svg",
        71: "neve.svg"
    };
    
    //const div = document.createElement("div")
    //div.setAttribute("class", "box-dias")
    const days =  ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"]
    let date = new Date(prev.time)

    return `<div class="card-day">
        <span class="dia">${days[date.getDay()]}</span>
        <img class="img" src="src/assets/week-icon/${weathericons[prev.weathercode]}"></img>
        <span class="graus">${prev.temperature_max}°C</span>
        <span class="graus min">${prev.temperature_min}°C</span>
        </div>`
    //weekContent.appendChild(div)
}