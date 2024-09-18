require('dotenv').config() // Require as here are defined MongoDB credentials
const cors = require(`cors`);
const express  = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { GridFSBucket } = require('mongodb');

const aboutRoutes = require('./routes/about')
const documentationRoutes = require('./routes/documentation')
const simulationRunsRoutes = require('./routes/simulation_runs')
const stimuliRoutes = require('./routes/stimuli')
const expProtocolRoutes = require('./routes/exp_protocols')
const recordRoutes = require('./routes/records')
const resultRoutes = require('./routes/results')
const parameterSearchRoutes = require('./routes/parameter_searches')

// Define multer storage for middle end
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

app.use(cors());
// The express middle end
app.use(express.json({ limit: '50mb' }))


// Next.js
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

// Connection to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const conn = mongoose.connection;
        gfs = new GridFSBucket(conn.db, {
            bucketName: 'uploads' // The GridFS bucket name
        });

        // Routes
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

        app.listen(process.env.PORT, () => {
            console.log("Server running in port 4000");
        })
        console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    })


module.exports = app;