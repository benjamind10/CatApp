import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap';
import Navigation from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import '../css/Profile.css';

function UserProfile() {
  const serverIP =
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_HEROKU_API
      : process.env.REACT_APP_API;
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
    fetchUserInfo();
  }, [userId, navigate]);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${serverIP}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        data.interests = data.interests.join(',').trim();
        data.favoriteBreeds = data.favoriteBreeds.join(',').trim();
        setUserInfo(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = event => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    try {
      if (
        !userInfo.username.trim() ||
        !userInfo.email.trim() ||
        !userInfo.age.trim() ||
        !userInfo.description.trim() ||
        !userInfo.interests.trim() ||
        !userInfo.favoriteBreeds.trim()
      ) {
        alert('All fields are required.');
        return;
      }

      const updatedUserInfo = {
        ...userInfo,
        favoriteBreeds: Array.isArray(userInfo.favoriteBreeds)
          ? userInfo.favoriteBreeds
          : userInfo.favoriteBreeds.split(',').map(item => item.trim()),
        interests: Array.isArray(userInfo.interests)
          ? userInfo.interests
          : userInfo.interests.split(',').map(item => item.trim()),
      };

      const response = await fetch(`${serverIP}/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setUserInfo(data);
        setIsEditing(false);
        fetchUserInfo();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Navigation />
      <Container className="Profile">
        <Row>
          <Col md="6">
            <h2>Your Profile</h2>
            <Form>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  value={userInfo.username || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={userInfo.email || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="age">Age</Label>
                <Input
                  type="number"
                  name="age"
                  id="age"
                  value={userInfo.age || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={userInfo.description || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="interests">Interests</Label>
                <Input
                  type="textarea"
                  name="interests"
                  id="interests"
                  value={userInfo.interests || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="favoriteBreeds">Favorite Breeds</Label>
                <Input
                  type="textarea"
                  name="favoriteBreeds"
                  id="favoriteBreeds"
                  value={userInfo.favoriteBreeds || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="currentPets">Current Pets</Label>
                <Input
                  type="textarea"
                  name="currentPets"
                  id="currentPets"
                  value={userInfo.currentPets || ''}
                  readOnly={!isEditing}
                  onChange={handleChange}
                />
              </FormGroup>
              {isEditing ? (
                <Button onClick={handleSave}>Save</Button>
              ) : (
                <Button onClick={handleEdit}>Edit Profile</Button>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserProfile;

// const displayPets = () => {
//   if (!userInfo.currentPets || userInfo.currentPets.length === 0) {
//     return <p>User has no pets</p>;
//   }
//
//   return userInfo.currentPets.map((pet) => (
//       <Card key={pet.id}>
//         <CardBody>
//           <CardTitle tag="h5">{pet.name}</CardTitle>
//           <CardText>{pet.description}</CardText>
//         </CardBody>
//       </Card>
//   ));
// };
