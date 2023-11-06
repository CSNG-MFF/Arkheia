import {
  ButtonGroup,
  Button
} from 'reactstrap'

const Documentation = () => {
  return (
      <div className = "documentation">
        <ButtonGroup>
          <Button href='/documentation/client'>Client</Button>
          <Button href='/documentation/api'>API</Button>
          <Button href='/documentation/installation'>Installation</Button>
        </ButtonGroup>
      </div>
  )
}

export default Documentation