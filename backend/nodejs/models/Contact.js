const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'received',
        enum: ['received', 'read', 'archived'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    read_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.status === 'read';
        }
    },
    archived_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.status === 'archived';
        }
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Contact', contactSchema)
