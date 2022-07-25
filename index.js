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
app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});
app.get("/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toUTCString()}</p>`);
    })
    .catch((error) => next(error));
});
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response) => {
  const person = {
    name: request.body.name,
    number: request.body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
  })
    .then((person) => response.json(person))
    .catch((err) => console.log(err));
});
app.post("/api/persons", (request, response, next) => {
  const person = new Person({
    name: request.body.name,
    number: request.body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});
app.use((request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
});
app.use((error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
