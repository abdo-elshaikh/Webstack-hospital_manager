import React from 'react';
import { Grid, Container, Typography, Card, CardMedia, CardContent } from '@mui/material';

const galleryImages = [
    {
        src: 'https://picsum.photos/800/600?random=1',
        title: 'Healthcare Facility',
        description: 'State-of-the-art healthcare facility with modern amenities.'
    },
    {
        src: 'https://picsum.photos/800/600?random=2',
        title: 'Advanced Technology',
        description: 'Equipped with the latest medical technology for accurate diagnoses.'
    },
    {
        src: 'https://picsum.photos/800/600?random=3',
        title: 'Compassionate Care',
        description: 'Our team is dedicated to providing compassionate care to all patients.'
    },
    {
        src: 'https://picsum.photos/800/600?random=4',
        title: 'Experienced Staff',
        description: 'Our experienced staff is here to support you every step of the way.'
    },
    {
        src: 'https://picsum.photos/800/600?random=5',
        title: 'Patient Rooms',
        description: 'Comfortable and private patient rooms designed for recovery.'
    },
    {
        src: 'https://picsum.photos/800/600?random=6',
        title: 'Community Outreach',
        description: 'We actively engage with the community through various outreach programs.'
    }
];

const Gallery = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 5 }}>
            <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
                Gallery
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" textAlign="center" mb={4}>
                Explore our facilities and services through our gallery.
            </Typography>
            <Grid container spacing={4}>
                {galleryImages.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={image.src}
                                alt={image.title}
                            />
                            <CardContent>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {image.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {image.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Gallery;
