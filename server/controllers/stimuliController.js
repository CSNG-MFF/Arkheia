const mongoose = require('mongoose');
const Simulation = require('../models/simulation_run_model');
const Stimuli = require('../models/stimuli_model'); // Import the Stimuli model
const fs = require('fs');
const { createReadStream } = require('fs');
const { GridFSBucket } = require('mongodb');
const { MongoClient } = require('mongodb');

// Get all stimuli
const getStimuli = async (req, res) => {
  const stimuli = await Stimuli.find({}).sort({ createdAt: -1 });

  res.status(200).json(stimuli);
};

// Create a stimulus
const createStimulus = async (req, res) => {
  const { code_name, short_description, long_description, parameters } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db(); // Get the database instance
    const bucket = new GridFSBucket(db);

    const uploadStream = bucket.openUploadStream(req.file.originalname);

    const readStream = createReadStream(req.file.path);
    
    readStream.pipe(uploadStream)
      .on('error', (error) => {
        // Handle upload error
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file to GridFS' });
      })
      .on('finish', async () => {
        // Remove the temporary file
        fs.unlinkSync(req.file.path);

        const result = await Stimuli.create({
          code_name,
          short_description,
          long_description,
          parameters,
          movie: { 
            fileId: uploadStream.id.toString(),
            contentType: req.file.mimetype
          }
        });

        res.status(200).json(result);
      });
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
};

// Delete a stimulus
const deleteStimulus = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Bad format of ID' });
  }

  const stimulus = await Stimuli.findOneAndDelete({ _id: id });

  if (!stimulus) {
    return res.status(400).json({ error: 'No such stimulus' });
  }

  res.status(200).json(stimulus);
};

// Get a stimulus by ID
const getStimuliForSimulation = async (req, res) => {
  
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid( id )) {
    return res.status(404).json({ error: 'Bad format of simulation ID' });
  }
  try {
    const simulation = await Simulation.findOne({ _id: id }).populate('stimuli');
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
    
    res.status(200).json(simulation.stimuli);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStimuli,
  createStimulus,
  deleteStimulus,
  getStimuliForSimulation
};
