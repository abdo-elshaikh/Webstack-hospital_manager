import { useState, useEffect } from 'react';
import { getservices, createService, updateService, deleteService } from '../../services/priceService';
import { getAllDepartments } from '../../services/departmentService';
import Modal from '../../components/Modal';
import '../../styles/service.css';

const Service = () => {
    const [services, setServices] = useState([]);
    const [service, setService] = useState({ departmentId: '', service: '', price: '' });
    const [departmentsService, setDepartmentsService] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isInEdit, setIsInEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getservices().then((data) => {
            if (data.error) {
                setError(data.error);
                setMessage('');
            } else {
                setServices(data.services);
                setMessage('');
                setError('');
            }
        });
        getAllDepartments().then((data) => {
            if (data.error) {
                setError(data.error);
                setMessage('');
            } else {
                setDepartmentsService(data.departments);
                setMessage('');
                setError('');
            }
        });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setService({ ...service, [name]: value });
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        if (!service.departmentId || !service.service || !service.price) {
            setError('All fields are required');
            setMessage('');
            return;
        }
        if (isInEdit) {
            const data = await updateService(service._id, service);
            if (data.error) {
                setError(data.error);
                setMessage('');
            } else {
                const updatedServices = services.map((s) =>
                    s._id === service._id ? data.service : s
                );
                setServices(updatedServices);
                setMessage('Service updated successfully');
                setError('');
            }
        } else {
            const data = await createService(service);
            if (data.error) {
                setError(data.error);
                setMessage('');
            } else {
                setServices([...services, data.service]);
                setMessage('Service created successfully');
                setError('');
            }
        }
        setService({ departmentId: '', service: '', price: '' });
        setIsInEdit(false);
        setIsModalOpen(false);
    };

    const handleEdit = (id) => {
        const serv = services.find((s) => s._id === id);
        setService({ ...serv, departmentId: serv.department._id });
        setIsModalOpen(true);
        setIsInEdit(true);
    };

    const handleDelete = async (id) => {
        const data = await deleteService(id);
        if (data.error) {
            setError(data.error);
            setMessage('');
        } else {
            const filteredServices = services.filter((s) => s._id !== id);
            setServices(filteredServices);
            setMessage('Service deleted successfully');
            setError('');
        }
    };

    return (
        <div className="service-container">
            <div className="service-header">
            <h1>Service Management</h1>
            <button onClick={() => {
                setService({ departmentId: '', service: '', price: '' });
                setIsInEdit(false);
                setIsModalOpen(true);
            }}>Create Service</button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h1>{isInEdit ? 'Edit Service' : 'Create Service'}</h1>
                <p>Fill in the form below to create a new service</p>
                <form onSubmit={handleCreateOrUpdate} className='staff-form'>
                    <select name="departmentId" value={service.departmentId} onChange={handleInputChange} required>
                        <option value="">Select Department</option>
                        {departmentsService.map((d) => (
                            <option key={d._id} value={d._id} selected={service.departmentId === d._id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="service"
                        value={service.service}
                        placeholder="Service"
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        value={service.price}
                        placeholder="Price"
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">{isInEdit ? 'Update' : 'Create'}</button>

                    <button type="button" onClick={
                        () => {
                            setService({ departmentId: '', service: '', price: '' });
                            setIsInEdit(false);
                        }
                    }>Create New</button>
                    <button type='button' onClick={() => {setIsModalOpen(false)}}>Cancel</button>
                </form>
            </Modal>
            <hr />
            <div className="service-list">
                <table>
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Service</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s._id}>
                                <td>{s.department.name}</td>
                                <td>{s.service}</td>
                                <td>{s.price}</td>
                                <td>
                                    <button onClick={() => handleEdit(s._id)}>Edit</button>
                                    <button onClick={() => handleDelete(s._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {message && <p className="message success">{message}</p>}
            {error && <p className="message error">{error}</p>}
        </div>
    );
};

export default Service;
