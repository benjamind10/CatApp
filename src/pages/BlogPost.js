import React, { useState } from 'react';
import { Button, Container, Form, FormGroup, Label, Input } from 'reactstrap';

function BlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = event => {
    setTitle(event.target.value);
  };

  const handleContentChange = event => {
    setContent(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Here you would typically send the post data to your server
    console.log('Title: ', title);
    console.log('Content: ', content);
  };

  return (
    <Container>
      <h1>Post a Blog</h1>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="content">Content</Label>
          <Input
            type="textarea"
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          />
        </FormGroup>
        <Button type="submit">Post</Button>
      </Form>
    </Container>
  );
}

export default BlogPost;
