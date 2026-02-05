import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'

const App = () => {
  const [countries, setCountries] = useState([])
  const [value, setValue] = useState('')

  useEffect(() => {
    if (countries) {
      console.log('fetching countries...')
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all/`)
        .then(response => {
          setCountries(response.data)
        })
    }
  }, [])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries: <input value={value} onChange={handleChange} />
      </div>
      <CountryList countries={filteredCountries} setValue={setValue}/>
    </div>
  )
}

export default App
