const validate = require('validate.js');
const shortId = require('shortid');
// const url = require('../Modal/url');

const validateUrl = (url = "") => {
    return validate({website: url}, {
        website: {
            url : {
                allowLocal: true
            }
        }
    });
}

const generatekey = () => shortId.generate();

module.exports = {validateUrl, generatekey : generatekey};