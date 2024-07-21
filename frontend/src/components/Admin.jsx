// src/components/Admin.js
import { Link, Route, Routes } from 'react-router-dom';
import Users from './Users';
import Department from './Departments/Department';
import Position from './Positions/Position';
import Service from './Services/Service';
import Staff from './Staff/Staff'
import NotFound from './NotFound';
import '../styles/admin.css';

const Admin = () => {
    return (
        <div className="admin-container">
            <div className="sidebar">
                <ul>
                    <li><Link to="/admin">Dashbord</Link></li>
                    <li><Link to="/admin/users">Users</Link></li>
                    <li><Link to="/admin/departments" >Departments</Link></li>
                    <li><Link to="/admin/services" >Services</Link></li>
                    <li><Link to="/admin/positions" >Positions</Link></li>
                    <li><Link to="/admin/patients" >Patients</Link></li>
                    <li><Link to="/admin/staff" >Staff</Link></li>
                    <li><Link to="/admin/appoentments" >Apoentments</Link></li>
                    <li><Link to="/admin/permissions">Permissions</Link></li>
                    <li><Link to="/" >Exit</Link></li>
                </ul>
            </div>

            <div className="main-content">
                <div>
                    <Routes>
                        <Route path="" Component={
                            () => {
                                return (
                                    <div className='container'>
                                        <h1>Welcome to Admin Panel</h1>
                                        <p>Select a menu item to get started</p>
                                    </div>
                                )
                            }
                        } />
                        <Route path="users" element={<Users />} />
                        <Route path="departments" element={<Department />} />
                        <Route path="services" element={<Service />} />
                        <Route path="positions" element={<Position />} />
                        <Route path="staff" element={<Staff />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};


export default Admin;
