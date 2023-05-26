import React, { useEffect, useState } from 'react';
import { Container, FormGroup, Row, Col, Alert } from 'reactstrap';
import Autosuggest from 'react-autosuggest';

import { fetchBreeds, fetchBreedImages, fetchRandomImages } from '../api';
import Navigation from '../components/Navbar';
import CustomButton from '../components/CustomButton';

import '../css/Image.css';

function Images() {
  const [breedInput, setBreedInput] = useState('');
  const [allBreeds, setAllBreeds] = useState([]);
  const [selectedBreedImages, setSelectedBreedImages] = useState([]);
  const [noBreedFound, setNoBreedFound] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadAllBreeds = async () => {
      const breeds = await fetchBreeds();
      setAllBreeds(breeds);
    };

    loadAllBreeds();
  }, []);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, allBreeds));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value, breeds) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : breeds.filter(breed => breed.name.toLowerCase().includes(inputValue));
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const renderSuggestion = suggestion => <div>{suggestion.name}</div>;

  const handleInputChange = (event, { newValue }) => {
    setBreedInput(newValue || '');
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

  const inputProps = {
    placeholder: 'Enter breed...',
    value: breedInput,
    onChange: handleInputChange,
  };

  const theme = {
    input: 'form-control mb-3',
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Images</h1>
        <FormGroup className="mb-3">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={theme}
            onSuggestionSelected={(
              event,
              {
                suggestion,
                suggestionValue,
                suggestionIndex,
                sectionIndex,
                method,
              }
            ) => {
              event.preventDefault();

              setBreedInput(suggestionValue);
            }}
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
