import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

// Get all persons
const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

// Add a new person
const addPerson = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(response => response.data);
};

// Update a person's information (not used yet)
const updatePerson = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data);
};

// Delete a person
const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  addPerson,
  updatePerson,
  deletePerson,
};
