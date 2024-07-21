const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Position', PositionSchema);
