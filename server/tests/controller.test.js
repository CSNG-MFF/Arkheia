const request = require('supertest');
const app = require('../server'); // Assuming your server setup is in a file named server.js

const mongoose = require('mongoose');

// Run after all tests have finished
afterAll(async () => {
  // Close the MongoDB connection
  await mongoose.disconnect();
});

describe('Simulations Router', () => {
  it('should return simulations when GET /simulation_runs', async () => {
    const response = await request(app).get('/simulation_runs');
    expect(response.status).toBe(200);
  });

});

describe('Stimuli Router', () => {
  it('should return stimuli when GET /stimuli', async () => {
    const response = await request(app).get('/stimuli');
    expect(response.status).toBe(200);
  });

});

describe('Results Router', () => {
  it('should return results when GET /results', async () => {
    const response = await request(app).get('/results');
    expect(response.status).toBe(200);
  }, 15000);

});

describe('Experimental Protocols Router', () => {
  it('should return experimental protocols when GET /exp_protocols', async () => {
    const response = await request(app).get('/exp_protocols');
    expect(response.status).toBe(200);
  });

});

describe('Records Router', () => {
  it('should return records when GET /records', async () => {
    const response = await request(app).get('/records');
    expect(response.status).toBe(200);
  });

});

