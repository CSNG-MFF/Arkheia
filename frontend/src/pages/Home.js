import React from 'react';
import { Card, CardBody, CardTitle, Container } from 'reactstrap';
import { FaRegLightbulb } from 'react-icons/fa'; // Example icon, you can choose any

const Home = () => {
  return (
    <div className="home">
      <Container className="py-5">
        <Card style={{ paddingBottom: 100 }}>
          <CardBody style={{ paddingTop: 90 }} className="text-center">
            <CardTitle tag="h1" className="display-3">
              <FaRegLightbulb /> Welcome to Arkheia
            </CardTitle>
            <p className="lead">
              Dive into the depths of data and simulation results.
            </p>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Home;

