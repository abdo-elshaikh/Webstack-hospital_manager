const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceType: {
        type: String,
        enum: ['cash', 'insurance', 'contract'],
        default: 'cash',
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: function () {
            if (this.serviceType === 'cash') {
                return this.service.prices[0].price;
            } else {
                return 0;
            }
        }
    },
    discount: {
        type: Number,
        default: 0,
        required: true
    },
    discountReason: {
        type: String,
        required: function () {
            return this.discount > 0
        }
    },
    paid: {
        type: Number,
        default: function () {
            return this.price - this.discount
        },
        required: true
    },
    rest: {
        type: Number,
        default: function () {
            return this.price - this.discount - this.paid
        },
        required: true
    },
    total: {
        type: Number,
        required: true,
        default: function () {
            return this.rest + this.paid
        }
    },
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed', 'cancelled'],
        default: 'pending',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    create_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    update_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
