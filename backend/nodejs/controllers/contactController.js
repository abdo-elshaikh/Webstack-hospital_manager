const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    // console.log(req.body);
    const { name, email, message } = req.body;
    try {
        const createdContact = await Contact.create({ name, email, message });
        if (!createdContact) {
            res.status(400).json({ error: 'Failed to create contact, please try again!' });
        }
        res.status(201).json({ message: 'Thank you for your message, we will get back to you shortly' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact, please try again!' });
    }
}

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ contacts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get contacts, please try again!' });
    }
}

const readContact = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    try {
        const contact = await Contact.findById(id);
        if (contact) {
            const status = contact.status;
            if (status === 'received') {
                contact.read_by = user;
                contact.status = 'read';
                await contact.save();
                res.status(200).json({contact: contact, message: 'Contact marked as read successfully' });
            } else {
                res.status(400).json({ error: 'Contact already marked as read' });
            }
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark contact as read, please try again!' });
    }
}

const archiveContact = async (req, res) => {
    const { id } = req.params;
    const { user } = req.body;
    try {
        const contact = await Contact.findById(id);
        if (contact) {
            const status = contact.status;
            if (status === 'read') {
                contact.archived_by = user;
                contact.status = 'archived';
                await contact.save();
                res.status(200).json({ contact: contact, message: 'Contact marked as archived successfully' });
            } else {
                res.status(400).json({ error: 'Contact already marked as archived' });
            }
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark contact as archived, please try again!' });
    }
}

module.exports = { createContact, getAllContacts, readContact, archiveContact };
