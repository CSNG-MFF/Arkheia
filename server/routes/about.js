const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({mssg: "about page"})
})

module.exports = router