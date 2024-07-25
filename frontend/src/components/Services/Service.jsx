import { useState, useEffect } from 'react';
import { getservices, createService, updateService, deleteService } from '../../services/priceService';
import { getAllDepartments } from '../../services/departmentService';
import { Modal, Button, Table, Alert, Dropdown, DropdownButton, DropdownItem, Toast, Form, FormControl, FormGroup, FormLabel, FormSelect, ToastHeader } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../../styles/service.css';

const Service = () => {
    const [services, setServices] = useState([]);
    const [service, setService] = useState({ departmentId: '', service: '', price: '' });
    const [departmentsService, setDepartmentsService] = useState([]);
    const [isInEdit, setIsInEdit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getservices().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setServices(data.services);
            }
        });
        getAllDepartments().then((data) => {
            if (data.error) {
                toast.error(data.error);
            } else {
                setDepartmentsService(data.departments);
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
            toast.error('All fields are required');
            return;
        }
        if (isInEdit) {
            const data = await updateService(service._id, service);
            if (data.error) {
                toast.error(data.error);
            } else {
                const updatedServices = services.map((s) =>
                    s._id === service._id ? data.service : s
                );
                setServices(updatedServices);
                toast.success('Service updated successfully');
            }
        } else {
            const data = await createService(service);
            if (data.error) {
                toast.error(data.error);
            } else {
                setServices([...services, data.service]);
                toast.success('Service created successfully');
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
            toast.error(data.error);
        } else {
            const filteredServices = services.filter((s) => s._id !== id);
            setServices(filteredServices);
            toast.success('Service deleted successfully');
        }
    };

    return (
        <div className="service">
            <h2>Services</h2>
            <Button
                variant="primary"
                onClick={() => {
                    setService({ departmentId: '', service: '', price: '' });
                    setIsModalOpen(true);
                }}
            >
                Add Service
            </Button>
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isInEdit ? 'Edit Service' : 'Add Service'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup>
                            <FormLabel>Department</FormLabel>
                            <FormSelect
                                name="departmentId"
                                value={service.departmentId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Department</option>
                                {departmentsService.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name}
                                    </option>
                                ))}
                            </FormSelect>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Service</FormLabel>
                            <FormControl
                                type="text"
                                name="service"
                                value={service.service}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Price</FormLabel>
                            <FormControl
                                type="text"
                                name="price"
                                value={service.price}
                                onChange={handleInputChange}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateOrUpdate}>
                        {isInEdit ? 'Update' : 'Create'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Table striped bordered hover>
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
                                <Button
                                    variant="primary"
                                    onClick={() => handleEdit(s._id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(s._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Service;
