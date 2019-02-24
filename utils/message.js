var moment = require('moment');

var generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new moment().valueOf()
    }
};

var generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url: `https://maps.google.com/maps/?q=${lat},${long}`,
        createdAt: new moment().valueOf()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
};