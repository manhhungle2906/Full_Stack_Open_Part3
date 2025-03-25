import { useState, useEffect } from 'react';
import personsService from './services/personsService';
import Filter from './components/filter';
import Persons from './components/persons';
import PersonForm from './components/personform';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('success'); // 'success' | 'error'

  useEffect(() => {
    personsService.getAll()
      .then(data => {
        setPersons(data);
      })
      .catch(error => {
        console.error('There was an error fetching the data:', error);
        showNotification('Failed to load contacts.', 'error');
      });
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
  
    const existingPerson = persons.find(person => person.name === newName);
  
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
  
      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        personsService
          .updatePerson(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p));
            showNotification(`Updated ${returnedPerson.name}`, 'success');
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Update failed:', error);
  
            // Show error message and remove from local state
            showNotification(`Information of ${newName} has already been removed from server`, 'error');
            setPersons(persons.filter(p => p.id !== existingPerson.id));
          });
  
        return;
      }
    }
  
    const newPerson = { name: newName, number: newNumber };
  
    personsService
      .addPerson(newPerson)
      .then(addedPerson => {
        setPersons([...persons, addedPerson]);
        showNotification(`Added ${addedPerson.name}`, 'success');
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Add failed:', error);
        showNotification(`Failed to add ${newName}`, 'error');
      });
  };
  

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name}?`);
    if (confirmDelete) {
      personsService.deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          showNotification(`Failed to delete ${name}.`, 'error');
          setPersons(persons.filter(person => person.id !== id)); // sync UI if already deleted
        });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson} 
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
