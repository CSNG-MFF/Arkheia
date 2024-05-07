import { useEffect, useState } from "react"

import ParameterSearchDetail from "../components/ParameterSearchDetail"

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

/**
 * 
 * @returns The parameter searches uploaded to the website
 */
const ParameterSearch = () => {
  // Controls the parameter search
  const [parameterSearch, setParameterSearches] = useState(null);
    
  // The input for the name search
  const [runNameSearch, setRunNameSearch] = useState('');

  // The input for the model name search
  const [modelNameSearch, setModelNameSearch] = useState('');
  
  // Fetches the parmaeter searches
  useEffect(() => {
    const fetchParameterSearches = async () => {
      const response = await fetch('/parameter_searches')
      const json = await response.json()
      if (response.ok) {
        setParameterSearches(json)
      }
    }

    fetchParameterSearches()
  }, [])
  return (
      <div className = "ParameterSearch">
      <Table
        bordered
        hover
        size="sm"
      >
        <thead style={{ textAlign: 'center'}}>
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
              Name	
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
            <th id="View">
              View individual runs
            </th>
            <UncontrolledTooltip
              target="View"
            >
              Click the eye icon to inspect individual runs of the parameter search
            </UncontrolledTooltip>
            <th id="Inspect">
              Inspect results
            </th>
            <UncontrolledTooltip
              target="Inspect"
            >
              Click the eye icon to perform parameter dependent interactive inspection of the parameter search results
            </UncontrolledTooltip>
            <th id="Delete">
              Delete parameter search
            </th>
            <UncontrolledTooltip
              target="Delete"
            >
              Click the trash icon to delete one parameter search from the table
            </UncontrolledTooltip>
          </tr>
          <tr>
            <th colSpan={2}></th>
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
            <th colSpan={3}></th>
          </tr>
        </thead>
        <tbody>
          {parameterSearch && parameterSearch.filter((parameter_search) => (
            parameter_search.name.toLowerCase().includes(runNameSearch.toLowerCase()) &&
            parameter_search.model_name.toLowerCase().includes(modelNameSearch.toLowerCase())
          )).map((parameter_search) => (
            <ParameterSearchDetail  key={parameter_search._id} parameter_search={parameter_search} />
          ))}
        </tbody>
      </Table>
      </div>
  )
}

export default ParameterSearch