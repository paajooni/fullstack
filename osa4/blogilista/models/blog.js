const dns = require('node:dns')
dns.setServers(['8.8.8.8', '8.8.4.4'])
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1
  },
  author: String,
  url: {
    type: String,
    required: true,
    minlength: 1
  },
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