const mongoose = require('mongoose');
const Result = require('../models/results_model');
const Stimuli = require('../models/stimuli_model')
const { MongoClient, GridFSBucket } = require('mongodb');


/**
 * Gets the figure for a result
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves the figure
 */
const getFigureForResult = async (req, res) => {
  const { id } = req.params;

  try {
      // Retrieve the result from the database
      const result = await Result.findById(id);
      if (!result) {
        return res.status(404).json({ error: 'Result not found' });
      }

      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const db = client.db(); // Get the database instance
      const bucket = new GridFSBucket(db);

      // Find the file by its ID
      const file_id = new mongoose.Types.ObjectId(result.figure.fileId);
      const download_stream = bucket.openDownloadStream(file_id);

      // Set response headers
      res.set('Content-Type', result.figure.contentType);
      res.set('Content-Disposition', 'inline');

      // Pipe the file data to the response stream
      download_stream.pipe(res);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Gets all the movie for a stimulus
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns Resolves with a movie for a stimulus
 */
const getMovieForStimulus = async (req, res) => {
  const { id } = req.params;

  try {
      // Retrieve the stimuli from the database
      const stimuli = await Stimuli.findById(id);
      if (!stimuli) {
      return res.status(404).json({ error: 'Stimulus not found' });
      }

      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const db = client.db(); // Get the database instance
      const bucket = new GridFSBucket(db);

      // Find the file by its ID
      const file_id = new mongoose.Types.ObjectId(stimuli.movie.fileId);
      const download_stream = bucket.openDownloadStream(file_id);

      // Set response headers
      res.set('Content-Type', stimuli.movie.contentType);
      res.set('Content-Disposition', 'inline');

      // Pipe the file data to the response stream
      download_stream.pipe(res);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getFigureForResult,
  getMovieForStimulus
};