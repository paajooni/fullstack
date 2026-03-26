const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {}
    const mostLiked = blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
    return mostLiked
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}