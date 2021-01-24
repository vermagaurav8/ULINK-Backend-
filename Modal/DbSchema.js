const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    Longurl : {
        type: String,
        required: true
    },
    Shorturl : {
        type: String,
        required: true
    },
    shorturlId : {
        type: String,
        required: true,
        unique: true
    }
});


module.exports = mongoose.model('url', urlSchema);