import React from 'react';
import { Container } from 'reactstrap';

/**
 * 
 * @returns If the user searches for an url inside this webpage which is not defined
 */
const NotFound = () => {
  return (
    <Container className="text-center">
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't seem to exist.</p>
    </Container>
  );
}

export default NotFound;