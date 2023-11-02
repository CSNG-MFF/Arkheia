const express = require('express')

const router = express.Router()

router.get('/simulations', (req, res) => {
    res.json({mssg: "simulations page"})
})

module.exports = router