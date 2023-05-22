import React from 'react';
import {
  Container,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from 'reactstrap';

import Navigation from '../components/Navbar';
import lunaImage from '../assets/luna.JPG';
import obiImage from '../assets/obi.jpeg';

function BlogPage() {
  return (
    <>
      <Navigation />
      <Container>
        <h1 className="text-center my-3">Our Cats</h1>
        <Card className="mb-4">
          <CardImg
            top
            style={{ width: '50%', height: 'auto', margin: '0 auto' }}
            src={lunaImage}
            alt="Luna the cat"
          />
          <CardBody>
            <CardTitle tag="h5">Luna</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Breed: Russian Blue / Calico
            </CardSubtitle>{' '}
            <CardText>
              Luna is a friendly and active cat who loves to play. She's
              particularly good at catching toys in the air and she's always up
              for a game of chase.
            </CardText>{' '}
          </CardBody>
        </Card>
        <Card>
          <CardImg
            top
            style={{ width: '50%', height: 'auto', margin: '0 auto' }}
            src={obiImage}
            alt="Obi the cat"
          />
          <CardBody>
            <CardTitle tag="h5">Obi</CardTitle>
            <CardSubtitle tag="h6" className="mb-2 text-muted">
              Breed: ???
            </CardSubtitle>{' '}
            <CardText>
              Obi is a more laid back cat. She prefers to spend his time
              lounging around and watching the world go by from the window sill.
              But don't let his relaxed nature fool you. She's always ready for
              a cuddle.
            </CardText>{' '}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default BlogPage;
