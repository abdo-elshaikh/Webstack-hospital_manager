import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';

const AboutUs = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 5, px: { xs: 2, md: 0 } }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Learn more about our mission, values, and team.
                </Typography>
            </Box>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Our Mission
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Our mission is to provide the best healthcare services to our community with a focus on quality, innovation, and compassion. We strive to exceed the expectations of our patients and their families.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Our Values
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We believe in integrity, excellence, and respect for all individuals. Our values guide our decisions and actions, ensuring that we deliver the best care possible while fostering a positive environment for our patients and staff.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Our Team
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Our team is composed of dedicated professionals who are passionate about healthcare. From our doctors and nurses to our administrative staff, everyone at our organization is committed to making a difference in the lives of our patients.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h3" gutterBottom>
                        Why Choose Us
                    </Typography>
                    <Typography variant="body1" paragraph>
                        With years of experience and a patient-centered approach, we are the preferred choice for healthcare in our community. We combine advanced technology with personalized care to ensure the best outcomes for our patients.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AboutUs;
