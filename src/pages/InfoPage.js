// InfoPage.js
import React, { useEffect, useState } from 'react';
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { fetchBreed, fetchBreeds } from '../api';
import Navigation from '../components/Navbar';

function InfoPage() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);

  useEffect(() => {
    const getBreeds = async () => {
      const data = await fetchBreeds();
      setBreeds(data);
    };

    getBreeds();
  }, []);

  const handleFetchBreed = async breedId => {
    try {
      const data = await fetchBreed(breedId);
      setSelectedBreed(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Info Page</h1>
        <ListGroup>
          {breeds.map((breed, index) => (
            <ListGroupItem key={index}>
              {breed.name}
              <Button
                color="primary"
                onClick={() => handleFetchBreed(breed.id)}
                className="ml-2"
              >
                Show Details
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
        {selectedBreed && <p>{JSON.stringify(selectedBreed)}</p>}
      </Container>
    </>
  );
}

export default InfoPage;
