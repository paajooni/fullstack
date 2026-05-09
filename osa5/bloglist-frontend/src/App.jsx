import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import SuccessNotification from './components/SuccessNotification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [blogFormVisible, setBLogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setSuccessMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('blog creation failed', exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => {
        if (blog.id !== id) {
          return blog
        } else {
          return { ...returnedBlog, user: blog.user }
        }
      }))
    } catch (execption) {
      setErrorMessage('Error trying to update likes', execption)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const deleteBlog = async (id, blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        setSuccessMessage(`Blog ${blog.title} succesfully removed!`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      } catch (execption) {
        setErrorMessage('Error trying to remove blog', execption)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('logged in')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout =() => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setSuccessMessage('logged out')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
            password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBLogFormVisible(true)}>create new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm createBlog={addBlog} />
          <button onClick={() => setBLogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />

      <h2>log in to application</h2>

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <h2>create new</h2>
          {blogForm()}
        </div>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            deleteBlog={deleteBlog}
            user={user} />
        )}
    </div>
  )
}

export default App