require('dotenv').config()
const express = require('express')
const app = express()
const cookieparser = require('cookie-parser')
const fileupload = require('express-fileupload')


app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cookieparser())
app.use(express.json())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

const userroute = require('./routers/userroute')
const loginroute = require('./routers/loginroute')
const bankroute = require('./routers/bankroute')

app.use('/', userroute)
app.use('/login', loginroute)
app.use('/bank',bankroute)


const { connectDB } = require('./config/db')
connectDB()
const { ConnectCloudinary } = require('./config/cloudinary')
ConnectCloudinary()

const port = process.env.PORT || 3100;
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
