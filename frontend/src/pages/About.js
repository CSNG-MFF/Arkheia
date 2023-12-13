import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardHeader } from 'reactstrap';
import { FaUniversity, FaBrain, FaChartArea, FaAtom } from 'react-icons/fa';

const About = () => {
  return (
    <Container className="about my-5">
      <Row className="justify-content-center">
        <Col md="8">
          <Card>
            <CardHeader className="text-center py-3">
              <h2>Unveiling the Mysteries of the Mind with Arkheia</h2>
            </CardHeader>
            <CardBody>
              <CardTitle tag="h4" className="text-center mb-4">
                Explore the Frontiers of Computational Neuroscience
              </CardTitle>
              <p className="text-justify">
                <FaAtom className="mr-2" /> Embark on a journey through the intricate labyrinths of the brain with <strong>Arkheia</strong>, 
                this web-based repository designed for the visualization of complex neural simulations. 
                Developed at the <strong>MFF UK</strong>, Arkheia leverages 
                the <strong>Mozaik framework</strong> to bring computational neuroscience to your fingertips.
              </p>
              <p className="text-justify">
                <FaBrain className="mr-2" /> Whether you're a seasoned researcher or an avid enthusiast, Arkheia offers an intuitive platform to delve into the vast ocean of data, uncovering patterns and insights that propel the frontiers of knowledge.
              </p>
              <p className="text-justify">
                <FaChartArea className="mr-2" /> Visualize the unseen. Explore simulation results with unparalleled clarity and ease, navigating through the complexities of neural networks as they come alive on your screen.
              </p>
              <p className="text-center mt-4">
                <FaUniversity className="mr-2" /> Proudly developed at <strong>MFF UK</strong> — Where innovation meets excellence.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
