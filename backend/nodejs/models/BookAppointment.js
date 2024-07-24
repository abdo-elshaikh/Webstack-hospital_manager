const mongoose = require('mongoose');

const bookAppointmentSchema = new mongoose.Schema({ 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['wait', 'accepted', 'rejected'],
        default: 'wait'
    }
}, {
    timestamps: true
});

const BookAppointment = mongoose.model('BookAppointment', bookAppointmentSchema);
module.exports = BookAppointment;
