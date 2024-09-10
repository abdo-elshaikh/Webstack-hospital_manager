import { toast } from 'react-toastify';
import { getPositions } from '../services/positionService';

const getPositions = async () => {
    try {
        const data = await getPositions();
        return data.positions;
    } catch (error) {
        toast.error(error.message);
    }
}

