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
import { Modal, Button, Table, Row, Col, Form, FormControl, FormGroup, FormLabel, FormSelect, Dropdown } from 'react-bootstrap';
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
        <div className='patient'>
            <div className='patient-header'>
                <h1>Patients</h1>
                <Button onClick={() => setIsModalOpen(true)}>Add Patient</Button>
            </div>
            <Row className='search'>
                <Col md={12}>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <FormLabel>Search</FormLabel>
                                    <FormControl type='text' name='search' value={search} onChange={handleSearchChange} />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <FormLabel>Search By</FormLabel>
                                    <FormSelect name='searchType' value={searchType} onChange={handleSearchTypeChange}>
                                        <option value='name'>Name</option>
                                        <option value='code'>Code</option>
                                    </FormSelect>
                                </FormGroup>
                            </Col>
                            <Col md={2}>
                                <Button onClick={handleSearch}>Search</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResult.length > 0
                        ? searchResult.map((p) => (
                            <tr key={p._id}>
                                <td>{p.code}</td>
                                <td>{p.name}</td>
                                <td>{p.age}</td>
                                <td>{p.address}</td>
                                <td>{p.phone}</td>
                                <td>{p.description}</td>
                                <td>
                                </td>
                            </tr>
                        ))
                        : patients.map((p) => (
                            <tr key={p._id}>
                                <td>{p.code}</td>
                                <td>{p.name}</td>
                                <td>{p.age}</td>
                                <td>{p.address}</td>
                                <td>{p.phone}</td>
                                <td>{p.description}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant='success' id='dropdown-basic'>
                                            Actions
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item as={Link} to={`/admin/appointments/patient/${p._id}`}>Add Appointment</Dropdown.Item>
                                            <Dropdown.Item onClick={() => {
                                                setPatient(p);
                                                setIsEdit(true);
                                                setIsModalOpen(true);
                                            }
                                            }>Edit</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDelete(p._id)}>Delete</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>                                    
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
                    <Form>
                        <FormGroup>
                            <FormLabel>Name</FormLabel>
                            <FormControl type='text' name='name' value={patient.name} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Age</FormLabel>
                            <FormControl type='number' name='age' value={patient.age} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Address</FormLabel>
                            <FormControl type='text' name='address' value={patient.address} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Phone</FormLabel>
                            <FormControl type='text' name='phone' value={patient.phone} onChange={handleInputChange} />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl type='text' name='description' value={patient.description} onChange={handleInputChange} />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleCreateOrEdit}>{isEdit ? 'Edit' : 'Add'}</Button>
                    <Button onClick={handleModalClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

Patient.propTypes = {
    currentUser: PropTypes.object,
};

export default Patient;
