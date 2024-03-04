import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
 
import { JSONTree } from 'react-json-tree';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
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
