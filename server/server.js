require('dotenv').config()

const express  = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { MongoClient, GridFSBucket } = require('mongodb');
const Result = require('./models/results_model'); // Import the Result model
const Stimuli = require('./models/stimuli_model');

const aboutRoutes = require('./routes/about')
const documentationRoutes = require('./routes/documentation')
const simulationRunsRoutes = require('./routes/simulation_runs')
const stimuliRoutes = require('./routes/stimuli')
const expProtocolRoutes = require('./routes/exp_protocol')
const recordRoutes = require('./routes/records')
const resultRoutes = require('./routes/results')
const parameterSearchRoutes = require('./routes/parameter_searches')

// ... before route definitions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const app = express();

//middle
app.use(express.json({ limit: '50mb' }))


app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})



let gfs;

//connection to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const conn = mongoose.connection;
        gfs = new GridFSBucket(conn.db, {
            bucketName: 'uploads' // Specify the GridFS bucket name
        });
        //routes
        app.use('/about', aboutRoutes)

        app.use('/documentation', documentationRoutes)

        app.use('/simulation_runs', simulationRunsRoutes)

        app.use('/stimuli', upload.single('movie', (err, req, res, next) => {
            if (err) {
                console.error('Multer Error:', err);
                res.status(400).json({ error: 'Error during file upload' });
            } else {
                next();
            }
        }), stimuliRoutes);

        app.use('/exp_protocols', expProtocolRoutes);

        app.use('/records', recordRoutes);

        app.use('/results', upload.single('figure', (err, req, res, next) => {
            if (err) {
                console.error('Multer Error:', err);
                res.status(400).json({ error: 'Error during file upload' });
            } else {
                next();
            }
        }), resultRoutes); 

        app.use('/parameter_searches', parameterSearchRoutes);
        
        app.get('/results/:resultId/image', async (req, res) => {
            const { resultId } = req.params;

            try {
                // Retrieve the result from the database
                const result = await Result.findById(resultId);
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
        });

        app.get('/stimuli/:stimuliID/image', async (req, res) => {
            const { stimuliID } = req.params;

            try {
                // Retrieve the stimuli from the database
                const stimuli = await Stimuli.findById(stimuliID);
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
        });
        //requests
        app.listen(process.env.PORT, () => {
            console.log("Server running in port 4000");
        })
        console.log("Successfully connected to mongodb");
    })
    .catch((error) => {
        console.log(error);
    })


module.exports = app;