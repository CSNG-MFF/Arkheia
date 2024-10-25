const fs = require('fs').promises;
const path = require('path');

const checkDatabaseWriteEnabled = async (req, res, next) => {
    try {
        // Define path to the config file
        const configFilePath = path.join(__dirname, '..', '..', 'runtime_config', 'allow_write');
        console.log(configFilePath)
        // Read and check the contents of the config file
        const configData = await fs.readFile(configFilePath, 'utf8');
        if (configData.trim() !== '1') {
            return res.status(403).json({ error: "Database write disabled" });
        }

        // If allowed, proceed to the next middleware/controller
        next();
    } catch (error) {
        // Handle errors, e.g., file not found
        res.status(500).json({ error: "Error reading configuration file" });
    }
};

module.exports = checkDatabaseWriteEnabled;
