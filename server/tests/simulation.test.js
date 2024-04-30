require('dotenv').config()

const mongoose = require('mongoose');
const { createSimulation, getSimulations, deleteSimulation } = require('../controllers/simulationRunsController');
const { getStimuli, createStimulus, deleteStimulus, getStimuliForSimulation } = require('../controllers/stimuliController');
const { getResults, createResult, deleteResult, getResultsForSimulation } = require('../controllers/resultsController');
const { getExpProtocols, createExpProtocol, deleteExpProtocol, getExpProtocolForSimulation } = require('../controllers/ExpProtocolController');
const { getRecords, createRecord, deleteRecord, getRecordsForSimulation } = require('../controllers/recordsController')


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
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

// Run after all tests have finished
afterEach(async () => {
  await mongoose.connection.close();
});


//Stimuli tests
describe('POST stimulus without errors', () => {
  it('should create a new stimulus', async () => {
    const req = mockReq();
    const res = mockRes();


    req.body = {
      code_name : "test", 
      short_description: "test", 
      long_description: "test", 
      parameters: "test", 
      movie: "test"
    };

    await createStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('POST stimulus with errors', () => {
  it('should not create a stimulus without errors', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET stimuli without errors', () => {
  it('should get all the stimuli in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await getStimuli(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});


////////////////
//Result tests//
////////////////
describe('POST result without errors', () => {
  it('should create a new result', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {
      code_name: "test", 
      name: "test", 
      parameters: "test", 
      caption: "test", 
      figure: "test"
    };

    await createResult(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('POST result with errors', () => {
  it('should not create a result without errors', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET results without errors', () => {
  it('should get all the results in the database', async () => {
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
describe('POST an experimental protocol without errors', () => {
  it('should create a new experimental protocol', async () => {
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

});

describe('POST an experimental protocol with errors', () => {
  it('should not create an experimental protocol without errors', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET experimental protocols without errors', () => {
  it('should get all the experimental protocols in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await getExpProtocols(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

////////////////
//Record tests//
////////////////
describe('POST a record without errors', () => {
  it('should create a new record', async () => {
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

});

describe('POST a record with errors', () => {
  it('should not create a record without errors', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET records without errors', () => {
  it('should get all the records in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await getRecords(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

////////////////////
//Simulation tests//
////////////////////
describe('POST a simulation without errors', () => {
  it('should create a new simulation', async () => {
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
      resultIds: resultsArr
    };

    await createSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('POST a simulation with errors', () => {
  it('should not create a simulation without errors', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await createSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

});

describe('GET simulations without errors', () => {
  it('should get all the simulations in the database', async () => {
    const req = mockReq();
    const res = mockRes();

    req.body = {};
    await getSimulations(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});


/////////////////////////////////////////////
//Tests for connections between collections//
/////////////////////////////////////////////

describe('GET record for a simulation', () => {
  it('should get all the records associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getRecordsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('GET experimental protocols for a simulation', () => {
  it('should get all the experimental protocols associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getExpProtocolForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('GET results for a simulation', () => {
  it('should get all the results associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getResultsForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('GET stimuli for a simulation', () => {
  it('should get all the stimuli associated with a simulation', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    req.params = simulation[0]._id;
    await getStimuliForSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

////////////////
//Delete tests//
////////////////

describe('DELETE stimulus without errors', () => {
  it('should delete one stimuli in the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const stimuli = await Stimuli.find({});
    const stimulusToDelete = stimuli[0];

    req.params.id = stimulusToDelete._id;

    await deleteStimulus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});


describe('DELETE a result without errors', () => {
  it('should delete one result in the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const result = await Result.find({});
    const resultToDelete = result[0];

    req.params.id = resultToDelete._id;

    await deleteResult(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('DELETE a record without errors', () => {
  it('should delete one record from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const record = await Record.find({});
    const recordToDelete = record[0];

    req.params.id = recordToDelete._id;

    await deleteRecord(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});

describe('DELETE an experimental protocol without errors', () => {
  it('should delete one experimental protocol from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const expProtocol = await ExpProtocol.find({});
    const expProtocolToDelete = expProtocol[0];

    req.params.id = expProtocolToDelete._id;

    await deleteExpProtocol(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});


describe('DELETE a simulation without errors', () => {
  it('should delete one simulation from the db', async () => {
    const req = mockReq();
    const res = mockRes();

    const simulation = await Simulation.find({});
    const simulationToDelete = simulation[0];

    req.params.id = simulationToDelete._id;

    await deleteSimulation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

});