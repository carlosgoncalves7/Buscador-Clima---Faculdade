const URL_GEO = (cidade) => `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`;

const URL_METEO = ({ latitude, longitude }) => `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset,daylight_duration,uv_index_max,temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,rain&current=apparent_temperature,is_day,precipitation,rain,wind_speed_10m,temperature_2m,relative_humidity_2m,weathercode&timezone=America%2FSao_Paulo`;

// "Essa função está fazendo mais de uma coisa?"
export async function buscarDadosClima(nomeCidade) {

    // "Se essa requisição falhar, quem vai avisar o usuário final?"
    // Fetch para buscar longitude e latitude da cidade
    const geoResponse = await fetch(URL_GEO(nomeCidade))
    // Se o servidor estiver fora do ar, ou sem internet a requisição cai direto pra catch
    // Se o servidor respondeu mas com erro, tratamos aqui. Ex: ( 404 ou 500 ) 
    if (!geoResponse.ok) {
        // Se algo deu errado na requisição, não há motivo para continuar. Você deve interromper o fluxo e lançar uma exceção (erro).
        // Com o trow erro, nós disparamos um erro manualmente
        throw new Error(`Erro no servidor. Código:${response.status}`)
    }

    const data = await geoResponse.json()

    // "E se essa variável vier vazia/nula?"
    if (!data.results?.length) {
        // Servidor ativo, mas nenhum dado foi encontrado 
        console.log("Nenhum registro encontrado")
        return
    }

    const cidade = data.results?.[0] /*?? "cidade não encontrada"*/
    const { longitude, latitude } = cidade
    if (!longitude || !latitude) {
        alert("Insira cidade válida")
        return
    }

    // Fetch para buscar dados completo de clima da cidade
    const responseMeteo = await fetch(URL_METEO({ longitude, latitude }))
    if (!responseMeteo.ok) {
        return console.log("Erro ao buscar clima")
    }
    const dataMeteo = await responseMeteo.json()
    
    return {
        cidade,
        dataMeteo
    }

}