import React, { useState, useEffect } from 'react';
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
  CardTitle,
  CardText,
  CardBody,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/Navbar';

import '../css/UserDashboard.css';
import Sidebar from '../components/Sidebar';

function UserDashboard() {
  const serverIP =
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_HEROKU_API
      : process.env.REACT_APP_API;
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postImages, setPostImages] = useState({});
  const [selectedImage, setSelectedImage] = useState({});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
    fetchUserBlogPosts();
    fetchUserInfo();
  }, [userId, navigate]);

  const fetchUserBlogPosts = async () => {
    try {
      const response = await fetch(`${serverIP}/posts/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();

        setBlogPosts(data);
        setPostImages(
          data.reduce((images, post) => {
            if (post.picture) {
              images[post._id] = `${serverIP}${post.picture.data}`;
            }
            return images;
          }, {})
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserInfo = async () => {
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
        console.log(data);

        // assuming data.profileImage is the filename of the image
        const profileImage = `${serverIP}/user/${userId}/picture`;
        setUserInfo({
          ...data,
          profileImage,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = e => {
    setSelectedImage(e.target.files[0]);
  };

  const handleNewPost = async e => {
    e.preventDefault();

    let endpoint;
    let method;

    if (isEditing) {
      endpoint = `${serverIP}/posts/edit/${editingPostId}/user/${userId}`;
      method = 'PUT';
    } else {
      endpoint = `${serverIP}/posts/user/${userId}/create`;
      method = 'POST';
    }

    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('body', newPostBody);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch(endpoint, {
        method: method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // Refresh posts
        fetchUserBlogPosts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startEditPost = (postId, title, body) => {
    setIsEditing(true);
    setEditingPostId(postId);
    setNewPostTitle(title);
    setNewPostBody(body);
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col md="4">
            <Card>
              <CardBody>
                <h4>Welcome, {userInfo.username}</h4>
                <h5>Email: {userInfo.email}</h5>
                <img
                  className="img-fluid rounded-circle my-3"
                  src={userInfo.profileImage} // Use userInfo.profileImage instead of userInfo.picture
                  alt="user profile"
                />
                <Button color="primary" block>
                  Edit Profile
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <h2 className="mb-4">Your Blog Posts</h2>
            {blogPosts.map((post, index) => (
              <Card className="mb-4" key={index}>
                <CardBody>
                  <CardTitle tag="h5">{post.title}</CardTitle>
                  <CardText>{post.body}</CardText>
                  {post.image && (
                    <CardImg
                      top
                      width="100%"
                      src={`${serverIP}/posts/images/${post._id}`}
                      alt="post"
                    />
                  )}
                  <div className="text-right">
                    <Button
                      className="mt-3"
                      color="primary"
                      onClick={() =>
                        startEditPost(post._id, post.title, post.body)
                      }
                    >
                      Edit
                    </Button>{' '}
                    <Button className="mt-3" color="danger">
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
            <h2 className="mb-4">
              {isEditing ? 'Edit Post' : 'Add a New Blog Post'}
            </h2>
            <Form onSubmit={handleNewPost}>
              <FormGroup>
                <Label for="postTitle">Title</Label>
                <Input
                  type="text"
                  name="postTitle"
                  id="postTitle"
                  placeholder="Enter post title"
                  value={newPostTitle}
                  onChange={e => setNewPostTitle(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="postBody">Post Body</Label>
                <Input
                  type="textarea"
                  name="postBody"
                  id="postBody"
                  placeholder="Enter post body"
                  value={newPostBody}
                  onChange={e => setNewPostBody(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="postImage">Image</Label>
                <Input
                  type="file"
                  name="postImage"
                  id="postImage"
                  onChange={handleImageChange}
                />
              </FormGroup>
              <Button type="submit" block>
                Post
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDashboard;
