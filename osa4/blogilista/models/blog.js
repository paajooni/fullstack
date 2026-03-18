const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const config = require('../utils/config')

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
    console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)