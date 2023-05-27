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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!userId) {
      navigate('/');
    }
    fetchUserBlogPosts();
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
    formData.append('image', selectedImage);

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
          <Col md="8">
            <h2>Your Blog Posts</h2>
            {blogPosts.map((post, index) => (
              <Card className="mb-3" body key={index}>
                <CardTitle tag="h5">{post.title}</CardTitle>
                <CardText>{post.body}</CardText>
                <img src={`${serverIP}${post.picture}`} alt="post" />
                <div className="center-buttons">
                  <Button
                    className="button-padding"
                    color="primary"
                    onClick={() =>
                      startEditPost(post._id, post.title, post.body)
                    }
                  >
                    Edit
                  </Button>
                  <Button className="button-padding" color="danger">
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
            <h2>{isEditing ? 'Edit Post' : 'Add a New Blog Post'}</h2>
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
              <Button type="submit">Post</Button>
            </Form>
          </Col>
          <Col md="4">
            {/* This is a column for quick access buttons or controls */}
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDashboard;
