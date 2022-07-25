const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const app = express();
const Person = require("./models/person");
app.use(express.static(path.join(__dirname, "./build")));
morgan.token("person", (request) => JSON.stringify(request.body));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
app.use(cors());
// let persons = [
//     {
//       "id": 1,
//       "name": "Arto Hellas",
//       "number": "040-123456"
//     },
//     {
//       "id": 2,
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523"
//     },
//     {
//       "id": 3,
//       "name": "Dan Abramov",
//       "number": "12-43-234345"
//     },
//     {
//       "id": 4,
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122"
//     }
// ]

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>`);
  });
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((err) => console.log(err));
});
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(() => {
    response.status(204).end();
  });
});
app.put("/api/persons/:id", (request, response) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((person) => response.json(person))
    .catch((err) => console.log(err));
});
app.post("/api/persons", (request, response) => {
  //   const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  //   if (persons.find((ps) => ps.name === person.name)) {
  //     return response.status(400).json({
  //       error: "name must be unique",
  //     });
  //   }
  //   person.id = maxId + 1;
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
