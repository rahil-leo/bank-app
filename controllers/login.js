let User = require('../model/User')
let createJwt = require('../utils/generateJwt')


exports.getlogin = (req, res) => {
    res.render('loginauth/login', { msg: '' })
}

exports.login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.render('loginauth/login', { msg: 'Invalid username or password' });
        }
        const isValid = await user.validatepassword(password);
        if (!isValid) {
            return res.render('loginauth/login', { msg: 'Invalid username or password' });
        }

        const token = createJwt(user);
        res.cookie('cookie', token, { httpOnly: true });
        
        
        return res.redirect('/')
    } catch (e) {
        console.log(e);
        res.status(500).render('loginauth/login', { msg: 'Unexpected error' });
    }
};


