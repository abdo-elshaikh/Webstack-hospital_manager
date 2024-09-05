const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, readContact, archiveContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.route('/contact').post(createContact);
router.route('/all').get(protect, getAllContacts);
router.route('/contact/read/:id').put(protect, readContact);
router.route('/contact/archive/:id').put(protect, archiveContact);

module.exports = router;