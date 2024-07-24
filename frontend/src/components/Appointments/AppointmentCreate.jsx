import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createAppointment } from '../../services/appointmentService';
import { getPatients } from '../../services/PatientService';
import { getServicesByDepartment } from '../../services/priceService';
import { getStaffByDepartment } from '../../services/staffService';
import { getAllDepartments } from '../../services/departmentService';
import '../../styles/appointments.css';

const AppointmentCreate = () => {
    const [appointmentData, setAppointmentData] = useState({
        patient: '',
        department: '',
        service: '',
        staff: '',
        date: '',
        reason: ''
    });

    const [patients, setPatients] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patientsData = await getPatients();
                if (patientsData.patients) {
                    setPatients(patientsData.patients);
                } else {
                    toast.error(patientsData.message)
                }
                
                const departmentsData = await getAllDepartments();
                if (departmentsData.departments) {
                    setDepartments(departmentsData.departments);
                } else {
                    toast.error(departmentsData.message)
                }
            } catch (error) {
                console.error('Error fetching patients or departments:', error)
            }
        };

        fetchData();
    }, []);

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setAppointmentData(prevData => ({ ...prevData, department: departmentId }));
        try {
            const servicesData = await getServicesByDepartment(departmentId);
            // console.log(servicesData.services);
            if (servicesData.services) {
                setServices(servicesData.services);
            } else {
                toast.error(servicesData.message);
            }
            const staffData = await getStaffByDepartment(departmentId);
            // console.log(staffData.staff);
            if (staffData.staff) {
                setStaff(staffData.staff);
            } else {
                toast.error(staffData.message);
            }
        } catch (error) {
            toast.error('Error fetching services or staff:',error)
        }
    };

    const handleChange = (e) => {
        setAppointmentData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createAppointment(appointmentData);
            if (result.error) {
                toast.error(`Error: ${result.error}`);
                setErrors(result.errors || {});
            } else {
                toast.success('Appointment created successfully');
                navigate('/admin/appointments');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
            console.error('Error creating appointment:', error);
        }
    };

    return (
        <div className="appointment-create-container">
            <h1>Create Appointment</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="patient">Patient</label>
                    <select
                        id="patient"
                        name="patient"
                        value={appointmentData.patient}
                        onChange={handleChange}
                    >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                            <option key={patient._id} value={patient._id}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                    {errors.patient && <span className="error">{errors.patient}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        name="department"
                        value={appointmentData.department}
                        onChange={handleDepartmentChange}
                    >
                        <option value="">Select Department</option>
                        {departments.map(department => (
                            <option key={department._id} value={department._id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                    {errors.department && <span className="error">{errors.department}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="service">Service</label>
                    <select
                        id="service"
                        name="service"
                        value={appointmentData.service}
                        onChange={handleChange}
                    >
                        <option value="">Select Service</option>
                        {services.map(service => (
                            <option key={service._id} value={service._id}>
                               Nmae: {service.service} - price: {service.price}
                            </option>
                        ))}
                    </select>
                    {errors.service && <span className="error">{errors.service}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="staff">Staff</label>
                    <select
                        id="staff"
                        name="staff"
                        value={appointmentData.staff}
                        onChange={handleChange}
                    >
                        <option value="">Select Staff</option>
                        {staff.map(staffMember => (
                            <option key={staffMember._id} value={staffMember._id}>
                                {staffMember.user.name}
                            </option>
                        ))}
                    </select>
                    {errors.staff && <span className="error">{errors.staff}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={appointmentData.date}
                        onChange={handleChange}
                    />
                    {errors.date && <span className="error">{errors.date}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={appointmentData.reason}
                        onChange={handleChange}
                    />
                    {errors.reason && <span className="error">{errors.reason}</span>}
                </div>

                <button type="submit">Create Appointment</button>
            </form>
        </div>
    );
};

export default AppointmentCreate;
