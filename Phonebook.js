const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('personname', function (res) { return res.body.name })
morgan.token('personnumber', function (res) { return res.body.number })

app.use(morgan(function (tokens, req, res) {
    return [      
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        '{"name":"', tokens['personname'](req), '","',
        '"number":"', tokens['personnumber'](req), '"}'
        ].join(' ')
    }))

let persons = [
   {
            name: "Artos Hellos",
            number: "040-123456",
            id:1
        },
   {
            name: "Ada Lovelace",
            number: "39-44-5323523",
            id:2
        },
   {
            name: "Dan Abramov",
            number: "12-43-234345",
            id:1
        },
   {
            name: "Mary Poppendick",
            number: "39-23-6423122",
            id:4
    },
        {
            name: "Abhay Desai",
            number: "11-22-3334444",
            id:5
    }
]

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/info',(request,response) => {
    response.send('Phonebook has info for ' +  persons.length + ' people <p />' + new Date())    
})

app.get('/api/persons/:id',(request,response) => {
    const personId = Number(request.params.id)
    const person = persons.find(person => person.id === personId)

    if (person)
    {        
        response.json(person)
    }
    else
    {        
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response) => {
    const personId = Number(request.params.id)

    persons = persons.filter(person => person.id !== personId)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body

    if (!body.name)
    {
        return response.status(404).json({
            error: 'person name missing'            
        })
    }
    
    if (!body.number)
    {
        return response.status(404).json({
            error: 'person number missing'            
        })
    }

    // console.log(persons)
    // console.log(body.name)

    const isNameExists = persons.find(person => person.name === body.name)
    if (isNameExists)
    {
        return response.status(409).json({
            error:'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 101)
    }

    persons.concat(person)

    response.json(person)    
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})