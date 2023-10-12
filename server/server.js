require('dotenv').config()

const express  = require('express');
const mongoose = require('mongoose')

const aboutRoutes = require('./routes/about')
const documentationRoutes = require('./routes/documentation')
const simulationRunsRoutes = require('./routes/simulation_runs')

const app = express();

//middle
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next();
})

//routes
app.use('/about', aboutRoutes)

app.use('/documentation', documentationRoutes)

app.use('/simulation_runs', simulationRunsRoutes)


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
