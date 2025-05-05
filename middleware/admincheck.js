const jwt = require('jsonwebtoken')

exports.isLoggedin = (req, res, next) => {
    var banktoken = req.cookies.banktoken
    console.log("Token found:", banktoken)
    if (banktoken) {
        var decoded = jwt.verify(banktoken, 'SECRET')
        console.log(decoded);
        if (decoded) {
            next()
        } else {
            return res.clearCookie('banktoken').render('loginauth/login', { msg: 'error' });
        }
    } else {
        return res.redirect('/bank/banklogin')
    }
}

