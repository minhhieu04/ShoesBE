const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const ProductsRoute = require('./routes/products') 
const UsersRoute = require('./routes/users')

const connection_string = 
    'mongodb+srv://admin:0000@cluster0.mooongk.mongodb.net/test'

mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const database = mongoose.connection

const app = express()

app.use(express.json())

// Khai báo PORT
const PORT = 5000

app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`)
})

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('', ProductsRoute)
app.use('', UsersRoute)