import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/Navbar';

function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    const data = { username, password, email };

    try {
      const serverIP = process.env.REACT_APP_API;

      const response = await fetch(`${serverIP}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        // You can perform actions on successful user creation here.
        console.log('User successfully created');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navigation />
      <Container>
        <h2>Sign Up</h2>
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
              required
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
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="text"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">Sign Up</Button>
        </Form>
      </Container>
    </>
  );
}

export default SignUpForm;
