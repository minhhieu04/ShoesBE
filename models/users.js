const mongoose = require('mongoose');
const Schema = mongoose.Schema

const usersSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },

    },   
    { timestamps: true }
)

const Users = mongoose.model('Users', usersSchema)
module.exports = Users
