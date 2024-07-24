const Service = require('../models/Service');
const Department = require('../models/Department');

const getServices = async (req, res) => {
    try {
        const services = await Service.find().populate('department');
        res.json({ services });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('department');
        if (service) {
            res.json({ service });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createService = async (req, res) => {
    try {
        const service = req.body;
        const department = await Department.findById(service.departmentId);

        if (department) {
            const newService = new Service({
                department: department,
                service: service.service,
                price: service.price
            });
            const createdService = await newService.save();
            res.status(201).json({ service: createdService });
        } else {
            res.status(404).json({ message: 'Department not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateService = async (req, res) => {
    try {
        const service = req.body;
        const currentService = await Service.findById(req.params.id);

        if (currentService) {
            const department = await Department.findById(service.departmentId);
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }

            currentService.department = department;
            currentService.service = service.service;
            currentService.price = service.price;
            const updatedService = await currentService.save();
            res.status(201).json({ service: updatedService });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteService = async (req, res) => {
    console.log(req.params);
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (service) {
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getServiceByDepartment = async (req, res) => {
    const {id} = req.params;
    try {
        const services = await Service.find({ department: id }).populate('department');
        if (services) {
            res.status(200).json({ services });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    getServiceByDepartment
};
