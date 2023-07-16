const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    math: {
        type: Number,
        required: [true, "required"]
    },
    english: {
        type: Number,
        required: [true, "required"]
    }
}, {timestamps: true});

const ScoreModel = mongoose.model("records", scoreSchema)
module.exports =ScoreModel 