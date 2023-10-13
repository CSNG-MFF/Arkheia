import { useState } from "react"
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
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add new simulation</h3>
            <label>Title:</label>
            <input 
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}/>

            <label>Number:</label>
            <input 
            type="number"
            onChange={(e) => setNumber(e.target.value)}
            value={number}/>
            <button>Add Simulation</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default SimulationForm