const mongoose = require('mongoose');

module.exports = mongoose.Schema({
    name: {  type: String, required: true,  unique: true},
    description: { type: String, required: true },
    level: { type: Number,  required: true },
    parentTheme: { type: mongoose.Types.ObjectId, required: false },
},{
    timestamps: { createdAt: "created_at", updatedAt: "edited_at" },
    versionKey: false,
});
