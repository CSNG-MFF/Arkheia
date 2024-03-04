import { useLocation } from 'react-router-dom';

import ParametersById from "./ParametersById";
import StimuliById from './StimuliById';
import ExpProtocolsById from './ExpProtocolsById';
import ResultsById from './ResultsById';

const LoneSimulation = () => {
  const location = useLocation();
  const simulation = location.state;
  return (
    <div>
      <ParametersById state={simulation}/>
      <StimuliById state={simulation}/>
      <ExpProtocolsById state={simulation}/>
      <ResultsById state={simulation}/>
    </div>
  );
};

export default LoneSimulation;
