// MainPage.js
import React, { useState } from 'react';
import { Container, Button, Input, FormGroup, Table } from 'reactstrap';
import { fetchBreeds } from '../api';
import Navigation from '../components/Navbar';

function Main() {
  const [breeds, setBreeds] = useState([]);
  const [breedInput, setBreedInput] = useState('');

  const handleInputChange = event => {
    setBreedInput(event.target.value);
  };

  const handleFetchBreed = async () => {
    try {
      const allBreeds = await fetchBreeds();
      const breedData = allBreeds.find(
        breed => breed.name.toLowerCase() === breedInput.toLowerCase()
      );
      setBreeds([breedData]);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Breed Information</h1>
        <FormGroup className="mb-3">
          <Input
            className="mb-3"
            placeholder="Enter breed..."
            value={breedInput}
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleFetchBreed}>
            Search
          </Button>
        </FormGroup>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Origin</th>
            </tr>
          </thead>
          <tbody>
            {breeds.map((breed, index) => (
              <tr key={index}>
                <td>{breed.name}</td>
                <td>{breed.description}</td>
                <td>{breed.origin}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Main;
