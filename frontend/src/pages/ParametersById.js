import React, { useState, useEffect } from 'react';
import { JSONTree } from 'react-json-tree';

import { useParams } from 'react-router-dom';

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
  const { id } = useParams();
  const [parameters, setParameters] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/simulation_runs/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        setParameters(data.parameters); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h1 style={{ textAlign: 'center'}}>Parameters of the simulation</h1>
      {parameters ? (
        <JSONTree 
        hideRoot={true}
        labelRenderer={([key]) => <strong>{key}</strong>}
        invertTheme={true}
        theme={theme}
        data={parameters} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ParametersById;
