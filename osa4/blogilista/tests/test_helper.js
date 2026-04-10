const blogsRouter = require('../controllers/blogs')
const Blog = require('../models/blog')

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

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon'})
    await blog.save()
    await note.deleteOne()

    return blog._id.toString()
}

const notesInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, notesInDb
}