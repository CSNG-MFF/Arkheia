import './../styles/documentation.css'

import {
  Button, 
  Row,
  Col,
  Card,
  CardTitle,
  CardText
} from 'reactstrap'

/**
 * 
 * @returns The main documentation page of Arkheia
 */
const Documentation = () => {
  return (
      <div className = "documentation">
        <Row>
          <Col>
            <h1 style={{ padding: 150, textAlign: 'center' }}>Arkheia Documentation</h1>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 20}}>
          <Col>
            <Card>
              <CardTitle tag="h1" className='buttonCardTitle'>
                Client
              </CardTitle>
              <CardText className='buttonCardText'>
                Guide on how to use the Arkheia web application.
              </CardText>
              <div className="d-flex justify-content-center">
                <Button href='/documentation/client' className='buttonButton' color='primary'>
                  Go
                </Button>
              </div>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardTitle tag="h1" className='buttonCardTitle'>
                API
              </CardTitle>
              <CardText className='buttonCardText'>
                The specification of the Arkheia document model.
              </CardText>
              <div className="d-flex justify-content-center">
                <Button href='/documentation/api' className='buttonButton' color='primary'>
                  Go
                </Button>
              </div>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardTitle tag="h1" className='buttonCardTitle'>
                Installation
              </CardTitle>
              <CardText className='buttonCardText'>
                Installation and deployment guide.
              </CardText>
              <div className="d-flex justify-content-center">
                <Button href='/documentation/installation' className='buttonButton' color='primary'>
                  Go
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
  )
}

export default Documentation