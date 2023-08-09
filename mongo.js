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

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model("Person", personSchema)

const connect = () => {
    mongoose.set("strictQuery", false)
    return mongoose.connect(url).then(() => {
        console.log("connected")
    })
}

const add_person = (person) => {
    return connect().then(() => {
        const new_person = Person(person)
        return new_person.save().then(result => {
            mongoose.connection.close()
            return result
        })//.catch(() => false)
    })
}

const get_people = () => {
    return connect().then(() => {
        return Person.find({}).then(result => {
            mongoose.connection.close()
            return result
        })
    })
}

const delete_person = (id) => {
    return connect().then(() => {
        return Person.findByIdAndRemove(id).then(result => {
            mongoose.connection.close()
        })
    })
}

const get_people_count = () => {
    return connect().then(() => {
        return Person.countDocuments({}).then(result => {
            mongoose.connection.close()
            return result
        })
    })
}

const get_person = (id) => {
    return connect().then(() => {
        return Person.findById(id).then(result => {
            mongoose.connection.close()
            return result
        })
    })
}

const update_number = (id, body) => {
    const new_person = {name: body.name, number: body.number}

    return connect().then(() => {
        return Person.findByIdAndUpdate(id, new_person, {new: true}).then(result => {
            mongoose.connection.close()
            return result
        })
    })
}

module.exports = {get_people, add_person, delete_person, get_people_count, get_person, update_number}