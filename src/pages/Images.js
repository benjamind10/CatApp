// InfoPage.js
import React, { useEffect, useState } from 'react';
import { Container, Input, FormGroup, Row, Col } from 'reactstrap';
import { fetchBreeds, fetchBreedImages, fetchRandomImages } from '../api';
import Navigation from '../components/Navbar';
import CustomButton from '../components/CustomButton';

import '../css/Image.css';

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

  const handleFetchRandomImages = async () => {
    try {
      const images = await fetchRandomImages(10); // get 10 random images
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
          <Row className="d-flex justify-content-around align-items-center button-row">
            <Col xs={12} sm={5}>
              <CustomButton
                color="primary"
                onClick={handleFetchBreedImages}
                block
              >
                Search
              </CustomButton>
            </Col>
            <Col xs={12} sm={5}>
              <CustomButton
                color="secondary"
                onClick={handleFetchRandomImages}
                block
              >
                Get 10 random images
              </CustomButton>
            </Col>
          </Row>
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
