import { useState, useEffect } from 'react'
import personService from './services/persons'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'

const Person = ({ person, deletePerson }) => {
  return (
    <li>
    {person.name} {person.number}
    <button onClick={() => deletePerson(person.id)}>delete</button>
    </li>
  )
}


const Filter = ({ newFilter, handleFilterChange }) => {
  return (
    <div>
    filter shown with <input
          value={newFilter}
          onChange={handleFilterChange}/>
    </div>
  )
}


const PersonForm = ({ addPerson, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
      <form onSubmit={addPerson}>
        <div>
          name: <input
          value={newName}
          onChange={handleNameChange}/>
        </div>
        <div>
          number: <input
          value={newNumber}
          onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}


const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>{personsToShow.map((person) =>
      <Person
        key={person.name}
        person={person}
        deletePerson={deletePerson} />
    )}
    </div>
  )
}


const App = (props) => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(n => n.name === newName)

    if (person) {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(n => n.id !== person.id ? n : returnedPerson))
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`Fixed ${returnedPerson.name} number`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService
      .create(personObject)
        .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
  }


  const deletePerson = (id) => {
    const person = persons.find(n => n.id === id)

    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .terminate(id)
        .then(() => {
          setPersons(persons.filter(n => n.id !== id))
          setSuccessMessage(`Deleted ${person.name}`)
          setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(n => n.id !== id))
        })
      }
  }


  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }


  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }


  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setNewFilter(event.target.value)
  }


  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(newFilter.toLocaleLowerCase())
    )


  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
        <PersonForm
          addPerson={addPerson}
          newName={newName}
          newNumber={newNumber}
          handleNameChange={handleNameChange}
          handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
        <Persons
          personsToShow={personsToShow}
          deletePerson={deletePerson} />
    </div>
  )

}

export default App
