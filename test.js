// exports.postSendMoney = async (req, res) => {
//     const { upi, amount } = req.body;
//     const senderUsername = req.user.username;
//     const sender = await User.findOne({ username: senderUsername });

//     if (!sender || !sender.approved) {
//         return res.status(403).send("Unauthorized or not approved");
//     }

//     const senderBalance = parseFloat(sender.balance || "0");
//     const transferAmount = parseFloat(amount);

//     if (transferAmount <= 0 || senderBalance < transferAmount) {
//         return res.send("Insufficient balance or invalid amount");
//     }

//     const upiData = await Upi.findOne({ upi });
//     if (!upiData) {
//         return res.send("Invalid UPI ID");
//     }

//     const receiver = await User.findOne({ accountnumber: upiData.accountnumber });
//     if (!receiver) {
//         return res.send("Recipient not found");
//     }

//     // Do transaction
//     sender.balance = (senderBalance - transferAmount).toFixed(2);
//     receiver.balance = (parseFloat(receiver.balance || "0") + transferAmount).toFixed(2);

//     await sender.save();
//     await receiver.save();

//     return res.send("Transaction successful");
// };