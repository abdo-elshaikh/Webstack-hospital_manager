const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    googleId: { type: String, uniqe: true, sparse: true },
    facebookId: { type: String, uniqe: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    password: {
        type: String, required: function () {
            return !this.googleId && !this.facebookId
        }
    },
    age: { type: Number, required: false },
    genSalt: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    role: { type: String, default: 'user', required: true },
    isActive: { type: Boolean, required: true },
    description: { type: String, required: false },
    image: { type: String, required: false, default: '' },
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
