import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

const ParameterSearch = () => {
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
              Click the eye icon to perform parameter dependent interactive inspection of the paramter search results
            </UncontrolledTooltip>
            <th id="Delete">
              Delete simulation run
            </th>
            <UncontrolledTooltip
              target="Delete"
            >
              Click the trash icon to delete one simulation run from the table
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>
          hm
        </tbody>
      </Table>
      </div>
  )
}

export default ParameterSearch