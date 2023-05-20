// Main.js
import React, { useState } from 'react';
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  CardImg,
  FormGroup,
  Input,
} from 'reactstrap';
import { fetchBreedImages, fetchRandomImage, fetchRandomImages } from '../api';
import Navigation from '../components/Navbar';

function Main() {
  const [output, setOutput] = useState([]);
  const [breedInput, setBreedInput] = useState('');

  const handleFetchRandomImage = async () => {
    const data = await fetchRandomImage();
    setOutput([data]);
  };

  const handleFetchRandomImages = async () => {
    const data = await fetchRandomImages();
    setOutput(data);
  };

  const handleFetchBreedImages = async () => {
    if (breedInput !== '') {
      const data = await fetchBreedImages(breedInput);
      setOutput(data);
    }
  };

  const handleInputChange = event => {
    setBreedInput(event.target.value);
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Main</h1>
        <FormGroup className="mb-3">
          <Input
            placeholder="Enter breed..."
            value={breedInput}
            onChange={handleInputChange}
          />
          <Button color="primary" onClick={handleFetchBreedImages}>
            Search
          </Button>
        </FormGroup>
        <Button
          color="primary"
          onClick={handleFetchRandomImage}
          className="m-1"
        >
          Fetch Random Image
        </Button>
        <Button
          color="secondary"
          onClick={handleFetchRandomImages}
          className="m-1"
        >
          Fetch 10 Random Images
        </Button>
        <Row>
          {output.map((data, index) => (
            <Col key={index} sm={6} md={4} lg={3} className="mb-4">
              <Card>
                <CardImg top width="100%" src={data.url} alt="Cat" />
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Main;
