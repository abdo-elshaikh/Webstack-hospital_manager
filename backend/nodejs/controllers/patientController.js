const Patient = require('../models/Patient');

const getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findById(id);
        if (patient) {
            res.status(200).json({ patient, message: `Success get ${patient.name}` });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients) {
            res.status(200).json({ patients, message: 'Success get all patients' });
        } else {
            res.status(404).json({ message: 'Patients not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createPatient = async (req, res) => {
    const patient = req.body;
    try {
        const newPatient = await Patient.create(patient);
        if (newPatient) {
            res.status(201).json({ patient: newPatient, message: `Success create ${newPatient.name}` });
        } else {
            res.status(404).json({ message: 'Patient not Created' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const updatePatient = await Patient.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (updatePatient) {
            res.status(200).json({ patient: updatePatient, message: `Success update ${updatePatient.name}` });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findByIdAndDelete(id);
        if (patient) {
            res.status(200).json({ patient, message: `Success delete ${patient.name}` });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientsByName = async (req, res) => {
    console.log(req.body);
    const { name } = req.body;

    try {
        const patients = await Patient.find({
            name: { $regex: new RegExp(name, 'i') }
        });

        if (patients.length > 0) {
            res.status(200).json({ patients, message: 'Successfully retrieved patients' });
        } else {
            res.status(404).json({ message: 'Patient(s) not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientByCode = async (req, res) => {
    console.log(req.body);
    const { code } = req.body;
    try {
        const patient = await Patient.findOne({ code });
        if (patient) {
            res.status(200).json({ patient, message: `Successfully retrieved patient` });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMaxPatientCode = async (req, res) => {
    try {
        const sortedPatients = await Patient.find({}).sort({ code: -1 }).limit(1);
        const maxCode = sortedPatients.length > 0 ? sortedPatients[0].code : null;
        res.status(200).json({ maxCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPatientById,
    getPatients,
    createPatient,
    updatePatient,
    deletePatient,
    getPatientsByName,
    getPatientByCode,
    getMaxPatientCode
};
