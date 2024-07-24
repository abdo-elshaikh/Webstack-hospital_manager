import Staff from '../models/Staff';
import User from '../models/User';
import Department from '../models/Department';
import Position from '../models/Position';

const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find().populate('user').populate('department').populate('position');
        if (staff) {
            res.status(200).json({ staff });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getStaff = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id).populate('user').populate('department').populate('position');
        if (staff) {
            res.status(200).json({ staff });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createStaff = async (req, res) => {
    const staff = req.body;
    try {
        const user = await User.findById(staff.userId);
        const department = await Department.findById(staff.departmentId);
        const position = await Position.findById(staff.positionId);
        const status = staff.status;
        const contact = staff.contact;
        const salary = staff.salary;
        const newStaff = await Staff.create({ user, department, position, status, contact, salary });
        if (newStaff) {
            res.status(201).json({ staff: newStaff });
        } else {
            res.status(400).json({ message: 'Invalid Staff data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateStaff = async (req, res) => {
    try {
        const staff = req.body;
        const currentStaff = await Staff.findById(req.params.id);

        if (currentStaff) {
            currentStaff.user = staff.user;
            currentStaff.department = staff.department;
            currentStaff.position = staff.position;
            currentStaff.status = staff.status;
            currentStaff.contact = staff.contact;
            currentStaff.salary = staff.salary;

            const updatedStaff = await currentStaff.save();
            res.status(200).json({ staff: updatedStaff });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (staff) {
            res.status(200).json({ message: 'Staff deleted successfully' });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getStaffByPosition = async (req, res) => {
    try {
        const staff = await Staff.find({ position: req.params.positionId })
            .populate('user').populate('department').populate('position');
        if (staff) {
            res.status(200).json({ staff });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getStaffByDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const staff = await Staff.find({ department: id })
            .populate('user').populate('department').populate('position');
        if (staff) {
            res.status(200).json({ staff });
        } else {
            res.status(404).json({ message: 'Staff not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getAllStaff, getStaff, createStaff, updateStaff, deleteStaff, getStaffByPosition, getStaffByDepartment };
