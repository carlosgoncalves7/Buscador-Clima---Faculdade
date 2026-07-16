export function transformCurrentCity(current, unidade, cidade) {
    return {
        city: {
            name: cidade?.name ?? "Cidade desconhecida",
            uf: cidade?.admin1 ?? "",
            country: {
                name: cidade?.country ?? "",
                code: cidade?.country_code ?? 0
            }
        },
        details: [
            {
                value: current?.precipitation ?? 0,
                units: unidade?.precipitation ?? "mm",
                name: "Precipitação"
            },
            {
                value: current?.rain ?? 0,
                units: unidade?.rain ?? "mm",
                name: "Chuva"
            },
            {
                value: current?.relative_humidity_2m ?? 0,
                units: unidade?.relative_humidity_2m ?? "%",
                name: "Umidade"
            },
            {
                value: current?.wind_speed_10m ?? 0,
                units: unidade?.wind_speed_10m ?? "km/h",
                name: "Vento"
            },
        ],
        temperature: {
            value: Math.round(current?.temperature_2m) ?? 0,
            units: Math.round(unidade?.temperature_2m) ?? "°C",
            apparent: Math.round(current?.apparent_temperature) ?? 0,
            name: "Temperatura"
        },
        time: {
            value: current?.time ?? new Date(),
            units: unidade?.time ?? "",
        },
        weathercode: current?.weathercode ?? ""
    }
}

export function transformData(daily) {
    return daily.time.map((day, index) =>{
        return {
            time: daily.time[index] ?? "",
            daylight_duration: daily.daylight_duration[index] ?? 0,
            sunrise: daily.sunrise[index] ?? "",
            sunset: daily.sunset[index] ?? "",
            temperature_max: Math.round(daily.temperature_2m_max[index]) ?? 0,
            temperature_min: Math.round(daily.temperature_2m_min[index]) ?? 0,
            uv_index_max: daily.uv_index_max[index] ?? 0,
            weathercode: daily.weathercode[index] ?? 0
        }
    })
    
}