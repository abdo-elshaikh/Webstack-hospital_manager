const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(`File: ${file.originalname}`);
        try {
            // Define the correct path for the uploads directory with server proxy
            const destFolder = path.join(__dirname, '../uploads/');
            console.log(`Destination Path: ${destFolder}`);

            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
                console.log('Uploads folder created');
            }

            cb(null, destFolder);
        } catch (err) {
            console.error('Error in destination:', err);
            cb(err || new Error('Failed to create destination folder'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Filter for allowed file types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
        cb(new Error('Invalid file type'), false);
        return;
    }
    cb(null, true);
};

// Set up multer middleware
const upload = multer({ storage, fileFilter });

module.exports = { upload };
