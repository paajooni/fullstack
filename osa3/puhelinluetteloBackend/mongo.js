const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://paajooni:${password}@puhelinluettelo.ugpqzqt.mongodb.net/?appName=puhelinluettelo`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const puhelinnumeroSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Puhelinnumero = mongoose.model('Puhelinnumero', puhelinnumeroSchema)

const puhelinnumero = new Puhelinnumero({
  name: process.argv[3],
  number: process.argv[4]
})
if (process.argv.length === 5) {
  puhelinnumero.save().then(result => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Puhelinnumero.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(puhelinnumero => {
      console.log(puhelinnumero.name, puhelinnumero.number)
      mongoose.connection.close()
    })
  })
}