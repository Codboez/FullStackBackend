const express = require("express")
const app = express()
const PORT = 3001

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})