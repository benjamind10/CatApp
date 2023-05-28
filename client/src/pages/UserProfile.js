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
  Card,
  CardBody,
} from 'reactstrap';
import Navigation from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import '../css/Profile.css';
import axios from 'axios';

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
  const [selectedImage, setSelectedImage] = useState(null);

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

        if (selectedImage) {
          handleImageUpload(); // handle image upload
        } else {
          fetchUserInfo(); // update user info
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('picture', selectedImage);

      const response = await fetch(`${serverIP}/user/${userId}/picture`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        alert('Image uploaded successfully');
        fetchUserInfo();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = e => {
    setSelectedImage(e.target.files[0]);
  };

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Navigation />
      <Container className="Profile my-5">
        <Row>
          <Col md="4">
            <Card>
              <CardBody>
                <img
                  src={
                    userInfo.picture
                      ? `${serverIP}/user/${userId}/picture`
                      : 'DEFAULT_IMAGE_URL'
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle mb-4"
                />
                <h2 className="mb-4">{userInfo.username}</h2>
                {isEditing ? (
                  <Button color="primary" block onClick={handleSave}>
                    Save Changes
                  </Button>
                ) : (
                  <Button color="secondary" block onClick={handleEdit}>
                    Edit Profile
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <CardBody>
                <Form>
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
                  {isEditing && (
                    <FormGroup>
                      <Label for="profilePicture">Profile Picture</Label>
                      <Input
                        type="file"
                        name="profilePicture"
                        id="profilePicture"
                        onChange={handleImageChange}
                      />
                    </FormGroup>
                  )}
                </Form>
              </CardBody>
            </Card>
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
