import Weather from './Weather'
const CountryList = ({ countries, setValue }) => {
    if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }

    if (countries.length === 1) {
        const country = countries[0]
        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>Capital {country.capital}</div>
                <div>Are {country.area}</div>
                <h2>Languages</h2>
                <ul>
                    {Object.values(country.languages).map(language =>
                    <li key={language}>{language}</li> )}
                </ul>
                <img src={country.flags.png} alt={country.name.common} />
                <Weather city={country.capital[0]} />
            </div>
        )
    }

    return (
        <div>
            {countries.map(country =>
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => setValue(country.name.common)}>
                        show
                    </button>
                </div>
            )}
        </div>
    )
}
export default CountryList
