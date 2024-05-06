import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardHeader } from 'reactstrap';
import { FaUniversity, FaAtom } from 'react-icons/fa';

const About = () => {
  return (
    <Container className="about my-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card>
            <CardHeader className="text-center py-3">
              <h2>Arkheia</h2>
            </CardHeader>
            <CardBody>
              <CardTitle tag="h4" className="text-center mb-4">
                Cooperation with the Computational Systems Neuroscience Group (CSNG)
              </CardTitle>
              <p className="text-justify">
                <FaAtom className="mr-2" /> <strong>Arkheia</strong> is a  web-based repository designed for the visualization of complex neural simulations. 
                Developed at the <strong>MFF UK</strong>, Arkheia leverages 
                the <strong>Mozaik framework</strong> to save the simulations and parameter searches generated. 
              </p>
              <p className="text-center mt-4">
                <FaUniversity className="mr-2" /> Developed at <strong>MFF UK</strong>
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
