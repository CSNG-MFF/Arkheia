const express = require('express')

const router = express.Router()

router.get('/simulation_runs', (req, res) => {
    res.json({mssg: "simulations page"})
})

module.exports = router