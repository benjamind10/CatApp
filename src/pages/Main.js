import React, { useState } from 'react';
import { Container, Input, FormGroup, Table, Row, Col } from 'reactstrap';
import { fetchBreeds, fetchRandomBreed } from '../api';
import Navigation from '../components/Navbar';
import CustomButton from '../components/CustomButton';

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

  const handleFetchRandomBreed = async () => {
    try {
      const randomBreed = await fetchRandomBreed();
      setBreeds([randomBreed]);
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
          <Row className="justify-content-center">
            <Col xs="auto">
              <CustomButton color="primary" onClick={handleFetchBreed}>
                Search
              </CustomButton>
            </Col>
            <Col xs="auto">
              <CustomButton color="secondary" onClick={handleFetchRandomBreed}>
                Random Breed
              </CustomButton>
            </Col>
          </Row>
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
