const express = require('express')
const path = require('path')
var cors = require('cors')
const multer = require('multer')
const { nanoid } = require('nanoid')
const connectDB = require('./DB/connectDB')
const { createInvoice } = require('./commen/createPDF')
require('dotenv').config()
const { userRouter, postRouter } = require('./router/app')
const sendEmail = require('./commen/email')
const userModel = require('./DB/model/User')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use('/uploadImages', express.static(path.join(__dirname, 'uploadImages')))
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploadImages')
    },
    filename: function(req, file, cb) {

        cb(null, nanoid() + "_" + file.originalname)
    }
})

function fileFilter(req, file, cb) {

    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true)

    } else {
        cb('sorry invalid ex', false)
    }

}



const upload = multer({ dest: 'uploadImages/', fileFilter, storage })
app.use(upload.array('image', 15))
    // var corsOptions = {
    //     origin: 'http://localhost:4200/',
    //     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    //   }
app.use(cors())
app.use(userRouter, postRouter)


// const invoice = {
//     shipping: {
//         name: "John Doe",
//         address: "1234 Main Street",
//         city: "San Francisco",
//         state: "CA",
//         country: "US",
//         postal_code: 94111
//     },
//     items: [{
//             item: "TC 100",
//             description: "Toner Cartridge",
//             quantity: 2,
//             amount: 6000
//         },
//         {
//             item: "USB_EXT",
//             description: "USB Cable Extender",
//             quantity: 1,
//             amount: 2000
//         }
//     ],
//     subtotal: 8000,
//     paid: 0,
//     invoice_nr: 187999
// };


app.get("/pdf", async(req, res) => {


    const invoice = await userModel.find({}).select('-password');


    const mypath = path.join(__dirname, './pdf')
    createInvoice(invoice, mypath + "/one.pdf")

    await sendEmail('mahmoudelwan460@gmail.com', "<p>first pdf</p>", [{
        filename: "one.pdf",
        path: mypath + "/one.pdf",
        contentType: 'application/pdf'

    }])
    res.end()
})
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))