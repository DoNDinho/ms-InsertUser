const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: String,
    nickname: String,
    age: Number,
    role: {
        type: String,
        default: 'USER_ROLE'
    },
    locked: {
        type: Boolean,
        default: false
    },
    img: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: 0
    },
    attempts: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
