import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

import SimulationDetail from "../components/SimulationDetails"

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

const Simulations = () => {
  const location = useLocation();
  const parameter_search = location.state;
  const [simulations, setSimulations] = useState(null);

  const [runNameSearch, setRunNameSearch] = useState('');
  const [modelNameSearch, setModelNameSearch] = useState('');
    
  useEffect(() => {
    const fetchSimulations = async () => {
      if (parameter_search && parameter_search._id) {
        const response = await fetch(`/parameter_searches/${parameter_search._id}/simulations`);
        const json = await response.json();
        if (response.ok) {
          setSimulations(json);
        }
      } else {
        const response = await fetch('/simulation_runs')
        const json = await response.json()
        if (response.ok) {
          setSimulations(json)
        }
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
        <thead style={{ textAlign: 'center'}}>
          <tr>
            <th id="ViewAlone">
              View simulation alone
            </th>
            <UncontrolledTooltip
              target="ViewAlone"
            >
              View the simulation alone, with all of its information
            </UncontrolledTooltip>
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
              Click the eye icon to inspect the description of the model that was simulated.
            </UncontrolledTooltip>
            <th id="Parameters">
              View parameters	
            </th>
            <UncontrolledTooltip
              target="Parameters"
            >
              Click the eye icon to inspect the full parametrization of the given simulation run.
            </UncontrolledTooltip>
            <th id="Stimuli">
              View stimuli
            </th>
            <UncontrolledTooltip
              target="Stimuli"
            >
              Click the eye icon to inspect the stimuli that were shown during the given simulation run.
            </UncontrolledTooltip>
            <th id="ExperimentalProtocols">
              View experimental protocols
            </th>
            <UncontrolledTooltip
              target="ExperimentalProtocols"
            >
              Click the eye icon to inspect the experimental protocols that were performed over the model during the given simulation run.
            </UncontrolledTooltip>
            <th id="Results">
              View results
            </th>
            <UncontrolledTooltip
              target="Results"
            >
              Click the eye icon to inspect the results (figures) generated during the given simulation run.
            </UncontrolledTooltip>
            <th id="Delete">
              Delete simulation run
            </th>
            <UncontrolledTooltip
              target="Delete"
            >
              Click the eye icon to delete one simulation run from the table
            </UncontrolledTooltip>
          </tr>
          <tr>
            <th colSpan={3}></th> {/* Empty for 'View Alone' */}
            <th>
              <input
                type="text"
                placeholder="Search Run Name"
                value={runNameSearch}
                onChange={(e) => setRunNameSearch(e.target.value)}
              />
            </th>
            <th>
              <input 
                type="text"
                placeholder="Search Model Name"
                value={modelNameSearch}
                onChange={(e) => setModelNameSearch(e.target.value)}
              />
            </th>
            <th colSpan={7}></th>
          </tr>
        </thead>
        <tbody>
          {simulations && simulations.filter((simulation) => (
             simulation.simulation_run_name.toLowerCase().includes(runNameSearch.toLowerCase()) &&
             simulation.model_name.toLowerCase().includes(modelNameSearch.toLowerCase())
           )).map((simulation) => (
              <SimulationDetail key={simulation._id} simulation={simulation} />
           ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Simulations