import React, { useState, useEffect } from 'react';
import { Container, FormGroup, Table, Row, Col, Alert } from 'reactstrap';
import { fetchBreeds, fetchRandomBreed } from '../api';
import Navigation from '../components/Navbar';
import CustomButton from '../components/CustomButton';
import Autosuggest from 'react-autosuggest';

function Main() {
  const [breeds, setBreeds] = useState([]);
  const [breedInput, setBreedInput] = useState('');
  const [noBreedFound, setNoBreedFound] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [allBreeds, setAllBreeds] = useState([]);

  useEffect(() => {
    const loadBreeds = async () => {
      const breedsData = await fetchBreeds();
      setAllBreeds(breedsData);
    };
    loadBreeds();
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

  const handleFetchBreed = async () => {
    try {
      const breedData = allBreeds.find(
        breed => breed.name.toLowerCase() === breedInput.toLowerCase()
      );
      if (breedData) {
        setNoBreedFound(false);
        setBreeds([breedData]);
      } else {
        setNoBreedFound(true);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const handleFetchRandomBreed = async () => {
    try {
      const randomBreed = await fetchRandomBreed();
      setNoBreedFound(false);
      setBreeds([randomBreed]);
    } catch (error) {
      console.error(`Error: ${error}`);
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
        <h1 className="text-center my-3">Breed Information</h1>
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
          {noBreedFound && (
            <Alert color="danger" className="mt-2">
              No breed found
            </Alert>
          )}
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
