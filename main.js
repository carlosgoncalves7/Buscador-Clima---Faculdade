import { transformCurrentCity, transformData } from "./src/scripts/dataService.js";
import { mostrarLoader, esconderLoader } from "./src/scripts/loader.js";
import { buscarDadosClima } from "./src/scripts/climaService.js";
import { Hero, CardsHero } from "./src/scripts/hero.js"
import {WeekCards } from "./src/scripts/weekCards.js";

const form = document.getElementById("formularioClima");
const labelTemp = document.getElementById("label-temp");


const semanaContainer = document.getElementById("week-container")
let unidade = "C";
let dados = null;


const conditionsCurrent = document.querySelector(".current-conditions")
const weekContent = document.querySelector(".week-content")



// "Essa função está fazendo mais de uma coisa?"
// FETCH PRINCIPAL DE CLIMA
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputcidade = document.getElementById("cidade").value.trim();
    if (inputcidade === "") return alert("Preencha o campo!");

    mostrarLoader();    
    try {
        
        const {cidade, dataMeteo } = await buscarDadosClima(inputcidade)
        const { current, current_units, daily } = dataMeteo

        // Modelando os dados de clima semanais vindo da api e adicionando ao array
        const previsaoSemanal = transformData(daily)
        console.log(previsaoSemanal)
        // Modelando os dados de clima atual vindo da api
        const weatherDay = transformCurrentCity(current, current_units, cidade)
        //console.log("Atual: ", climateDay)
        console.log(weatherDay)
        // Criando o componente da hero dinamicamente
        Hero(weatherDay)

        // Mapeando dinamicamente os dados direto no html
        weekContent.innerHTML = previsaoSemanal.map(WeekCards).join('')
        WeekCards(previsaoSemanal)
        conditionsCurrent.innerHTML = weatherDay.details.map(CardsHero).join('')

        //currentDay.details.forEach()
        // if (previsaoSemanal) {
        //     semanaBox.innerHTML = ""
        // } else {
        //     semanaBox.innerHTML = "<span class='error-semana'>Sem dados para exibir</span>"
        //     console.log(previsaoSemanal)
        //     return
        // }


    } catch (error) {
        // O catch , captura aqui tanto o erro de servidor offline
        // Como captura os erros HTTPS que disparamos com o 'trow' acima 
        console.error("Erro de conexão ou servidor fora do ar:", error.message);
        console.log("Ocorreu um erro ao buscar os dados")
    } finally {
        esconderLoader()
    }

});