// #region IMPORT
const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    name: { type: String,required: true, unique: true, },
    description: { type: String, required: false, },
    parentModule: { type: mongoose.Types.ObjectId, required: true },
    points: { type: Number },
    exerciceContent: [{
        question: { type: String, required: true },
        codeSnippet: { type: String },
        answers: [ { entitled: { type: String }, isGood: { type: Boolean }} ],
    }],
},{
    timestamps: { createdAt: "created_at", updatedAt: "edited_at" },
    versionKey: false,
});
