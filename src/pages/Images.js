// InfoPage.js
import React, { useEffect, useState } from 'react';
import { Container, Button, Input, FormGroup } from 'reactstrap';
import { fetchBreeds, fetchBreedImages } from '../api';
import Navigation from '../components/Navbar';

function Images() {
  const [breedInput, setBreedInput] = useState('');
  const [allBreeds, setAllBreeds] = useState([]);
  const [selectedBreedImages, setSelectedBreedImages] = useState([]);

  useEffect(() => {
    const loadAllBreeds = async () => {
      const breeds = await fetchBreeds();
      setAllBreeds(breeds);
    };

    loadAllBreeds();
  }, []);

  const handleInputChange = event => {
    setBreedInput(event.target.value);
  };

  const handleFetchBreedImages = async () => {
    const breed = allBreeds.find(
      breed => breed.name.toLowerCase() === breedInput.toLowerCase()
    );
    if (!breed) {
      console.error('Breed not found');
      return;
    }

    try {
      const images = await fetchBreedImages(breed.id);
      setSelectedBreedImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Images</h1>
        <FormGroup className="mb-3">
          <Input
            className="mb-3"
            placeholder="Enter breed..."
            value={breedInput}
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleFetchBreedImages}>
            Search
          </Button>
        </FormGroup>
        {selectedBreedImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt="Breed"
            style={{ width: '50%', height: 'auto' }}
          />
        ))}
      </Container>
    </>
  );
}

export default Images;
