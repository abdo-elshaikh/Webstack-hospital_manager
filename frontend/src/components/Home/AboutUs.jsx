import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, useTheme, useMediaQuery, Divider } from '@mui/material';

const teamMembers = [
    {
        name: 'John Doe',
        role: 'CEO',
        image: 'https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg',
        description: 'John is the visionary behind our mission and ensures that we stay true to our core values.',
    },
    {
        name: 'Jane Smith',
        role: 'CTO',
        image: 'https://www.shutterstock.com/image-photo/profile-photo-attractive-family-doc-600nw-1724693776.jpg',
        description: 'Jane leads our technology team and is responsible for all technical innovations.',
    },
    {
        name: 'Mark Johnson',
        role: 'CFO',
        image: 'https://t4.ftcdn.net/jpg/07/07/89/33/360_F_707893394_5DEhlBjWOmse1nyu0rC9T7ZRvsAFDkYC.jpg',
        description: 'Mark is responsible for overall financial management and is responsible for all financial matters.',
    },
    {
        name: 'Sarah Williams',
        role: 'COO',
        image: 'https://st4.depositphotos.com/1017986/21088/i/450/depositphotos_210888716-stock-photo-happy-doctor-with-clipboard-at.jpg',
        description: 'Sarah is responsible for overall operational management and is responsible for all operational matters.',
    },
    {
        name: 'Michael Brown',
        role: 'CIO',
        image: 'https://images.fineartamerica.com/images-medium-large/10-doctor-.jpg',
        description: 'Michael is responsible for overall strategic planning and is responsible for all strategic matters.',
    },
    {
        name: 'Emily Davis',
        role: 'CIO',
        image: 'https://pyxis.nymag.com/v1/imgs/576/191/a6fade5a35bff53d16c14a2af53f3c6852-31-dr-mike.rsquare.w400.jpg',
        description: 'Emily is responsible for overall strategic planning and is responsible for all strategic matters.',
    },
    // Add more team members
];

const AboutUs = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box sx={{ py: 8, bgcolor: theme.palette.background.default }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{ 
                        mb: 6, 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: theme.palette.text.primary,
                        letterSpacing: '0.05em',
                    }}
                >
                    About Us
                </Typography>
                <Typography
                    variant="h6"
                    component="p"
                    sx={{
                        mb: 6,
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                        maxWidth: '800px',
                        margin: '0 auto',
                        marginBottom: '20px',
                    }}
                >
                    We are dedicated to providing the best healthcare solutions with a focus on compassion and innovation. Our team of experts is committed to making a difference in the community.
                </Typography>
                <Divider sx={{ mb: 6 }} />
                <Grid container spacing={4}>
                    {teamMembers.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.name}>
                            <Card
                                sx={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    boxShadow: 3,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    sx={{ 
                                        width: isMobile ? 150 : 200, 
                                        height: isMobile ? 150 : 200,
                                        objectFit: 'cover',
                                        border: '2px solid',    
                                        borderRadius: '50%', 
                                        mt: 3 
                                    }}
                                    image={member.image}
                                    alt={member.name}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {member.role}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
                                        {member.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/home/contact-us"
                        sx={{ 
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
                        }}
                    >
                        Contact Us
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default AboutUs;
