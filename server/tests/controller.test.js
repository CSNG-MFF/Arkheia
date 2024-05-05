require('dotenv').config()

const mongoose = require('mongoose');

const { getSimulation, createSimulation, getSimulations, deleteSimulation, updateSimulation } = require('../controllers/simulationRunsController');
const { getStimuli, createStimulus, deleteStimulus, getStimuliForSimulation } = require('../controllers/stimuliController');
const { getResults, createResult, deleteResult, getResultsForSimulation } = require('../controllers/resultsController');
const { getExpProtocols, createExpProtocol, deleteExpProtocol, getExpProtocolForSimulation } = require('../controllers/ExpProtocolController');
const { getRecords, createRecord, deleteRecord, getRecordsForSimulation } = require('../controllers/recordsController')
const { getParameterSearches, createParameterSearch, deleteParameterSearch, getParameterSearch, getParameterSearchSimulations, getParameterSearchResults, updateParameterSearch } = require('../controllers/parameterSearchController');

// Import the models
const Simulation = require('../models/simulation_run_model');
const Stimuli = require('../models/stimuli_model');
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

beforeEach(async () => {
  await mongoose.connection.close();
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

// Close DB connection after tests
afterEach(async () => {
  await mongoose.connection.close();
});


//Stimuli tests
describe('POST /stimuli: createStimulus', () => {
  it('Create stimulus for testing purposes', async () => {
    const fileID = new mongoose.Types.ObjectId();
    const randomDocument = new Stimuli({
      code_name: Math.random().toString(36).substring(7),
      short_description: Math.random().toString(36).substring(7),
      long_description: Math.random().toString(36).substring(7),
      parameters: { test: Math.random().toString(36).substring(7) }, // adjust as necessary
      movie: {
        fileId: fileID,
        contentType: 'image/gif'
      }
    });

    await randomDocument.save();
  });

  it('Test for empty body of request', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('Test for no GIF in stimuli request body', async () => {
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
      parameters: { test: Math.random().toString(36).substring(7) }, // adjust as necessary
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

    const createdExpProtocol = await ExpProtocol.findOne({ code_name: req.body.code_name });
    expect(createdExpProtocol).not.toBeNull();
    expect(createdExpProtocol.short_description).toBe(req.body.short_description);
    expect(createdExpProtocol.long_description).toBe(req.body.long_description);
    expect(createdExpProtocol.parameters).toBe(req.body.parameters);
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

    const createdRecord = await Record.findOne({ code_name: req.body.code_name });
    expect(createdRecord).not.toBeNull();
    expect(createdRecord.short_description).toBe(req.body.short_description);
    expect(createdRecord.long_description).toBe(req.body.long_description);
    expect(createdRecord.parameters).toBe(req.body.parameters);
    expect(createdRecord.variables).toBe(req.body.variables);
    expect(createdRecord.source).toBe(req.body.source);
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
      const stimuli = await Stimuli.find({});
      const expProtocols = await ExpProtocol.find({});
      const results = await Result.find({});
      const recordsArr = [];
      recordsArr.push(records[0]._id)
      
      const stimuliArr = [];
      stimuliArr.push(stimuli[0]._id)
      
      const expProtocolsArr = [];
      expProtocols.push(expProtocols[0]._id)
      
      const resultsArr = [];
      results.push(results[0]._id)
      
      req.body = {
        simulation_run_name: "test", 
        model_name: "test", 
        creation_data: "11/01/2024-16:30:24", 
        model_description: "test", 
        parameters: "test", 
        stimuliIds: recordsArr, 
        expProtocolIds: stimuliArr, 
        recordIds: expProtocolsArr, 
        resultIds: resultsArr,
        from_parameter_search: false
      };

      await createSimulation(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const createdSimulation = await Simulation.findOne({ simulation_run_name: req.body.simulation_run_name });
      expect(createdSimulation).not.toBeNull();
      expect(createdSimulation.model_name).toBe(req.body.model_name);
      expect(createdSimulation.model_description).toBe(req.body.model_description);
      expect(createdSimulation.parameters).toBe(req.body.parameters);
      expect(createdSimulation.from_parameter_search).toBe(req.body.from_parameter_search);
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

    const updatedSimulation = await Simulation.findById(req.params.id);
    expect(updatedSimulation.simulation_run_name).toBe(req.body.simulation_run_name);
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
    const simulationsArr = [];
    simulationsArr.push(simulations[0]._id)
    
    req.body = {
      name: "test",
      model_name: "test",
      run_date: "11/01/2024-16:30:24", 
      simulationIds: simulationsArr, 
      parameter_combinations: "test"
    };

    await createParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const createdParameterSearch = await ParameterSearch.findOne({ name: req.body.name });
    expect(createdParameterSearch).not.toBeNull();
    expect(createdParameterSearch.model_name).toBe(req.body.model_name);
    expect(createdParameterSearch.parameter_combinations).toBe(req.body.parameter_combinations);
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

    const updatedParameterSearch = await ParameterSearch.findById(req.params.id);
    expect(updatedParameterSearch.name).toBe(req.body.name);
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
    const recordToDelete = record[0];

    req.params.id = recordToDelete._id;

    await deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deletedRecord = await Record.findById(req.params.id);
    expect(deletedRecord).toBeNull();
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

    const expProtocol = await ExpProtocol.find({});
    const expProtocolToDelete = expProtocol[0];

    req.params.id = expProtocolToDelete._id;

    await deleteExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deletedExpProtocol = await ExpProtocol.findById(req.params.id);
    expect(deletedExpProtocol).toBeNull();
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
    const simulationToDelete = simulation[0];

    req.params.id = simulationToDelete._id;

    await deleteSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deletedSimulation = await Simulation.findById(req.params.id);
    expect(deletedSimulation).toBeNull();
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
    const parameterToDelete = parameter_search[0];

    req.params.id = parameterToDelete._id;

    await deleteParameterSearch(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const deletedParameterSearch = await ParameterSearch.findById(req.params.id);
    expect(deletedParameterSearch).toBeNull();
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