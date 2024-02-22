import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
      <h2>Parameters of the simulation</h2>
      {parameters ? (
        <pre>{JSON.stringify(parameters, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ParametersById;
