import { Button, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
// import { createAppointment } from '../../services/appointmentService';
import { getAllBooks, getBookingByUser, getBookingBetweenDate } from '../../services/bookingService';
// import {getPatientById, createPatient} from '../../services/PatientService';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/appointments.css';

const BookAppointment = () => {
    const [bookings, setBookings] = useState([]);
    // const [patient, setPatient] = useState({});
    // const [showBookings, setShowBookings] = useState(false);

    useEffect(() => {
        getAllBooks().then((data) => {
            if (data.error) {
                toast.error(data.error);
        } else {
            setBookings(data.appointments);
            console.log(data.appointments)
        }
    });
    }, []);

    return (
    <>
        {bookings.length > 0 ?
            <div className="book-appointment">
                <ToastContainer />
                <h1>Book Appointment</h1>
                <div className="book-appointment-form">
                    {/* <Button onClick={handleClose}>Close</Button> */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Reason</th>
                                <th>Department</th>
                                <th>Service</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Book Date</th>

                            </tr>
                        </thead>
                        <tbody>
                            {bookings?.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.name}</td>
                                    <td>{booking.age}</td>
                                    <td>{booking.phone}</td>
                                    <td>{booking.address}</td>
                                    <td>{booking.reason}</td>
                                    <td>{booking.department.name}</td>
                                    <td>{booking.service.service}</td>
                                    <td>{booking.user.name}</td>
                                    <td>{booking.status}</td>
                                    <td>{booking.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div> :
            <div className="book-appointment">
                <ToastContainer />
                <h1>Book Appointment</h1>
                <div className="book-appointment-form">
                    {/* <Button onClick={handleClose}>Close</Button> */}
                </div>
            </div>
        }
    </>
);
}
export default BookAppointment;
