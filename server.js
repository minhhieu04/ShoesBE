const express = require('express')
const mongoose = require('mongoose')

const connection_string = 
    'mongodb+srv://admin:0000@cluster0.mooongk.mongodb.net/test'

mongoose.connect(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const database = mongoose.connection

const app = express()

app.use(express.json())

const PORT = 5000 // Khai báo PORT

app.listen(PORT || 3000, () => {
    console.log(`Server is running on port ${PORT}`)
})

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('database connected')
})