import {
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientByName,
    getPatientByCode,
} from '../../services/PatientService';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/AuthService';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../styles/patient.css';

const Patient = ({ currentUser }) => {
    if (!currentUser) {
        currentUser = JSON.parse(localStorage.getItem('user'));
    }

    const [patients, setPatients] = useState([]);
    const emptyPatient = {
        name: '',
        code: '',
        age: 0,
        address: '',
        phone: '',
        description: '',
        create_by: currentUser,
    };

    const [patient, setPatient] = useState(emptyPatient);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        getPatients().then((response) => {
            if (response.error) {
                toast.error(response.error);
            } else {
                setPatients(response.patients);
            }
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchType === 'name') {
            getPatientByName(search).then((response) => {
                if (response.error) {
                    toast.error(response.error);
                } else {
                    setSearchResult(response.patients);
                    toast.success(response.message);
                }
            });
        } else {
            getPatientByCode(search).then((response) => {
                if (response.error) {
                    toast.error(response.error);
                } else {
                    setSearchResult(response.patients);
                    toast.success(response.message);
                }
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleCreateOrEdit = async (e) => {
        e.preventDefault();
        if (!validPhoneNumber(patient.phone)) {
            return;
        }
        if (isEdit) {
            const response = await updatePatient(patient._id, patient);
            if (response.error) {
                toast.error(response.error);
            } else {
                const updatedPatients = patients.map((p) => (p._id === patient._id ? response.patient : p));
                setPatients(updatedPatients);
                toast.success(response.message);
            }
        } else {
            const response = await createPatient({ ...patient, code: getNextCode() });
            if (response.error) {
                toast.error(response.error);
            } else {
                setPatients([...patients, response.patient]);
                toast.success(response.message);
            }
        }
        setPatient(emptyPatient);
        setIsEdit(false);
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        deletePatient(id).then((response) => {
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.success(response.message);
                setPatients(patients.filter((patient) => patient._id !== id));
            }
        });
    };

    const handleModalClose = () => {
        setPatient(emptyPatient);
        setIsEdit(false);
        setIsModalOpen(false);
    };

    const validPhoneNumber = (phoneNumber) => {
        const regex = /^01[0125][0-9]{8}$/;
        if (!regex.test(phoneNumber)) {
            toast.error('Phone number must be a valid Egyptian phone number');
            return false;
        }
        if (phoneNumber.length !== 11) {
            toast.error('Phone number must be 11 digits');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value, create_by: currentUser ? currentUser : getCurrentUser() });
    };

    const getNextCode = () => {
        const maxCode = Math.max(...patients.map((p) => parseInt(p.code, 10)), 0);
        return (maxCode + 1).toString();
    };

    return (
        <div>
            <div className="search">
                <Form onSubmit={handleSearch} className="search-form">
                    <Form.Group className="search-group">
                        <Form.Control as="select" value={searchType} onChange={handleSearchTypeChange}>
                            <option value="name">Name</option>
                            <option value="code">Code</option>
                        </Form.Control>
                        <Form.Control type="text" placeholder="Search" value={search} onChange={handleSearchChange} />
                        <Button type="submit">Search</Button>
                    </Form.Group>
                </Form>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>Add New Patient</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResult.length > 0
                        ? searchResult.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.code}</td>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.address}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.description}</td>
                                <td>
                                    <Link to={`/admin/appointments/patient/${patient._id}`}>View</Link>
                                    <Button
                                        onClick={() => {
                                            setPatient(patient);
                                            setIsEdit(true);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(patient._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                        : patients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.code}</td>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.address}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.description}</td>
                                <td>
                                    <Link to={`/admin/appointments/patient/${patient._id}`}>View</Link>
                                    <Button
                                        onClick={() => {
                                            setPatient(patient);
                                            setIsEdit(true);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(patient._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            <Modal show={isModalOpen} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Edit Patient' : 'Add Patient'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateOrEdit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={patient.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="age">
                            <Form.Label>Age</Form.Label>
                            <Form.Control
                                type="number"
                                name="age"
                                value={patient.age}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={patient.address}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={patient.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={patient.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button type="submit">{isEdit ? 'Edit' : 'Add'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

Patient.propTypes = {
    currentUser: PropTypes.object,
};

export default Patient;
