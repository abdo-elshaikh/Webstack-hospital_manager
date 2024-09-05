import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography, Card, CardContent, TextField, CardActions } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAuth from "../../contexts/useAuth";
import { toast } from "react-toastify";
import { Done } from "@mui/icons-material";
import { archiveContact, readContact } from "../../services/contactService";

const ContactView = () => {
    const { user } = useAuth();
    const { contactId } = useParams();
    const location = useLocation();
    const contact = location.state?.contact;
    const [contactData, setContactData] = useState(contact);
    const navigate = useNavigate();

    useEffect(() => {
        if (contact.status !== 'read') {
            read();
        }
    }, [contactId]);

    const read = async () => {
        const data = await readContact(contactId, user);
        if (data.error) {
            toast.error(data.error);
        } else {
            setContactData(data.contact);
        }
    };

    const archive = async () => {
        const data = await archiveContact(contactId, user);
        if (data.error) {
            toast.error(data.error);
        } else {
            toast.success("Contact archived successfully");
            navigate("/admin/contacts");
        }
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            {/* contact data section */}
            <Grid container sx={{ p: 2 }} spacing={2}>
                {/* title section */}
                <Grid item xs={12} spacing={2}>
                    <Typography variant="h5" component="h2" g u textAlign={'center'} gutterBottom>
                        Contact Details
                    </Typography>
                </Grid>
                {/* name and email section */}
                <Grid item xs={12} md={6} spacing={2}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'row', md: 'column' },
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            height: '100%',
                            backgroundColor: '#endregion',
                            gap: 1,
                            padding: 2
                        }}
                    >
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            value={contactData.name}
                            sx={{ width: '100%' }}
                            disabled
                        />
                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            value={contactData.email}
                            sx={{ width: '100%' }}
                            disabled
                        />
                        <TextField
                            id="status"
                            label="Status"
                            variant="outlined"
                            value={contactData.status}
                            sx={{ width: '100%' }}
                            disabled
                        />
                    </Box>
                </Grid>
                {/* message section */}
                <Grid item xs={12} md={6} spacing={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            backgroundColor: '#f5f5f5',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                Message
                            </Typography>
                            <Typography>
                                {contactData.message}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* button section */}
                <Grid item xs={12} md={12} gap={2} sx={{ display: 'flex', justifyContent: 'flex-end' }} spacing={2}>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={archive}
                        startIcon={<Done />}
                    >
                        Archive
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate("/admin/contacts")}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );

};

export default ContactView;