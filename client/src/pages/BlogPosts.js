import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Card,
  CardTitle,
  CardText,
  FormGroup,
  Input,
  Form,
} from 'reactstrap';

import Navigation from '../components/Navbar';

const serverIP =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_HEROKU_API
    : process.env.REACT_APP_API;

function BlogPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${serverIP}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLike = postId => {
    // handle liking a post
    console.log('Liked post with id: ', postId);
  };

  const handleDislike = postId => {
    // handle disliking a post
    console.log('Disliked post with id: ', postId);
  };

  const handleAddComment = (postId, comment) => {
    // handle adding a comment to a post
    console.log('Add comment: ', comment, ' to post with id: ', postId);
  };

  return (
    <>
      <Navigation />
      <Container>
        <h1>All Blog Posts</h1>
        {posts.map((post, index) => (
          <Card body key={index}>
            <CardTitle tag="h5">{post.title}</CardTitle>
            <CardText>{post.body}</CardText>
            <CardText className="text-muted font-italic small">
              {post.user.username}
            </CardText>
            <div className="d-flex justify-content-center my-3">
              <Button
                color="primary"
                className="me-3"
                onClick={() => handleLike(post.id)}
              >
                Like
              </Button>
              <Button color="secondary" onClick={() => handleDislike(post._id)}>
                Dislike
              </Button>
            </div>
            <Form
              onSubmit={e => {
                e.preventDefault();
                handleAddComment(post._id, e.target.comment.value);
              }}
            >
              <FormGroup>
                <Input
                  type="text"
                  name="comment"
                  id="comment"
                  placeholder="Add a comment"
                />
              </FormGroup>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1rem',
                }}
              >
                <div className="d-flex justify-content-center">
                  <Button type="submit">Add Comment</Button>
                </div>
              </div>
            </Form>
          </Card>
        ))}
      </Container>
    </>
  );
}

export default BlogPosts;
