const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    "title" : "fullstack is okay",
    "author" : "Jonne Kiiskinen",
    "url" : "yle.fi/fullstack/okay",
    "likes" : 68
  },
  {
    "title" : "I hate all stacks",
    "author" : "Veikka Kumpu",
    "url" : "yle.fi/fullstack/hate",
    "likes" : 1
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})


test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a specific blog is withing the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('fullstack is okay'))
})


after(async () => {
    await mongoose.connection.close()
})