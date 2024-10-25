const express = require('express');
const checkDatabaseWriteEnabled = require('../middleware/checkDatabaseWriteEnabled');

const router = express.Router();

router.get('/database-write-enabled', (req, res) => {
    checkDatabaseWriteEnabled(req, res, () => {
        res.status(200).json({ writeEnabled: true });
    });
});

module.exports = router;
