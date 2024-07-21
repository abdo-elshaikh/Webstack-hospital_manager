const Department = require('../models/Department');

const getDepartmentById = async (req, res) => {
    const { id } = req.params || req.body;
    try {
        const department = await Department.findById(id);
        if (department) {
            res.status(200).json({ department });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ departments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createDepartment = async (req, res) => {
    const { name, description } = req.body;
    try {
        const department = new Department({
            name,
            description,
        });
        const newDepartment = await department.save();
        res.status(201).json({ department: newDepartment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findById(id);
        if (department) {
            department.name = req.body.name || department.name;
            department.description = req.body.description || department.description;
            const updatedDepartment = await department.save();
            res.status(200).json({ department: updatedDepartment });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const department = await Department.findByIdAndDelete(id);
        if (department) {
            res.status(200).json({ message: 'Department deleted' });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getDepartmentById,
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
}