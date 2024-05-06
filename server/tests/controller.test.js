require('dotenv').config()

const mongoose = require('mongoose');

// Import the functions for testing
const { getSimulation, createSimulation, getSimulations, deleteSimulation, updateSimulation } = require('../controllers/simulationRunsController');
const { getStimuli, createStimulus, deleteStimulus, getStimuliForSimulation } = require('../controllers/stimuliController');
const { getResults, createResult, deleteResult, getResultsForSimulation } = require('../controllers/resultsController');
const { getExpProtocols, createExpProtocol, deleteExpProtocol, getExpProtocolForSimulation } = require('../controllers/ExpProtocolController');
const { getRecords, createRecord, deleteRecord, getRecordsForSimulation } = require('../controllers/recordsController')
const { getParameterSearches, createParameterSearch, deleteParameterSearch, getParameterSearch, getParameterSearchSimulations, getParameterSearchResults, updateParameterSearch } = require('../controllers/parameterSearchController');

// Import the models
const Simulation = require('../models/simulation_run_model');
const Stimulus = require('../models/stimuli_model');
const Result = require('../models/results_model');
const ExpProtocol = require('../models/exp_protocol_model');
const Record = require('../models/records_model');
const ParameterSearch = require('../models/parameter_search_model');
 

// Mocking the req and res objects for testing
const mockReq = () => {
  const req = {};
  req.params = jest.fn().mockReturnValue(req);
  req.body = jest.fn().mockReturnValue(req);
  return req;
};

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Connect to the DB before the tests
beforeEach(async () => {
  await mongoose.connection.close();
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

// Close DB connection after tests
afterEach(async () => {
  await mongoose.connection.close();
});

/////////////////
//Stimuli tests//
/////////////////
describe('POST /stimuli: createStimulus', () => {
  it('Create stimulus for testing purposes', async () => {
    const fileID = new mongoose.Types.ObjectId();
    const randomDocument = new Stimulus({
      code_name: Math.random().toString(36).substring(7),
      short_description: Math.random().toString(36).substring(7),
      long_description: Math.random().toString(36).substring(7),
      parameters: { test: Math.random().toString(36).substring(7) },
      movie: {
        fileId: fileID,
        contentType: 'image/gif'
      }
    });

    await randomDocument.save();
  });

  it('Empty body of request', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('No GIF in stimuli request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      code_name: "test", 
      short_description: "test", 
      long_description: "test", 
      parameters: "test"
    };

    await createStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /stimuli: getStimuli', () => {
  it('Get all the stimuli in the database without errors', async () => {
    const req = mockReq();
    const res = mockRes();
    await getStimuli(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

////////////////
//Result tests//
////////////////
describe('POST /results: createResult', () => {
  it('Create result for testing purposes', async () => {
    const randomDocument = new Result({
      code_name: Math.random().toString(36).substring(7),
      name: Math.random().toString(36).substring(7),
      caption: Math.random().toString(36).substring(7),
      parameters: { test: Math.random().toString(36).substring(7) },
      figure: {
        fileId: new mongoose.Types.ObjectId(),
        contentType: 'image/png'
      }
    });
    await randomDocument.save();
  });

  it('Test for empty body of request', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Test for no figure in result request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      code_name: "test", 
      name: "test", 
      caption: "test", 
      parameters: "test"
    };

    await createResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET /results: getResults', () => {
  it('Should get all the results in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await getResults(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});


////////////////////////////////
//Experimental Protocols tests//
////////////////////////////////
describe('POST /exp_protocols: createExpProtocol', () => {
  it('Create a new experimental protocol', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.body = {
      code_name: "test",
      short_description: "test", 
      long_description: "test", 
      parameters: "test"
    };

    await createExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const created_exp_protocol = await ExpProtocol.findOne({ code_name: req.body.code_name });
    expect(created_exp_protocol).not.toBeNull();
    expect(created_exp_protocol.short_description).toBe(req.body.short_description);
    expect(created_exp_protocol.long_description).toBe(req.body.long_description);
    expect(created_exp_protocol.parameters).toBe(req.body.parameters);
  });

  it('Create experimental protocol with empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Create experimental protocol with not completely empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      code_name: "test"
    };
    await createExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /exp_protocols: getExpProtocols', () => {
  it('Get all the experimental protocols in the database', async () => {
    const req = mockReq();
    const res = mockRes();
    
    await getExpProtocols(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  
});

////////////////
//Record tests//
////////////////
describe('POST /records: createRecord', () => {
  it('Create a new record', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.body = {
      code_name: "test", 
      short_description: "test", 
      long_description: "test", 
      parameters: "test", 
      variables: "test", 
      source: "test"
    };

    await createRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const created_record = await Record.findOne({ code_name: req.body.code_name });
    expect(created_record).not.toBeNull();
    expect(created_record.short_description).toBe(req.body.short_description);
    expect(created_record.long_description).toBe(req.body.long_description);
    expect(created_record.parameters).toBe(req.body.parameters);
    expect(created_record.variables).toBe(req.body.variables);
    expect(created_record.source).toBe(req.body.source);
  });

  it('Create a new record with empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Create a new record with not completely empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      code_name: "test"
    };
    await createRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET /records: getRecords', () => {
  it('Get all the records in the database', async () => {
    const req = mockReq();
    const res = mockRes();
    
    await getRecords(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});

////////////////////
//Simulation tests//
////////////////////
describe('POST /simulation_runs: createSimulation', () => {
    it('Create a new simulation', async () => {
      const req = mockReq();
      const res = mockRes();
      const records = await Record.find({});
      const stimuli = await Stimulus.find({});
      const exp_protocols = await ExpProtocol.find({});
      const results = await Result.find({});
      const records_array = [];
      records_array.push(records[0]._id)
      
      const stimuli_array = [];
      stimuli_array.push(stimuli[0]._id)
      
      const exp_protocols_array = [];
      exp_protocols.push(exp_protocols[0]._id)
      
      const results_array = [];
      results.push(results[0]._id)
      
      req.body = {
        simulation_run_name: "test", 
        model_name: "test", 
        creation_data: "11/01/2024-16:30:24", 
        model_description: "test", 
        parameters: "test", 
        stimuliIds: records_array, 
        expProtocolIds: stimuli_array, 
        recordIds: exp_protocols_array, 
        resultIds: results_array,
        from_parameter_search: false
      };

      await createSimulation(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const created_simulation = await Simulation.findOne({ simulation_run_name: req.body.simulation_run_name });
      expect(created_simulation).not.toBeNull();
      expect(created_simulation.model_name).toBe(req.body.model_name);
      expect(created_simulation.model_description).toBe(req.body.model_description);
      expect(created_simulation.parameters).toBe(req.body.parameters);
      expect(created_simulation.from_parameter_search).toBe(req.body.from_parameter_search);
    });

  it('Create a simulation with an empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Create a simulation with a not completely empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      simulation_run_name: "test", 
      model_name: "test", 
      creation_data: "11/01/2024-16:30:24", 
    };
    await createSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /simulation_runs: getSimulations', () => {
  it('Get all simulation runs in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    await getSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});

describe('GET /simulation_runs: getSimulation', () => {
  it('Get one simulation in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;

    await getSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('PUT /simulation_runs: updateSimulation', () => {
  it('Update one simulation in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    req.body = {
      simulation_run_name: "test12121"
    }
    await updateSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const updated_simulation = await Simulation.findById(req.params.id);
    expect(updated_simulation.simulation_run_name).toBe(req.body.simulation_run_name);
  });

  it('Update one simulation in the database with a non existing field', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    req.body = {
      blabla: "test12121"
    }
    await updateSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await updateSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await updateSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});


////////////////////////////////////
//Tests for the parameter searches//
////////////////////////////////////
describe('POST /parameter_searches: createParameterSearch', () => {
  it('Create a new parameter search', async () => {
    const req = mockReq();
    const res = mockRes();
    const simulations = await Simulation.find({});
    const simulations_array = [];
    simulations_array.push(simulations[0]._id)
    
    req.body = {
      name: "test",
      model_name: "test",
      run_date: "11/01/2024-16:30:24", 
      simulationIds: simulations_array, 
      parameter_combinations: "test"
    };

    await createParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const created_parameter_search = await ParameterSearch.findOne({ name: req.body.name });
    expect(created_parameter_search).not.toBeNull();
    expect(created_parameter_search.model_name).toBe(req.body.model_name);
    expect(created_parameter_search.parameter_combinations).toBe(req.body.parameter_combinations);
  });

  it('Create a parameter search with an empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Create a parameter search with a not completely empty request body', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      name: "test",
    };
    await createParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /parameter_searches: getParameterSearches', () => {
  it('Get all parameter searches in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    await getParameterSearches(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

});

describe('GET /parameter_searches: getParameterSearch', () => {
  it('Get one parameter search in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    const parameter_search = await ParameterSearch.find({});
    req.params = parameter_search[0]._id;

    await getParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('PUT /parameter_searches: updateParameterSearch', () => {
  it('Update one parameter search in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    const parameter_search = await ParameterSearch.find({});
    req.params = parameter_search[0]._id;
    req.body = {
      name: "test12121"
    }
    await updateParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();

    const updated_parameter_search = await ParameterSearch.findById(req.params.id);
    expect(updated_parameter_search.name).toBe(req.body.name);
  });

  it('Update one parameter search in the database with a non existing field', async () => {
    const req = mockReq();
    const res = mockRes();

    const parameter_search = await ParameterSearch.find({});
    req.params = parameter_search[0]._id;
    req.body = {
      blabla: "test12121"
    }
    await updateParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await updateParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing parameter search ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await updateParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});


/////////////////////////////////////////////
//Tests for connections between collections//
/////////////////////////////////////////////
describe('GET /parameter_searches: getParameterSearchSimulations', () => {
  it('Get all the simulations associated with a parameter search', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const parameter_search = await ParameterSearch.find({});
    req.params = parameter_search[0]._id;
    await getParameterSearchSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getParameterSearchSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing parameter search ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getParameterSearchSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /parameter_searches: getParameterSearchResults', () => {
  it('Get all the simulations associated with a parameter search', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const parameter_search = await ParameterSearch.find({});
    req.params = parameter_search[0]._id;
    await getParameterSearchResults(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getParameterSearchResults(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing parameter search ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getParameterSearchResults(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('GET /records: getRecordsForSimulation', () => {
  it('Get all the records associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getRecordsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getRecordsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getRecordsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('GET /exp_protocols: getExpProtocolForSimulation', () => {
  it('Get all the experimental protocols associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getExpProtocolForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getExpProtocolForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getExpProtocolForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('GET /results: getResultsForSimulation', () => {
  it('Get all the results associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getResultsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getResultsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getResultsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

});

describe('GET /stimuli: getStimuliForSimulation', () => {
  it('Get all the stimuli associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getStimuliForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
  
  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await getStimuliForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await getStimuliForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

////////////////
//Delete tests//
////////////////

describe('DELETE /stimuli: deleteStimulus', () => {
  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing stimulus ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
});


describe('DELETE /results: deleteResult', () => {
  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteResult(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing result ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('DELETE /records: deleteRecord', () => {
  it('Delete one record from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const record = await Record.find({});
    const record_to_delete = record[0];

    req.params.id = record_to_delete._id;

    await deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deleted_record = await Record.findById(req.params.id);
    expect(deleted_record).toBeNull();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing record ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('DELETE /exp_protocols: deleteExpProtocol', () => {
  it('Delete one experimental protocol from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const exp_protocol = await ExpProtocol.find({});
    const exp_protocol_to_delete = exp_protocol[0];

    req.params.id = exp_protocol_to_delete._id;

    await deleteExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deleted_exp_protocol = await ExpProtocol.findById(req.params.id);
    expect(deleted_exp_protocol).toBeNull();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing record ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});


describe('DELETE /simulation_runs: deleteSimulation', () => {
  it('Delete one simulation from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    const simulation_to_delete = simulation[0];

    req.params.id = simulation_to_delete._id;

    await deleteSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deleted_simulation = await Simulation.findById(req.params.id);
    expect(deleted_simulation).toBeNull();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('DELETE /parameter_search: deleteParameterSearch', () => {
  it('Delete one parameter search from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const parameter_search = await ParameterSearch.find({});
    const parameter_search_to_delete = parameter_search[0];

    req.params.id = parameter_search_to_delete._id;

    await deleteParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deleted_parameter_search = await ParameterSearch.findById(req.params.id);
    expect(deleted_parameter_search).toBeNull();
  });

  it('Bad format of MongoDB ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = Math.random();
    await deleteParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('Not existing simulation ID', async () => {
    const req = mockReq();
    const res = mockRes();
    
    req.params = new mongoose.Types.ObjectId();
    await deleteParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});