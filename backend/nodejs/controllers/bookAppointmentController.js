const BookAppointment = require('../models/BookAppointment');
const Service = require('../models/Service');
const Department = require('../models/Department');

const bookAppointment = async (req, res) => {
    const { appointment } = req.body;
    // console.log("Received appointment:", appointment);
    try {
        const newAppointment = new BookAppointment({
            user: appointment.user,
            department: appointment.department,
            service: appointment.service,
            reason: appointment.reason,
            name: appointment.name,
            age: appointment.age,
            address: appointment.address,
            phone: appointment.phone
        });
        // console.log("Saving new appointment:", newAppointment);
        const savedAppointment = await newAppointment.save();
        res.status(200).json({ appointment: savedAppointment, message: "Thanks we will contact you soon" });
    } catch (error) {
        console.error("Error saving appointment:", error);
        res.status(500).json({ message: error.message });
    }
};


const getAllBooking = async (req, res) => {
    try {
        const appointments = await BookAppointment.find({})
            .populate('user')
            .populate('department')
            .populate('service');
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getBookingBetweenDate = async (req, res) => {
    const { firstDate, lastDate } = req.body;
    try {
        const appointments = await BookAppointment.find({ createdAt: { $gte: firstDate, $lte: lastDate } })
            .populate('user')
            .populate('department')
            .populate('service');
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getBookingByUser = async (req, res) => {
    try {
        const appointments = await BookAppointment.find({ user: req.user._id })
            .populate('user')
            .populate('department')
            .populate('service');
        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { bookAppointment, getBookingBetweenDate, getBookingByUser, getAllBooking };
