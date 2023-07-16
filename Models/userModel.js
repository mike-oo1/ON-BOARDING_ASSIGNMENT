const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password required"]
    },
    token: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    islogin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel