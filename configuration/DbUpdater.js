const url = require('../Modal/DbSchema');

// Create a document in DB
const save = (Longurl, Shorturl, shorturlId) => {
    return url.create({Longurl, Shorturl, shorturlId})
};

// Search a document in DB
const find = (shorturlId) => url.findOne({ shorturlId : shorturlId});


module.exports = {save,find};