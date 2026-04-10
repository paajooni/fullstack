const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
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

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is withing the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.title)
    assert(contents.includes('fullstack is okay'))
})


test('blogs are returned with field id and not _id', async () => {
  const response = await api.get('/api/blogs')
  const blogForVerification = response.body[0]

  assert('id' in blogForVerification)
  assert.strictEqual(blogForVerification._id, undefined)
})


test('a valid blog can be added', async () => {
  const newBlog = {
    "title" : "wow a new blog",
    "author" : "New writer",
    "url" : "is.fi/fullstack",
    "likes" : 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialBlogs.length + 1)

  const contents = notesAtEnd.map(n => n.title)
  assert(contents.includes('wow a new blog'))
})


test('blog without likes defined has 0 likes', async () => {
  const newBlog = {
    "title" : "Brand new blog",
    "author" : "New writer",
    "url" : "is.fi/fullstack",
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})


test('blog without title is not added', async () => {
  const newBlog = {
    "author" : "New writer",
    "url" : "is.fi/fullstack",
    "likes" : 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.notesInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    "title" : "Brand new blog",
    "author" : "New writer",
    "likes" : 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.notesInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})


after(async () => {
    await mongoose.connection.close()
})