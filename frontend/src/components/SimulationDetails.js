import { IoTrashSharp } from "react-icons/io5";
import { Button } from "reactstrap";

const SimulationDetail = ({ simulation }) => {
  return ( 
    <tr className="simulation-detail">
      <td>
        {simulation.title}
      </td>
      <td>
        {simulation.number}
      </td>
      <td>
        {new Date(simulation.createdAt).toLocaleString('en-GB')}
      </td>
      <td>
        new column
      </td>
      <td>a</td>
      <td>a</td>
      <td>a</td>
      <td>a</td>
      <td>a</td>  
      <td>
        <Button>
          <IoTrashSharp/>
        </Button>
      </td>
    </tr>
  )
}

export default SimulationDetail;