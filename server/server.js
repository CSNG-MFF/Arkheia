require('dotenv').config()

const express  = require('express');
const mongoose = require('mongoose');
const gridfsStream = require('gridfs-stream');

const aboutRoutes = require('./routes/about')
const documentationRoutes = require('./routes/documentation')
const simulationRunsRoutes = require('./routes/simulation_runs')
const stimuliRoutes = require('./routes/stimuli')
const expProtocolRoutes = require('./routes/exp_protocol')
const recordRoutes = require('./routes/records')
const resultRoutes = require('./routes/results')
const parameterSearchRoutes = require('./routes/parameter_searches')

const app = express();

//middle
app.use(express.json({ limit: '50mb' }))

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

//routes
app.use('/about', aboutRoutes)

app.use('/documentation', documentationRoutes)

app.use('/simulation_runs', simulationRunsRoutes)

app.use('/stimuli', stimuliRoutes);

app.use('/exp_protocols', expProtocolRoutes);

app.use('/records', recordRoutes);

app.use('/results', resultRoutes);

app.use('/parameter_searches', parameterSearchRoutes);



//connection to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        const conn = mongoose.connection; // Get the connection object
        const gfs = gridfsStream(conn.db, mongoose.mongo); // Create GridFS Bucket
        gfs.collection('uploads');
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