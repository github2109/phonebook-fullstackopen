const { request, response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname,'./build')))
morgan.token('person',(request) => JSON.stringify(request.body))
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
app.use(cors());
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response) => {
    response.json(persons);
});
app.get('/info',(request,response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>`);
})
app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if(!person){
        response.status(404).end();
    }else{
        response.json(person);
    }
})
app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end()
})
app.post('/api/persons',(request,response) => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
    const person = request.body;
    if(persons.find(ps=> ps.name === person.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    person.id = maxId + 1;
    persons = persons.concat(person);
    response.json(person);
})
const PORT = process.env.PORT || 3001;  
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
})