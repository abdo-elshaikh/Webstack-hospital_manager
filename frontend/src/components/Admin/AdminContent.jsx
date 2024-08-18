import { Container, Typography } from '@mui/material';

const AdminContent = ({ title, children }) => {
    return (
        <Container sx={{ mt: 12 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {title}
            </Typography>
            {children}
        </Container>
    );
};

export default AdminContent;
