const Bank = require('../model/Bank')
const bankjwt = require('../utils/adminJwt')

exports.getbanklogin = (req, res) => {
    return res.render('bank/banklogin', { msg: '' })
}

exports.banklogin = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)
        const bank = await Bank.findOne({ username: username })
        // console.log(bank)
        if (!bank) {
            return res.render('bank/banklogin', { msg: 'Invalid username or password' });
        }
        const isValid = await bank.validatepassword(password)
        console.log(isValid)
        if (!isValid) {
            return res.render('bank/banklogin', { msg: 'Invalid username or password' });
        }
        const banktoken = bankjwt(bank)
        res.cookie('banktoken', banktoken, { httpOnly: true }).redirect('/bank')
    } catch (err) {
        console.log(err)
        return res.send('error in this code')
    }

}