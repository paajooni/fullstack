import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if (city) {
        console.log('fetching weather...')
        axios
            .get(`https://wttr.in/${city}?format=j1`)
            .then(response => {
                setWeather(response.data)
            })
            .catch(error => {
                console.error('Error fetching weather data', error)
            })
        }
    }, [city])

    if (!weather) {
    return <div>Loading weather...</div>
  }

    const current = weather.current_condition[0]

    return (
        <div>
            <h3>Weather in {city}</h3>
            <p>Tempature {current.temp_C} Celcius</p>
            <img
                src={current.weatherIconUrl[0].value}
                alt={current.weatherDesc[0].value}
            />
            <p>Wind {current.windspeedKmph} km/h</p>
        </div>
    )
}
export default Weather
