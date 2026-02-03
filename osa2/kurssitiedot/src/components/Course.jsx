import ReactDOM from "react-dom/client"
import App from "../App"

const Course = ({ course }) => {
  
  const Part = ({ part }) => { 
    return <p>{part.name} {part.exercises}</p>
  }

  const total = course.parts.reduce( (sum, p) => {
    return sum + p.exercises
  }, 0)
  
  return (
    <div>
      <h2>{course.name}</h2>
      {course.parts.map(part => 
        <Part key={part.id} part={part} />
      )}
      <b>total of {total} exercises</b>
    </div>
  )
}

export default Course