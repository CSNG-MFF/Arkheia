const mongoose = require('mongoose');
const Result = require('../models/results_model');
const Stimuli = require('../models/stimuli_model')
const { MongoClient, GridFSBucket } = require('mongodb');

const getFigureForResult = async (req, res) => {
  const { id } = req.params;

  try {
      // Retrieve the result from the database
      const result = await Result.findById(id);
      if (!result) {
        return res.status(404).json({ error: 'Result not found' });
      }

      // Establish connection to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const db = client.db(); // Get the database instance
      const bucket = new GridFSBucket(db);

      // Find the file by its ObjectID
      const fileId = new mongoose.Types.ObjectId(result.figure.fileId);
      const downloadStream = bucket.openDownloadStream(fileId);

      // Set response headers
      res.set('Content-Type', result.figure.contentType);
      res.set('Content-Disposition', 'inline');

      // Pipe the file data to the response stream
      downloadStream.pipe(res);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const getMovieForStimulus = async (req, res) => {
  const { id } = req.params;

  try {
      // Retrieve the stimuli from the database
      const stimuli = await Stimuli.findById(id);
      if (!stimuli) {
      return res.status(404).json({ error: 'Stimulus not found' });
      }

      // Establish connection to MongoDB
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const db = client.db(); // Get the database instance
      const bucket = new GridFSBucket(db);

      // Find the file by its ObjectID
      const fileId = new mongoose.Types.ObjectId(stimuli.movie.fileId);
      const downloadStream = bucket.openDownloadStream(fileId);

      // Set response headers
      res.set('Content-Type', stimuli.movie.contentType);
      res.set('Content-Disposition', 'inline');

      // Pipe the file data to the response stream
      downloadStream.pipe(res);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getFigureForResult,
  getMovieForStimulus
};