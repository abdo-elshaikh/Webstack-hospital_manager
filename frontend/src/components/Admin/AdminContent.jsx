import { Box, Typography, Toolbar } from '@mui/material';
import { PropTypes } from 'prop-types';
import AdminSubHeader from './AdminSubHeader';


const AdminContent = ({ title, children }) => {
    document.title = `Admin - ${title} | HMS`;
    return (
        <Box sx={{ flexGrow: 1 , width: '100%'}}>
            <AdminSubHeader title={title} />
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

AdminContent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default AdminContent;
