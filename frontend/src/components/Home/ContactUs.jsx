import { Container, Grid, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Person, Email, Message } from '@mui/icons-material';
import { createContact } from '../../services/contactService';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(contactDetails);
        const data = await createContact(contactDetails);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success(data.message);
            setContactDetails({
                name: '',
                email: '',
                message: ''
            });
        }
    };

    return (
        <Container sx={{ mt: 8, mb: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
                    Contact Us
                </Typography>
                {/* subtitle */}
                <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
                    Get in touch with us for any questions, comments, or concerns.
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                            }}
                        >
                            <TextField
                                label="Name"
                                name="name"
                                value={contactDetails.name}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <Person sx={{ mr: 1 }} />,
                                }}
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={contactDetails.email}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1 }} />,
                                }}
                            />
                            <TextField
                                label="Message"
                                name="message"
                                value={contactDetails.message}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
                                InputProps={{
                                    startAdornment: <Message sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                                }}
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Get in Touch
                        </Typography>
                        <Typography variant="body1">
                            If you have any questions or need further information, please feel free to contact us using the form. We're here to help and answer any queries you might have.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ContactUs;
