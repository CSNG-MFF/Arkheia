import { useState } from "react"
import { 
    Button,
    Form, 
    FormGroup, 
    Input,
    Label
} from "reactstrap"
const SimulationForm = () => {
    const [title, setTitle] = useState('')
    const [number, setNumber] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const simulation = {title, number}

        const response = await fetch('/simulation_runs', {
            method: 'POST',
            body: JSON.stringify(simulation),
            headers: {
                'Content-Type' : 'application/json'
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }

        if (response.ok) {
            setNumber('')
            setTitle('')
            setError(null)
            console.log('new simulation added')
        }
    }
    return (
        <Form className="create" onSubmit={handleSubmit}>
            <FormGroup>
                <Label>Add new simulation</Label>
                <Label>Title:</Label>
                <Input 
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}/>

                <Label>Number:</Label>
                <Input 
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                value={number}/>
            </FormGroup>
            <Button>Add Simulation</Button>
            {error && <div className="error">{error}</div>}
        </Form>
    )
}

export default SimulationForm