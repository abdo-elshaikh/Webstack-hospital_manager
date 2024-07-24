import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAppointments } from '../../services/appointmentService';
import { getUserById } from '../../services/AdminService';
import '../../styles/appointments.css';

const AppointmentListPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const result = await getAppointments();
                if (result.error) {
                    setError(result.error);
                } else {
                    const updatedAppointments = await Promise.all(result.appointments.map(async (appointment) => {
                        const staffData = await getUserById(appointment.staff.user);
                        return {
                            ...appointment,
                            staffName: staffData.name,
                        };
                    }));
                    setAppointments(updatedAppointments);
                }
            } catch (err) {
                setError('An unexpected error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="appointments-container">
            <h1>Appointments</h1>
            <Link to="/admin/appointments/create" className="btn btn-primary">Create Appointment</Link>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Patient</th>
                        <th>Service</th>
                        <th>Staff</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment._id}>
                            <td>{appointment.patient.code}</td>
                            <td>{appointment.patient.name}</td>
                            <td>{appointment.service.service}</td>
                            <td>{appointment.staffName}</td>
                            <td>{new Date(appointment.date).toLocaleString()}</td>
                            <td>{appointment.status}</td>
                            <td>
                                <Link to={`/admin/appointments/${appointment._id}`}>View</Link>
                                <Link to={`/admin/appointments/edit/${appointment._id}`} className="btn btn-secondary">Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentListPage;
