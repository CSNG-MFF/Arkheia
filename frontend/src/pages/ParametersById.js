import React from 'react';
import { useLocation } from 'react-router-dom';
 
import { JSONTree } from 'react-json-tree';

const theme = {
  base00: '#272822'
};

const ParametersById = () => {
  const location = useLocation();
  const simulation = location.state;
  return (
    <div>
      <h1 style={{ textAlign: 'center'}}>Parameters of the simulation</h1>
      {simulation.parameters ? (
        <JSONTree 
        hideRoot={true}
        labelRenderer={([key]) => <strong>{key}</strong>}
        invertTheme={true}
        theme={theme}
        data={simulation.parameters} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ParametersById;
