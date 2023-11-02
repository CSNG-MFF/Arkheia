import { useEffect, useState } from "react"

import SimulationDetail from "../components/SimulationDetails"
import SimulationForm from "../components/SimulationsForm"

const Simulations = () => {
    const [simulations, setSimulations] = useState(null)
    
    useEffect(() => {
        const fetchSimulations = async () => {
            const response = await fetch('/simulation_runs')
            const json = await response.json()

            if (response.ok) {
                setSimulations(json)
            }
        }

        fetchSimulations()
    }, [])

    return (
        <div className = "Simulations">
            <div className="simulations">
                {simulations && simulations.map((simulation) => (
                    <SimulationDetail key={simulation._id} simulation={simulation} />
                ))}
            </div>
            <SimulationForm/>
        </div>
    )
}

export default Simulations