import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppointmentById } from '../../services/appointmentService';
import '../../styles/appointments.css';

const AppointmentDetailPage = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointment = async () => {
            const result = await getAppointmentById(id);
            if (result.error) {
                setError(result.error);
            } else {
                setAppointment(result.appointment);
            }
            setLoading(false);
        };

        fetchAppointment();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!appointment) return <div>Appointment not found</div>;

    return (
        <div className="appointment-detail-container">
            <h1>Appointment Details</h1>
            <div>
                <p><strong>ID:</strong> {appointment._id}</p>
                <p><strong>Patient:</strong> {appointment.patient.name}</p>
                <p><strong>Service:</strong> {appointment.service.name}</p>
                <p><strong>Staff:</strong> {appointment.staff.name}</p>
                <p><strong>Date:</strong> {new Date(appointment.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
            </div>
            <Link to="/admin/appointments" className="btn btn-primary">Back to Appointments</Link>
        </div>
    );
};

export default AppointmentDetailPage;
