const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.MONGODB

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: n => { return /\d{2}-\d{8,}|\d{3}-\d{7,}/.test(n) },
      message: "Invalid phone number"
    }
  },
  id: Number
})

mongoose.connect(url)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model("Person", personSchema)

const add_person = (person) => {
  const new_person = Person(person)
  return new_person.save()
}

const get_people = () => {
  return Person.find({})
}

const delete_person = (id) => {
  return Person.findByIdAndRemove(id)
}

const get_people_count = () => {
  return Person.countDocuments({})
}

const get_person = (id) => {
  return Person.findById(id)
}

const update_number = (id, body) => {
  const new_person = { name: body.name, number: body.number }

  return Person.findByIdAndUpdate(id, new_person, { new: true })
}

module.exports = { get_people, add_person, delete_person, get_people_count, get_person, update_number }