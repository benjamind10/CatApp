import React, { useEffect, useState } from 'react';
import { Container, Input, FormGroup, Row, Col, Alert } from 'reactstrap';
import { fetchBreeds, fetchBreedImages, fetchRandomImages } from '../api';
import Navigation from '../components/Navbar';
import CustomButton from '../components/CustomButton';

import '../css/Image.css';

function Images() {
  const [breedInput, setBreedInput] = useState('');
  const [allBreeds, setAllBreeds] = useState([]);
  const [selectedBreedImages, setSelectedBreedImages] = useState([]);
  const [noBreedFound, setNoBreedFound] = useState(false);

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
      setNoBreedFound(true);
      return;
    }

    try {
      const images = await fetchBreedImages(breed.id);
      setNoBreedFound(false);
      setSelectedBreedImages(images);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchRandomImages = async () => {
    try {
      const images = await fetchRandomImages(10); // get 10 random images
      setNoBreedFound(false);
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
          <Row className="justify-content-center">
            <Col xs="auto">
              <CustomButton color="primary" onClick={handleFetchBreedImages}>
                Search
              </CustomButton>
            </Col>
            <Col xs="auto">
              <CustomButton color="secondary" onClick={handleFetchRandomImages}>
                Random Images
              </CustomButton>
            </Col>
          </Row>
          {noBreedFound && (
            <Alert color="danger" className="mt-2">
              No breed found
            </Alert>
          )}
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
