const BookAppointment = require('../models/BookAppointment');
const Service = require('../models/Service');
const Department = require('../models/Department');

const bookAppointment = async (req, res) => {
    const { appointment } = req.body;
    console.log("Received appointment:", appointment);
    try {
        const newAppointment = new BookAppointment({
            ...appointment,
            user: req.user._id,
        });
        const savedAppointment = await newAppointment.save();
        console.log("Saved appointment:", savedAppointment);
        if (savedAppointment) {
            res.status(201).json({ appointment: savedAppointment,  message: "Appointment booked successfully!" });
        } else {
            res.status(400).json({ message: "Error booking appointment!" });
        }
    } catch (error) {
        // console.error("Error saving appointment:", error);
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
        if (appointments) {
            console.log(appointments);
            res.status(200).json({ appointments });
        } else {
            res.status(404).json({ message: "No appointments found between the given dates" });
        }
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
