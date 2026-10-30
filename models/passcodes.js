const mongoose = require('mongoose');

const passcodes_schema = new mongoose.Schema({
    organization: String,
    pass: String,
    status: String
})

module.exports = mongoose.model("Passcodes", passcodes_schema);