const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
}) 

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons =[
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) =>{
    const date = new Date()
    res.send('<p>Phonebook has info for ' + persons.length + ' people</p>' +
    '<p>' + date + '</p>')
}) 

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)

    if(person){
        res.json(person)
    }else{
        res.sendStatus(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(per => per.id === id)
    persons = persons.filter(person => person.id !== id)
    res.sendStatus(204).end()
})

app.post('/api/persons', (req, res) =>{
     
    const person = req.body

    const per = persons.find(per => per.name === person.name)

    if(per || !person.name || !person.number){
        return res.status(400).json({
            error:"name must be unique"
        })
    }

    const id = Math.floor(Math.random() * 1000)
    person.id = String(id)

    persons = persons.concat(person)

    res.json(person)

       // console.log(morgan('tiny'))
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`PhonebookServer running on port ${port}`)
})