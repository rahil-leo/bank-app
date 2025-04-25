// let Application = require('../model/User')
let User = require('../model/User')

exports.getbank = async (req, res) => {
    id = req.params.id
    let allaccount = await User.findOne({ id: id })
    // let alldetails = await Application.find()
    return res.render('bank/bank', { oneaccount: allaccount ,accounts:[] })
}

exports.getbankdetails = async (req, res) => {
    id = req.params.id
    let allaccount = await User.findOne({ id: id })
    console.log(allaccount)
    return res.render('bank/bankdetails', { oneaccount: allaccount , accounts:[] })
}

exports.getselectaccount = async (req, res) => {
    let allaccounts = await User.find({ formsubmit:true, approved:false })
    // console.log(allaccounts)
    return res.render('bank/selectaccount', { accounts: allaccounts })
}

exports.approval = async (req, res) => {
    let paramid = req.params.id
    console.log(paramid)
    // console.log(paramid,'here is the param id')
    let approveuser = await User.findOne({ id: paramid })
    console.log(approveuser)
    if (approveuser) {
        approveuser.approved = true
        approveuser.accountnumber = '2830' + Date.now()
        await approveuser.save()
    }
    return res.redirect('/bank')
}

exports.getapproved = async (req, res) => {
    let approveduser = await User.find({ approved:true })
    console.log(approveduser)
    return res.render('bank/approved',{approveduser , accounts:[]})
}





