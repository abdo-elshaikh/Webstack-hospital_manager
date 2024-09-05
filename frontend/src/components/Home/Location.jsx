import React, { useState } from 'react';
import { Container, Grid, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';

const branches = [
    {
        name: "Main Branch",
        address: "123 Health St, Medicity, USA",
        phone: "+1 (123) 456-7890",
        email: "contact@hospital.com",
        mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363159041!3d-37.817209742583665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f01f59bf%3A0xbbf631f3aab9ed5a!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1646356747888!5m2!1sen!2sau"
    },
    {
        name: "Branch 2",
        address: "456 Wellness Rd, Healthville, USA",
        phone: "+1 (234) 567-8901",
        email: "info@branch2hospital.com",
        mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363159041!3d-37.817209742583665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f01f59bf%3A0xbbf631f3aab9ed5a!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1646356747888!5m2!1sen!2sau"
    },
    {
        name: "Branch 3",
        address: "789 Treatment St, Treatmentville, USA",
        phone: "+1 (345) 678-9012",
        email: "info@branch3hospital.com",
        mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537363159041!3d-37.817209742583665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f01f59bf%3A0xbbf631f3aab9ed5a!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1646356747888!5m2!1sen!2sau"
    }
];

const Location = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container sx={{ position: 'relative', marginTop: '70px', color: 'text.primary' }}>
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Our Locations
            </Typography>

            <Typography variant="subtitle1" gutterBottom align="center" sx={{ color: 'text.secondary', marginTop: '10px', marginBottom: '40px' }}>
                Find us here in different branches of the hospital and get in touch with us.
            </Typography>
            
            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{ marginBottom: 4, borderBottom: '2px solid', borderColor: 'primary.main', color: 'primary.main' }}
            >
                {branches.map((branch, index) => (
                    <Tab 
                        key={index} 
                        label={branch.name} 
                        sx={{ color: tabIndex === index ? 'primary.main' : 'text.secondary' }} 
                    />
                ))}
            </Tabs>

            <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
                <Grid container spacing={4}>
                    {/* Map Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                            <iframe
                                title={`${branches[tabIndex].name} Location`}
                                src={branches[tabIndex].mapSrc}
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </Box>
                    </Grid>

                    {/* Contact Information Section */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ textAlign: 'left', p: 2 }}>
                            <Typography variant="h5" component="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                Contact Information
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ mr: 2, color: 'secondary.main' }} />
                                <Typography variant="body1">
                                    {branches[tabIndex].address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Phone sx={{ mr: 2, color: 'secondary.main' }} />
                                <Typography variant="body1">
                                    {branches[tabIndex].phone}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Email sx={{ mr: 2, color: 'secondary.main' }} />
                                <Typography variant="body1">
                                    {branches[tabIndex].email}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Location;
