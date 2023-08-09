const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")
require("dotenv").config()

const PORT = process.env.PORT || 3001

app.use(express.static("build"))

app.use(express.json())

morgan.token("request-body", (req, res) => JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :request-body"))

app.use(cors())

const mongo = require("./mongo")

app.get("/api/people", (request, response, next) => {
  mongo.get_people()
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.get("/info", (request, response, next) => {
  mongo.get_people_count().then(result => {
    let info = `Phonebook has info for ${result} people\n\n`

    const date = new Date()
    info += date.toString()

    response.send(info)
  }).catch(error => next(error))
})

app.get("/api/people/:id", (request, response, next) => {
  const id = request.params.id
  
  mongo.get_person(id).then(result => {
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete("/api/people/:id", (request, response, next) => {
  const id = request.params.id

  mongo.delete_person(id)
    .then(() => {response.status(204).end()})
    .catch(error => next(error))
})

app.post("/api/people", (request, response, next) => {
  mongo.get_people().then(result => {
    let person = {name: request.body.name, number: request.body.number}

    /*if (typeof content.name !== "string" || content.name === "") {
      return response.status(400).send("{ error: 'Invalid name' }")
    } else {
      person.name = content.name
    }*/

    if (result.find(p => p.name === person.name)) {
      return response.status(400).send("{ error: 'Name already exists' }")
    }

    /*if (typeof content.number !== "string" || content.number === "") {
      return response.status(400).send("{ error: 'Invalid number' ")
    } else {
      person.number = content.number
    }*/

    mongo.add_person(person)
      .then(new_person => {response.send(new_person)})
      .catch(error => next(error))
  })
})

app.put("/api/people/:id", (request, response, next) => {
  const id = request.params.id
  const body = request.body

  mongo.update_number(id, body)
    .then(result => {response.json(result)})
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send("{ error: 'Invalid id'}")
  } else if (error.name === "ValidationError") {
    return response.status(400).send(error.message)
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})