const Position = require('../models/Position');

const getPositionById = async (req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        if (position) {
            res.status(200).json({position});
        } else {
            res.status(404).json({ message: 'Position not found'});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getPositions = async (req, res) => {
    try {
        const positions = await Position.find();
        if (positions) {
            res.status(200).json({positions});
        } else {
            res.status(404).json({ message: 'No positions found'});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createPosition = async (req, res) => {
    const {name, description} = req.body;
    try {
        const newPosition = await Position.create({name, description});
        if (newPosition) {
            res.status(201).json({ message: 'Position created', position: newPosition });
        } else {
            res.status(400).json({ message: 'Invalid position data '});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updatePosition = async (req, res) => {
    try {
        const position = await Position.findById(req.params.id);
        position.name = req.body.name || position.name;
        position.description = req.body.description || position.description;

        const updatedPosition = await position.save();
        if (updatePosition) {
            res.status(200).json({ message: 'Position updated' });
        } else {
            res.status(404).json({ message: 'Position not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deletePosition = async (req, res) => {
    try {
        const position = await Position.findByIdAndDelete(req.params.id);
        if (position) {
            res.status(200).json({ message: 'Position deleted' });
        } else {
            res.status(404).json({ message: 'Position not found'});
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getPositionById,
    getPositions,
    createPosition,
    updatePosition,
    deletePosition,
}
