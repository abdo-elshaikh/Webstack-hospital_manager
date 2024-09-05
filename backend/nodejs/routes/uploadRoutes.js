import { upload } from '../utils/upload';
import { protect } from '../middleware/auth';
const router = require('express').Router();

// Define the route for image upload
router.post('/images', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        res.status(200).json({ url: `/uploads/${req.file.filename}` });
    } catch (err) {
        console.error('Error in /images POST route:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
