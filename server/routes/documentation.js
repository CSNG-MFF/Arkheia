const express = require('express')

const router = express.Router()

//GET the main documentation page
router.get('/documentation', (req, res) => {
    res.json({mssg: "get the documentation page"})
})

//GET the installation manual page
router.get('/installation', (req, res) => {
    res.json({mssg: "GET the installation manual page"})
})

//GET the client manual page
router.get('/client', (req, res) => {
    res.json({mssg: "GET the client manual page"})
})

//Get the API documentation page
router.get('/api', (req, res) => {
    res.json({mssg: "Get the API documentation page"})
})


module.exports = router