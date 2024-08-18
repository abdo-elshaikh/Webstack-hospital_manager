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

const getServicesByType = async (req, res) => {
    const { type } = req.params;
    try {
        const services = await Service.find({ 'prices.type': type });
        if (services) {
            res.status(200).json({ services, message: 'success' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getServicePriceByType = async (req, res) => {
    // console.log(req.params);
    const { id, type } = req.params;
    try {
        const service = await Service.findById(id);
        if (service) {
            const price = service.prices.find(price => price.type === type);
            res.status(200).json({ price, message: 'success' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createService = async (req, res) => {
    try {
        const { departmentId, service, prices } = req.body;
        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const newService = new Service({
            department: department,
            service: service,
            prices: prices.map(price => ({
                type: price.type,
                price: price.price,
                description: price.description
            }))
        });

        const createdService = await newService.save();
        res.status(201).json({ service: createdService });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateService = async (req, res) => {
    try {
        const { departmentId, service, prices } = req.body;
        const currentService = await Service.findById(req.params.id);

        if (!currentService) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        currentService.department = department;
        currentService.service = service;
        currentService.prices = prices.map(price => ({
            type: price.type,
            price: price.price,
            description: price.description
        }));

        const updatedService = await currentService.save();
        res.status(201).json({ service: updatedService });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteService = async (req, res) => {
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
    const { id } = req.params;
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
    getServiceByDepartment,
    getServicesByType,
    getServicePriceByType
};
