import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, updateAppointment } from '../../services/appointmentService';
import '../../styles/appointments.css'; // Adjust the path as needed

const AppointmentEditPage = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        patient: '',
        service: '',
        staff: '',
        date: '',
        status: 'Scheduled'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointment = async () => {
            const result = await getAppointmentById(id);
            if (result.error) {
                setError(result.error);
            } else {
                setFormData(result.appointment);
            }
            setLoading(false);
        };

        fetchAppointment();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateAppointment(id, formData);
        if (result.error) {
            setError(result.error);
        } else {
            navigate('/admin/appointments');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="appointment-edit-container">
            <h1>Edit Appointment</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Patient:
                    <input type="text" name="patient" value={formData.patient} onChange={handleChange} required />
                </label>
                <label>
                    Service:
                    <input type="text" name="service" value={formData.service} onChange={handleChange} required />
                </label>
                <label>
                    Staff:
                    <input type="text" name="staff" value={formData.staff} onChange={handleChange} required />
                </label>
                <label>
                    Date:
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
                </label>
                <label>
                    Status:
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </label>
                <button type="submit" className="btn btn-primary">Update Appointment</button>
            </form>
        </div>
    );
};

export default AppointmentEditPage;
