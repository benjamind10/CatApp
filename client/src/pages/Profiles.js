import React, { useEffect, useState } from 'react';
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  Navbar,
} from 'reactstrap';

import Navigation from '../components/Navbar';

const serverIP =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_HEROKU_API
    : process.env.REACT_APP_API;

function Profiles() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${serverIP}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();

        const usersWithImages = data.map(user => {
          const profileImage = `${serverIP}/user/${user._id}/picture`;
          return { ...user, profileImage };
        });

        setUsers(usersWithImages);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log(users);

  return (
    <>
      <Navigation />
      <Container className="mt-5">
        <Row>
          {users.map((user, index) => (
            <Col sm="6" lg="4" xl="3" key={index} className="mb-4">
              <Card>
                <CardImg top src={user.profileImage} alt="User profile" />
                <CardBody>
                  <CardTitle tag="h5">{user.username}</CardTitle>
                  <CardText>Email: {user.email}</CardText>
                  <CardText>Description: {user.description}</CardText>
                  <CardText>Interests: {user.interests.join(', ')}</CardText>
                  <CardText>
                    Favorite Breeds: {user.favoriteBreeds.join(', ')}
                  </CardText>
                  <CardText>
                    Current Pets: {user.currentPets.join(', ')}
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Profiles;
