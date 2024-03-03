require('dotenv').config()

const express  = require('express');
const mongoose = require('mongoose')

const aboutRoutes = require('./routes/about')
const documentationRoutes = require('./routes/documentation')
const simulationRunsRoutes = require('./routes/simulation_runs')
const stimuliRoutes = require('./routes/stimuli')
const expProtocolRoutes = require('./routes/exp_protocol')
const recordRoutes = require('./routes/records')
const resultRoutes = require('./routes/results')

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



//connection to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        //requests
        app.listen(process.env.PORT, () => {
            console.log("Server running in port 4000");
        })
        console.log("Successfully connected to mongodb");
    })
    .catch((error) => {
        console.log(error);
    })
