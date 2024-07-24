const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const message = {
        from: `${process.env.FROM_NAME}<${process.env.FROM_MAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    
    try {
        const info = await transporter.sendMail(message);
        return info;
    } catch (error) {
        return error;
    }
}

module.exports = { sendEmail };
