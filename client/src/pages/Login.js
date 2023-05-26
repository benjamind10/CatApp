import React, { useState, useContext } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/Navbar';
import { UserContext } from '../context/UserContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async e => {
    e.preventDefault();

    const data = { username, password };

    try {
      const serverIP =
        process.env.NODE_ENV === 'production'
          ? process.env.REACT_APP_HEROKU_API
          : process.env.REACT_APP_API;

      const response = await fetch(`${serverIP}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // Login successful, redirect to home page
        const data = await response.json();

        // Get the token from the response
        const token = data.token;

        if (token) {
          login(token);
          // Navigate to the home page or dashboard
        } else {
          // Show error message
          console.log('Error with token!');
        }

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Log In</Button>
        </Form>
      </Container>
    </>
  );
}

export default LoginForm;
