const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['cash', 'insurance', 'contract']
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const serviceSchema = new mongoose.Schema({
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
    prices: [priceSchema]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);
