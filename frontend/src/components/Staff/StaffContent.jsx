import { Container } from '@mui/material';
import { PropTypes } from 'prop-types';


const StaffContent = ({ title, children }) => {
    document.title = `Staff - ${title} | HMS`;
    return (
        <>
            {children}
        </>
    );
};

StaffContent.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default StaffContent;
