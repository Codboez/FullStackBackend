const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

const PORT = process.env.PORT || 3001

app.use(express.json())

morgan.token("request-body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :request-body"))

app.use(cors())

app.use(express.static("build"))

people = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get("/api/people", (request, response) => {
  response.json(people)
})

app.get("/info", (request, response) => {
  let info = `Phonebook has info for ${people.length} people\n\n`

  const date = new Date()
  info += date.toString()

  response.send(info)
})

app.get("/api/people/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/people/:id", (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()
})

app.post("/api/people", (request, response) => {
  const content = request.body
  let person = {name: "", number: "", id: -1}

  console.log(content.name)
  console.log(content.name === true)
  console.log(typeof content.name !== "string")
  console.log(typeof content.name)

  if (typeof content.name !== "string" || content.name === "") {
    return response.status(400).send("{ error: 'Invalid name' }")
  } else {
    person.name = content.name
  }

  if (people.find(p => p.name === person.name)) {
    return response.status(400).send("{ error: 'Name already exists' }")
  }

  if (typeof content.number !== "string" || content.number === "") {
    return response.status(400).send("{ error: 'Invalid number' ")
  } else {
    person.number = content.number
  }

  person.id = Math.floor(Math.random() * Math.pow(10, 9))

  people = people.concat(person)

  response.send(person)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})