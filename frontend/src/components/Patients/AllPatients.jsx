import { getPatients } from "../../services/PatientService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const AllPatients = () => {
    const [patients, setPatients] = useState([]);
    
    useEffect(() => {
        fetchAllPatients();
    }, []);

    const fetchAllPatients = () => {
        setPatients([]);
        getPatients()
            .then(response => {
                if (!response || !Array.isArray(response.patients)) {
                    toast.error('Failed to fetch patients');
                    return;
                }
                setPatients(response.patients);
            })
            .catch(error => {
                toast.error('Failed to fetch patients', error);
            });
    };

    
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Patients</h4>
                            <div className="row">
                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table id="zero_config" className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Code</th>
                                                    <th>Age</th>
                                                    <th>Gender</th>
                                                    <th>Phone</th>
                                                    <th>Address</th>
                                                    <th>Description</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patients.map((patient) => (
                                                    <tr key={patient._id}>
                                                        <td>{patient.name}</td>
                                                        <td>{patient.code}</td>
                                                        <td>{patient.age}</td>
                                                        <td>{patient.gender}</td>
                                                        <td>{patient.phone}</td>
                                                        <td>{patient.address}</td>
                                                        <td>{patient.description}</td>
                                                        <td>
                                                            <Link
                                                                to={`/admin/appointments/patient/${patient._id}`}
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>

                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllPatients;
