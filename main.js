const form = document.getElementById("formularioClima");
const labelTemp = document.getElementById("label-temp");

const toggleTempDiv = document.querySelector(".toggle-temp");

let unidade = "C"; 
let dados = null;






//  LOCALSTORAGE (CONFIGURAÇÕES)
function carregarConfig() {
    const config = JSON.parse(localStorage.getItem("configClima")) || {};


    if (config.unidade) {
        unidade = config.unidade;
        toggleTempDiv.classList.toggle("active", unidade === "F");
        labelTemp.textContent = unidade === "F" ? "°F" : "°C";
    }


    if (config.ultimaCidade) {
        document.getElementById("cidade").value = config.ultimaCidade;
    }
}


function salvarConfig(chave, valor) {
    const config = JSON.parse(localStorage.getItem("configClima")) || {};
    config[chave] = valor;
    localStorage.setItem("configClima", JSON.stringify(config));
}

carregarConfig();

// Loader
function mostrarLoader() {
    document.getElementById("loader").style.display = "block";
}
function esconderLoader() {
    document.getElementById("loader").style.display = "none";
}

// Conversão
function cToF(c) { return c * 9/5 + 32; }
function fToC(f) { return (f - 32) * 5/9; }


// Toggle °C / °F
toggleTempDiv.addEventListener("click", () => {
    toggleTempDiv.classList.toggle("active");
    unidade = toggleTempDiv.classList.contains("active") ? "F" : "C";

    salvarConfig("unidade", unidade);

    labelTemp.textContent = unidade === "F" ? "°F" : "°C";
    atualizarTemperatura();
});


// Atualiza temperaturas
function atualizarTemperatura() {
    if (!dados) return;


    let tempAtual = dados.current.temperature_2m;
    if (unidade === "F") tempAtual = cToF(tempAtual);
    document.getElementById("temp-atual").textContent = `${Math.round(tempAtual)}°`;

    let tempMax = dados.daily.temperature_2m_max[0];
    let tempMin = dados.daily.temperature_2m_min[0];
    if (unidade === "F") { tempMax = cToF(tempMax); tempMin = cToF(tempMin); }
    document.getElementById("max-min").textContent = `${Math.round(tempMax)}° | ${Math.round(tempMin)}°`;


    const boxes = document.querySelectorAll(".box-dias");
    for (let i = 0; i < boxes.length; i++) {
        let max = dados.daily.temperature_2m_max[i];
        let min = dados.daily.temperature_2m_min[i];
        if (unidade === "F") { max = cToF(max); min = cToF(min); }
        boxes[i].querySelector(".graus").textContent = `${Math.round(max)}° / ${Math.round(min)}°`;
    }
}


// Ícones clima
// const weatherIcons = {
//     0:"sol.svg", 1:"nublado.svg", 2:"nublado.svg", 3:"nublado.svg",
//     45:"nuvem.svg", 51:"chuva.svg", 61:"chuva.svg", 80:"chuva.svg",
//     95:"trovoada.svg", 71:"neve.svg"
// };


// BOTÃO: MOSTRAR / OCULTAR HISTÓRICO
const btnHistorico = document.getElementById("btn-historico");
const historicoContainer = document.getElementById("historico-container");


if (btnHistorico) {
    btnHistorico.addEventListener("click", () => {
        const isVisible = historicoContainer.style.display === "block";
        historicoContainer.style.display = isVisible ? "none" : "block";


        btnHistorico.textContent = isVisible ? "Mostrar Histórico" : "Ocultar Histórico";


        if (!isVisible) {
            carregarHistoricoServidor();
        }
    });
}

// const weatherIcons = {
//     0:"☀️", 
//     1:"🌥️", 
//     2:"🌥️", 
//     3:"🌥️",
//     45:"nuvem.svg", 
//     51:"🌧️", 
//     61:"🌧️", 
//     80:"🌧️",
//     95:"⛈️", 
//     71:"🌨️"
// };

const weatherIcons = {
    0:"assets/img/Icones_branco/sol.svg", 
    1:"assets/img/Icones_branco/nuvem.svg", 
    2:"assets/img/Icones_branco/nuvem.svg", 
    3:"assets/img/Icones_branco/nuvem.svg",
    45:"assets/img/Icones_branco/nuvem.svg", 
    51:"assets/img/Icones_branco/chuva.svg", 
    61:"assets/img/Icones_branco/chuva.svg", 
    80:"assets/img/Icones_branco/chuva.svg",
    95:"assets/img/Icones_branco/trovoada.svg", 
    71:"assets/img/Icones_branco/neve.svg"
};

// FETCH PRINCIPAL DE CLIMA

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const cidade = document.getElementById("cidade").value.trim();
    if (cidade === "") return alert("Preencha o campo!");

    salvarConfig("ultimaCidade", cidade);
    mostrarLoader();

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`;
    fetch(url)
        .then(res => res.json())
        .then(local => {

            console.log(local)
            if (!local.results) {
                esconderLoader();
                return alert("Cidade não Encontrada!");
            }


            const resultado = local.results[0];
            const dadosCidade = { 
                cidade: resultado.name, 
                latitude: resultado.latitude, 
                longitude: resultado.longitude };


            const urlCidade = `https://api.open-meteo.com/v1/forecast?latitude=${dadosCidade.latitude}&longitude=${dadosCidade.longitude}&daily=sunrise,sunset,daylight_duration,uv_index_max,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain&current=apparent_temperature,is_day,precipitation,rain,wind_speed_10m,temperature_2m,relative_humidity_2m,weathercode&timezone=America%2FSao_Paulo`;


            return fetch(urlCidade)
                .then(res => res.json())
                .then(apiDados => {

                    console.log(apiDados);
                    dados = apiDados;


                    document.getElementById("cidade-atual").textContent = dadosCidade.cidade;


                    const dataAtual = new Date();
                    const dias = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado"];
                    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
                    document.getElementById("data-atual").textContent = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${meses[dataAtual.getMonth()]}`;


                    let descricao = "";
                    if (dados.current.rain > 0) descricao = "Chuvoso";
                    else if (dados.current.precipitation > 0) descricao = "Possibilidade de Chuva";
                    else if (dados.current.is_day === 1) descricao = "Ensolarado";
                    else descricao = "Noite Limpa";
                    document.getElementById("descricao-atual").textContent = descricao;


                    document.getElementById("umidade-atual").textContent = `Umidade: ${dados.current.relative_humidity_2m}%`;
                    document.getElementById("chuva-atual").textContent = `Chuva: ${dados.hourly.precipitation_probability[0]}%`;
                    document.getElementById("vento-atual").textContent = `Vento: ${dados.current.wind_speed_10m} km/h`;


                    document.getElementById("precipitação").textContent = `${dados.current.precipitation} mm`;
                    document.getElementById("ind-uvMax").textContent = dados.daily.uv_index_max[0];
                    
                    const formatarHora = (h) => h.split("T")[1].substring(0, 5);
                    document.getElementById("nascer-sol").textContent = formatarHora(dados.daily.sunrise[0]);
                    document.getElementById("por-sol").textContent = formatarHora(dados.daily.sunset[0]);
                    document.getElementById("vento").textContent = `${dados.current.wind_speed_10m} km/h`;


                    const codigoAtual = dados.current.weathercode ?? 0;
                    document.getElementById("img-iconeAtual").setAttribute("src", `${weatherIcons[codigoAtual] || "assets/img/Icones_branco/sol.svg"}`);


                    const boxes = document.querySelectorAll(".box-dias");
                    const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];


                    for (let i = 0; i < 7; i++) {
                        const box = boxes[i];
                        const dataDia = new Date(dados.daily.time[i]);
                        const nomeDia = diasSemana[dataDia.getDay()];


                        let tempMax = Math.round(dados.daily.temperature_2m_max[i]);
                        let tempMin = Math.round(dados.daily.temperature_2m_min[i]);
                        if (unidade === "F") {
                            tempMax = cToF(tempMax);
                            tempMin = cToF(tempMin);
                        }


                        const codigo = dados.daily.weathercode[i];
                        const icone = weatherIcons[codigo] || "assets/img/Icones_branco/sol.svg";


                        box.querySelector(".dia").textContent = nomeDia;
                        box.querySelector(".graus").textContent = `${Math.round(tempMax)}° / ${Math.round(tempMin)}°`;
                        box.querySelector(".img").setAttribute("src", `${icone}`);
                    }


                    atualizarTemperatura();
                    esconderLoader();
                    // SALVAR HISTÓRICO
                    // salvarHistorico();
                });
        })
        .catch(err => {
            esconderLoader();
            alert("Erro ao buscar dados do clima.");
            console.error(err);
        });
});