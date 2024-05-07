const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Result = require('../models/results_model');
const fs = require('fs');
const { createReadStream } = require('fs');
const { GridFSBucket } = require('mongodb');
const { MongoClient } = require('mongodb');

/**
 * Gets all the results
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with an array of results
 */
const getResults = async (req, res) => {
  const result = await Result.find({}).sort({ createdAt: -1 });

  res.status(200).json(result);
};

/**
 * Creates a result
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the created result
 */
const createResult = async (req, res) => {
  const { code_name, name, parameters, caption } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(); // Get the database instance
    const bucket = new GridFSBucket(db);

    const upload_stream = bucket.openUploadStream(req.file.originalname);

    const read_stream = createReadStream(req.file.path);
    
    read_stream.pipe(upload_stream)
      .on('error', (error) => {
        // Handle upload error
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file to GridFS' });
      })
      .on('finish', async () => {
        // Remove the temporary file
        fs.unlinkSync(req.file.path);

        const result = await Result.create({
          code_name,
          name,
          parameters,
          caption,
          figure: { 
            fileId: upload_stream.id.toString(),
            contentType: req.file.mimetype
          }
        });

        res.status(200).json(result);
      });
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
};

/**
 * Deletes a result
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with the deleted result
 */
const deleteResult = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const result = await Result.findOne({ _id: id });

  if (!result) {
    return res.status(400).json({ error: 'No such result' });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(); // Get the database instance
    const bucket = new GridFSBucket(db);

    // Delete the file from GridFS
    await bucket.delete(new mongoose.Types.ObjectId(result.figure.fileId));

    // Delete the result from the database
    await Result.deleteOne({ _id: id });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Gets all the results for associated with a simulation
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with an array of results
 */
const getResultsForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('results');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    
    res.status(200).json(simulation.results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getResults,
  createResult,
  deleteResult,
  getResultsForSimulation
};
