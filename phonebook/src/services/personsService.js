import axios from 'axios';

const baseUrl = '/api/persons';

const getAll = () => axios.get(baseUrl).then(res => res.data);
const addPerson = (newPerson) => axios.post(baseUrl, newPerson).then(res => res.data);
const updatePerson = (id, updatedPerson) => axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data);
const deletePerson = (id) => axios.delete(`${baseUrl}/${id}`);

export default {
  getAll,
  addPerson,
  updatePerson,
  deletePerson,
};
