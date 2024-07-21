const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        uniqe: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Position',
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
    contact: {
        type: String,
        required: false,
    },
    salary: {
        type: Number,
        required: false,
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model('Staff', StaffSchema);
