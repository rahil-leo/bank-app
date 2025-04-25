const jwt = require('jsonwebtoken')

exports.isLoggedin = (req, res, next) => {
    var token = req.cookies.token
    console.log(token)
    if (token) {
        var decoded = jwt.verify(token, 'SECRET')
        console.log(decoded)
        if (decoded) {
            next()
        } else {
            return res.clearCookie('token').render('loginauth/login',{msg:'error'})
        }
    } else {
        next()
    }
}

exports.validatethisUser = (req, res, next) => {
    const token = req.cookies?.cookie
    // console.log(token,'this is user token')
    if (!token) {
        return res.redirect('/login')
    }
    try {
        var decoded = jwt.verify(token, 'SECRET')
        // console.log(decoded , 'this is decoded value')
        req.user = decoded
        return next()
    } catch (e) {
        console.log(e)
        return res.clearCookie('cookie').redirect('/login')
    }
}