const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    code: {
        type: Number,
        required: true,
        unique: [true, 'This Code Is Found'],
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    create_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    description: {
        type: String,
        required: false 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
