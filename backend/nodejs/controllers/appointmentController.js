const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Department = require('../models/Department');

const createAppointment = async (req, res) => {
    const { appointment } = req.body;
    try {
        const service = await Service.findById(appointment.service);
        const staff = await Staff.findById(appointment.staff);
        const patient = await Patient.findById(appointment.patient);
        const department = staff ? await Department.findById(staff.department) : null;

        if (!service || !staff || !patient || !department) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const newAppointment = new Appointment(appointment);
        await newAppointment.save();
        if (newAppointment) {
            return res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
        } else {
            return res.status(400).json({ message: 'Appointment creation failed' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('service')
            .populate('staff')
            .populate('patient').sort({date: 1});

        if (appointments) {
            return res.status(200).json({ appointments });
        } else {
            return res.status(404).json({ message: 'No appointments found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    const {id} = req.params;
    try {
        const appointment = await Appointment.findById(id)
            .populate('service')
            .populate('staff')
            .populate('patient');

        if (appointment) {
            return res.status(200).json({ appointment });
        } else {
            return res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateAppointment = async (req, res) => {
    const {id} = req.params;
    const appointment = req.body;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, appointment, { new: true });

        if (updatedAppointment) {
            return res.status(200).json({ message: 'Appointment updated successfully', appointment: updatedAppointment });
        } else {
            return res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        return res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteAll = async (req, res) => {
    try {
        await Appointment.deleteMany({});
        return res.status(200).json({ message: 'All appointments deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const changeStatus = async (req, res) => {
    const {id} = req.params;
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        const updatedAppointment = await appointment.save();
        if (updatedAppointment) {
            return res.status(200).json({ message: 'Appointment status updated successfully', appointment: updatedAppointment });
        } else {
            return res.status(400).json({ message: 'Appointment status update failed' });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getAppointmentsByPatient = async (req, res) => {
    const {patientId} = req.params;
    try {
        const appointments = await Appointment.find({ patient: patientId })
            .populate('service')
            .populate('staff')
            .populate('patient');

        if (appointments) {
            return res.status(200).json({ appointments });
        } else {
            return res.status(404).json({ message: 'No appointments found' });
        }
        // console.log(appointments)
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createAppointment,
    changeStatus,
    deleteAppointment,
    updateAppointment,
    getAppointmentById,
    getAllAppointments,
    deleteAll,
    getAppointmentsByPatient
}
