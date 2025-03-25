const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
];

// GET all
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Info page
app.get('/info', (req, res) => {
  const count = persons.length;
  const time = new Date();
  res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `);
});

// GET by ID
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// DELETE by ID
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const index = persons.findIndex(p => p.id === id);

  if (index !== -1) {
    persons.splice(index, 1);
    console.log(`Deleted person with id ${id}`);
    res.status(204).end();
  } else {
    res.status(404).send({ error: 'Person not found' });
  }
});

// POST new person
app.post('/api/persons', (req, res) => {
  const body = req.body;

  // Validate presence of name and number
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name and number are required' });
  }

  // Check for duplicate name (case-insensitive)
  const nameExists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase());
  if (nameExists) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  // Create and add new person
  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  };

  persons.push(newPerson);
  res.status(201).json(newPerson);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
