require('dotenv').config()

const request = require('supertest'); 
const mongoose = require('mongoose');

const { getSimulation, createSimulation, getSimulations, deleteSimulation, updateSimulation } = require('../controllers/simulationRunsController');
const { getStimuli, createStimulus, deleteStimulus, getStimuliForSimulation } = require('../controllers/stimuliController');
const { getResults, createResult, deleteResult, getResultsForSimulation } = require('../controllers/resultsController');
const { getExpProtocols, createExpProtocol, deleteExpProtocol, getExpProtocolForSimulation } = require('../controllers/ExpProtocolController');
const { getRecords, createRecord, deleteRecord, getRecordsForSimulation } = require('../controllers/recordsController')
const { getFigureForResult, getMovieForStimulus } = require('../controllers/fileGridfsController');

const Simulation = require('../models/simulation_run_model');
const Stimuli = require('../models/stimuli_model'); // Import the models
const Result = require('../models/results_model');
const ExpProtocol = require('../models/exp_protocol_model');
const Record = require('../models/records_model');

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
  it('Get all results in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    await getSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});


/////////////////////////////////////////////
//Tests for connections between collections//
/////////////////////////////////////////////
describe('GET /records: getRecordsForSimulation', () => {
  it('Get all the records associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getRecordsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
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
  it('Delete one stimulus in the db', async () => {
    const req = mockReq();
    const res = mockRes();
    
    const stimulus = await Stimuli.find({});
    const stimulusToDelete = stimulus[0];
    
    req.params.id = stimulusToDelete._id;
    
    await deleteStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

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
  it('Delete one result in the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const result = await Result.find({});
    const resultToDelete = result[0];

    req.params.id = resultToDelete._id;

    await deleteResult(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

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