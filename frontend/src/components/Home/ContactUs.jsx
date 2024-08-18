import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ContactUs = () => {
    const [contactDetails, setContactDetails] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactDetails({ ...contactDetails, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here (e.g., send contactDetails to the server)
        toast.success('Thank you for contacting us! We will get back to you shortly.');
        setContactDetails({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <Container sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
                Contact Us
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <TextField
                            label="Name"
                            name="name"
                            value={contactDetails.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={contactDetails.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Message"
                            name="message"
                            value={contactDetails.message}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Get in Touch
                    </Typography>
                    <Typography variant="body1">
                        If you have any questions or need further information, please feel free to contact us using the form. We're here to help and answer any queries you might have.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactUs;
