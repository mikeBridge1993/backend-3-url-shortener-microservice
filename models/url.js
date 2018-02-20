const mongoose = require('mongoose');


let Url = mongoose.model('Url', {
    longUrl: {
        type: String,
        trim: true,
        unique: true
    },
    shortUrl: {
        type: String,
        trim: true,
        unique: true
    }
});

module.exports = {
    Url
};

