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
  Row,
  Col,
} from 'reactstrap';

import Navigation from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const serverIP =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_HEROKU_API
    : process.env.REACT_APP_API;

function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

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

  const handleCommentChange = e => {
    setComment(e.target.value);
  };

  const handleImageChange = e => {
    setSelectedImage(e.target.files[0]);
  };

  const handleLike = async postId => {
    if (!userId) {
      alert('You need to be logged in to like a post');
      return;
    }
    try {
      const response = await fetch(
        `${serverIP}/posts/${postId}/like?userId=${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDislike = async postId => {
    try {
      const response = await fetch(`${serverIP}/posts/${postId}/dislike`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddComment = async (postId, comment, username) => {
    if (!userId) {
      alert('You need to be logged in to add a comment');
      return;
    }

    try {
      const response = await fetch(`${serverIP}/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: comment,
          userId: userId,
          username: username,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setComment(''); // reset the comment field
      fetchPosts(); // refresh the posts to reflect the new comment
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
            <h1>All Blog Posts</h1>
            {posts.map((post, index) => (
              <Card className="mb-3" body key={index}>
                <CardTitle tag="h5">{post.title}</CardTitle>
                <CardText>{post.body}</CardText>
                <CardText className="text-muted font-italic small">
                  {post.user.username}
                </CardText>
                {post.picture && (
                  <img
                    src={`${serverIP}/posts/images/${post._id}`}
                    alt={post.title}
                  />
                )}
                <div className="d-flex justify-content-center my-3">
                  <Button
                    color="primary"
                    className="me-3"
                    onClick={() => handleLike(post._id)}
                  >
                    Like ({post.likes ? post.likes.length : 0})
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDislike(post._id)}
                  >
                    Dislike
                  </Button>
                </div>
                {/* Add comments section */}
                <h6>Comments:</h6>
                {post.comments.map((comment, index) => (
                  <CardText key={index}>
                    {comment.body} - {comment.username}
                  </CardText>
                ))}
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    handleAddComment(post._id, comment, username);
                  }}
                >
                  <FormGroup>
                    <Input
                      type="text"
                      name="comment"
                      id="comment"
                      placeholder="Add a comment"
                      value={comment}
                      onChange={handleCommentChange}
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
          </Col>
          <Col md="4">
            <Sidebar />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default BlogPosts;
