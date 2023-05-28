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
  const [likeUsernames, setLikeUsernames] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUsername = async userId => {
      const response = await fetch(`${serverIP}/user/${userId}`);
      const data = await response.json();
      return data.username;
    };

    const fetchLikeUsernames = async () => {
      const newLikeUsernames = {};
      for (const post of posts) {
        newLikeUsernames[post._id] = [];
        for (const userId of post.likes) {
          const username = await fetchUsername(userId);
          newLikeUsernames[post._id].push(username);
        }
      }
      setLikeUsernames(newLikeUsernames);
    };

    fetchLikeUsernames();
  }, [posts]);

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

      setComment('');
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsername = async userId => {
    try {
      const response = await fetch(`${serverIP}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.username;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            {' '}
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
                  {/* <Button
                    color="secondary"
                    onClick={() => handleDislike(post._id)}
                  >
                    Dislike
                  </Button> */}
                </div>
                {likeUsernames[post._id] &&
                  likeUsernames[post._id].length > 0 && (
                    <div className="d-flex flex-column align-items-center">
                      <h6>Users who liked this post:</h6>
                      {likeUsernames[post._id].map((username, index) => (
                        <p key={index}>{username}</p>
                      ))}
                    </div>
                  )}
                <div className="d-flex flex-column align-items-center">
                  <h6>Comments:</h6>
                  {post.comments.map((comment, index) => (
                    <CardText key={index}>
                      {comment.body} - {comment.username}
                    </CardText>
                  ))}
                </div>
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
        </Row>
      </Container>
    </>
  );
}

export default BlogPosts;
