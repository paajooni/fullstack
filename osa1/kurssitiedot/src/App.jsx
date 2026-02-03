const Header = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Kurssi on {props.course}
      </p>
    </div>
  )
}
  

const Part = (props) => {
  return (
    <div>
      <p>
        {props.osa}, tehtäviä on {props.tehtavamaara}
      </p>
    </div>
  )
}


const Content = ({parts}) => {
  console.log({parts})
  return (
    <div>
      <Part osa = {parts[0].name} tehtavamaara = {parts[0].exercises} />
      <Part osa = {parts[1].name} tehtavamaara = {parts[1].exercises} />
      <Part osa = {parts[2].name} tehtavamaara = {parts[2].exercises} />
    </div>
  )
}

  
const Total = ({parts}) => {
  return (
    <div>
      <p>
      Yhteensä tehtäviä on {parts[0].exercises + parts[1].exercises + parts[2].exercises}
      </p>
    </div>
  )
}
  

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course = {course.name} />
      <Content parts={course.parts} />
      <Total parts = {course.parts}/>
    </div>
  )
}

export default App