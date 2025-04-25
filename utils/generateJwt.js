const jwt = require('jsonwebtoken')


const abc = (user) => {
    return jwt.sign({
        username: user.username,
        id: user.id
    }, 'SECRET')
}

module.exports = abc
