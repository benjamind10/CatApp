import React, { useState, useEffect, useContext } from 'react';
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
import Navigation from '../components/Navbar';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

import '../css/UserDashboard.css';

function UserDashboard() {
  const { userId } = useContext(UserContext); // Get userId from UserContext
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const serverIP = process.env.REACT_APP_API;
  const navigate = useNavigate();

  // Fetch user's blog posts when component mounts
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

  const handleNewPost = async e => {
    e.preventDefault();

    const data = { title: newPostTitle, body: newPostBody };

    try {
      const response = await fetch(`${serverIP}/posts/user/${userId}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col md="8">
            <h2>Your Blog Posts</h2>
            {blogPosts.map((post, index) => (
              <Card body key={index}>
                <CardTitle tag="h5">{post.title}</CardTitle>
                <CardText>{post.body}</CardText>
                {/* Here is where you can add buttons or any quick access controls for each post */}
                <div className="center-buttons">
                  <Button className="button-padding" color="primary">
                    Edit
                  </Button>
                  <Button className="button-padding" color="danger">
                    Delete
                  </Button>
                </div>
              </Card>
            ))}

            <h2>Add a New Blog Post</h2>
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
              <Button type="submit">Post</Button>
            </Form>
          </Col>
          <Col md="4">
            {/* This is a column for quick access buttons or controls */}
            <h2>Quick Actions</h2>
            <div className="center-buttons">
              <Button className="button-padding" color="primary" block>
                New Post
              </Button>
              <Button className="button-padding" color="info" block>
                Manage Posts
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserDashboard;
