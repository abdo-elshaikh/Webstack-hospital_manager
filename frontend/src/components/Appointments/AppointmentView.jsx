import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../contexts/useAuth";
import { Link } from "react-router-dom";
import { Box, Typography , Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";

const AppointmentView = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const appointmentData = location.state?.appointment;
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        if (appointmentData) {
            setAppointment(appointmentData);
            
        }
    }, [appointmentData]);

    if (!appointment) {
        return <div>Loading...</div>;
    }

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Appointment Details
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>{appointment.date.split("T")[0]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>{appointment.date.split("T")[1]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Patient</TableCell>
                            <TableCell>{appointment.patient?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Department</TableCell>
                            <TableCell>{appointment.department?.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Service</TableCell>
                            <TableCell>{appointment.service?.service}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Price</TableCell>
                            <TableCell>{appointment.price}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discount</TableCell>
                            <TableCell>{appointment.discount}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discount Reason</TableCell>
                            <TableCell>{
                                appointment.discountReason ? appointment.discountReason : "Not Provided"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                >
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default AppointmentView;
