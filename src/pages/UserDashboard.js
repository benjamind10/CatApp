import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import Navigation from '../components/Navbar';

function UserDashboard() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const serverIP = process.env.REACT_APP_API;

  // Fetch user's blog posts when component mounts
  useEffect(() => {
    fetchUserBlogPosts();
  }, []);

  const fetchUserBlogPosts = async () => {
    try {
      // Assume userId is known, replace it with actual userId
      const response = await fetch(`${serverIP}/user/posts/`, {
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
      // Assume userId is known, replace it with actual userId
      const response = await fetch(`${serverIP}/user/posts/`, {
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
        <h2>Your Blog Posts</h2>
        {blogPosts.map((post, index) => (
          <div key={index}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
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
      </Container>
    </>
  );
}

export default UserDashboard;
