const jwt = require('jsonwebtoken');

const abcd = (bank) => {
    return jwt.sign({
        username: bank.username,
        id: bank.id
    }, 'SECRET');
};

module.exports = abcd;
