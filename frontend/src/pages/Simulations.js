import { useEffect, useState } from "react"

import SimulationDetail from "../components/SimulationDetails"

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

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
      
      <Table
      bordered
      hover
      size="sm"
      >
        <thead>
          <tr>
            <th id="SubmissionDate">
              Submission date	
            </th>
            <UncontrolledTooltip
              target="SubmissionDate"
            >
              The date when the the simulation run was submitted to the repository.
            </UncontrolledTooltip>
            <th id="RunDate">
              Run date	
            </th>
            <UncontrolledTooltip
              target="RunDate"
            >
              The date when the simulation was ran.
            </UncontrolledTooltip>
            <th id="RunName">
              Run name	
            </th>
            <UncontrolledTooltip
              target="RunName"
            >
              The name given to the simulation instance.
            </UncontrolledTooltip>
            <th id="ModelName">
              Model name
            </th>
            <UncontrolledTooltip
              target="ModelName"
            >
              The name of the model that was simulated.
            </UncontrolledTooltip>
            <th id="ModelDescription">
              View model description
            </th>
            <UncontrolledTooltip
              target="ModelDescription"
            >
              Click the 'idk yet' icon to inspect the description of the model that was simulated.
            </UncontrolledTooltip>
            <th id="Parameters">
              View parameters	
            </th>
            <UncontrolledTooltip
              target="Parameters"
            >
              Click the 'idk yet' icon to inspect the full parametrization of the given simulation run.
            </UncontrolledTooltip>
            <th id="Stimuli">
              View stimuli
            </th>
            <UncontrolledTooltip
              target="Stimuli"
            >
              Click the 'idk yet' icon to inspect the stimuli that were shown during the given simulation run.
            </UncontrolledTooltip>
            <th id="ExperimentalProtocols">
              View experimental protocols
            </th>
            <UncontrolledTooltip
              target="ExperimentalProtocols"
            >
              Click the 'idk yet' icon to inspect the experimental protocols that were performed over the model during the given simulation run.
            </UncontrolledTooltip>
            <th id="Results">
              View results
            </th>
            <UncontrolledTooltip
              target="Results"
            >
              Click the 'idk yet' icon to inspect the results (figures) generated during the given simulation run.
            </UncontrolledTooltip>
            <th id="Download">
              Download simulation run
            </th>
            <UncontrolledTooltip
              target="Download"
            >
              Click the 'idk yet' icon to download one simulation run from the table
            </UncontrolledTooltip>
            <th id="Delete">
              Delete simulation run
            </th>
            <UncontrolledTooltip
              target="Delete"
            >
              Click the 'idk yet' icon to delete one simulation run from the table
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>
          {simulations && simulations.map((simulation) => (
            <SimulationDetail key={simulation._id} simulation={simulation} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Simulations