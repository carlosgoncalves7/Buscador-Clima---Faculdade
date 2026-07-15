// import carregarConfig from "./src/config.js";
import { mostrarLoader, esconderLoader } from "./src/scripts/loader.js";
import Hero from "./src/scripts/hero.js"
import WeekCards from "./src/scripts/weekCards.js";


const form = document.getElementById("formularioClima");
const labelTemp = document.getElementById("label-temp");

let cidadeContainer = document.querySelector(".cidade-container")

let semanaContainer = document.getElementById("week-container")

const url = (cidade) => `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`;

const urlmeteo = ({ latitude, longitude }) => `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,daylight_duration,uv_index_max,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain&current=apparent_temperature,is_day,precipitation,rain,wind_speed_10m,temperature_2m,relative_humidity_2m,weathercode&timezone=America%2FSao_Paulo`;

let unidade = "C";
let dados = null;

// function setupCounter(element) {
//     let counter = 0
//     const setCounter = (count) => {
//         counter = count
//         element.innerHTML = `Count is ${counter}`
//     }
//     element.addEventListener('click', () => setCounter(counter + 1))
//     setCounter(0)
// }

const weekContent = document.querySelector(".week-content")
const conditionsCurrent = document.querySelector(".current-conditions")

// function Hero(hero) {
//     return `<div class="cidade-content">
//                 <div class="text-content">
//                 <h2 class="cidade">${hero.city.name}</h2>
//                 <span class="data">${hero.time.value}</span>
//                 </div>
//                 <div class="flex-content">
//                 <img src="src/assets/light-icon/${weathericons[hero.weathercode]}" alt="" class="vector-clima"></img>
//                 <span class="temperatura">${hero.temperature.value}<span class="units">°C</span></span>
//                 </div
//             </div>`
// }

function CardsHero(details) {
    return `
        <div class="card">
            <p class="titulo">${details.name}</p>
            <span class="valor">${details.value}${details.units}</span>
        </div>`
}



// function createCardCurrentDay(curr) {
//     //const div = document.createElement("div")
//     //div.setAttribute("class", "box-dias")
//     //div.innerHTML =
//     return `<div class="card">
//                 <p class="titulo">${curr.name}</p>
//                 <span class="valor">${curr.value}</span>
//             </div>`
//     //weekContent.appendChild(div)
// }

function transformCurrentCity(current, unidade, cidade) {
    return {
        city: {
            name: cidade.name,
            uf: cidade.admin1,
            country: {
                name: cidade.country,
                code: cidade.country_code
            }
        },
        details: [
            {
                value: current.precipitation,
                units: unidade.precipitation,
                name: "Precipitação"
            },
            {
                value: current.rain,
                units: unidade.rain,
                name: "Chuva"
            },
            {
                value: current.relative_humidity_2m,
                units: unidade.relative_humidity_2m,
                name: "Humidade"
            },
            {
                value: current.wind_speed_10m,
                units: unidade.wind_speed_10m,
                name: "Vento"
            },
        ],
        temperature: {
            value: Math.round(current.temperature_2m),
            units: Math.round(unidade.temperature_2m),
            apparent: Math.round(current.apparent_temperature),
            name: "Temperatura"
        },
        time: {
            value: current.time,
            units: unidade.time,
        },
        weathercode: current.weathercode
    }
}

function transformData(daily) {
    let data = []
    for (let i = 1; i < daily.time.length; i++) {
        data.push(
            {
                time: daily.time[i],
                daylight_duration: daily.daylight_duration[i],
                sunrise: daily.sunrise[i],
                sunset: daily.sunset[i],
                temperature_max: Math.round(daily.temperature_2m_max[i]),
                temperature_min: Math.round(daily.temperature_2m_min[i]),
                uv_index_max: daily.uv_index_max[i],
                weathercode: daily.weathercode[i]
            }
        )
    }
    return data
}




// FETCH PRINCIPAL DE CLIMA
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputcidade = document.getElementById("cidade").value.trim();
    if (inputcidade === "") return alert("Preencha o campo!");

    // salvarConfig("ultimaCidade", cidade);
    mostrarLoader();

    try {
        // Fetch para buscar longitude e latitude da cidade
        const response = await fetch(url(inputcidade))
        // Tratamento de erro caso a resposta retorne false, 
        if (!response.ok) {
            console.log("Problema no fetch")
        }
        const data = await response.json()
        // console.log("Olha aqui", data)
        const cidade = data.results[0]
        const { longitude, latitude } = cidade
        if (!longitude || !latitude) {
            return alert("Insira cidade válida")
        }
        // Fetch para buscar dados completo de clima da cidade
        const responseMeteo = await fetch(urlmeteo({ longitude, latitude }))
        if (!responseMeteo.ok) {
            return console.log("Erro ao buscar clima")
        }
        const dataMeteo = await responseMeteo.json()
        const { current, current_units, daily } = dataMeteo

        // Modelando os dados de clima semanais vindo da api e adicionando ao array
        const previsaoSemanal = transformData(daily)
        // Modelando os dados de clima atual vindo da api
        const climateDay = transformCurrentCity(current, current_units, cidade)
        //console.log("Atual: ", climateDay)

        // Criando o componente da hero dinamicamente
        cidadeContainer.innerHTML = Hero(climateDay)

        // Mapeando dinamicamente os dados direto no html
        weekContent.innerHTML = previsaoSemanal.map(WeekCards).join('')
        conditionsCurrent.innerHTML = climateDay.details.map(CardsHero).join('')

        //currentDay.details.forEach()
        // if (previsaoSemanal) {
        //     semanaBox.innerHTML = ""
        // } else {
        //     semanaBox.innerHTML = "<span class='error-semana'>Sem dados para exibir</span>"
        //     console.log(previsaoSemanal)
        //     return
        // }


    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        esconderLoader()
    }
});