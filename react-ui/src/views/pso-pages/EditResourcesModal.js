import React, { useState } from 'react';
import { Modal, Button, TextField, Input } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';

const useStyles = makeStyles({
    modalContainer: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: '0.2rem',
        padding: '20px'
    },
    inputContainer: {
        marginBottom: '10px'
    },
    numberInput: {
        border: '1px solid grey',
        margin: '.5rem',
        width: '5vw',
        padding: '5px'
    },
    button: {
        marginRight: '0.5rem'
    }
});

const EditResourcesModal = ({ open, onClose }) => {
    const classes = useStyles();
    const [manpower, setManpower] = useState('');
    const [manpowerCount, setManpowerCount] = useState('');
    const [equipment, setEquipment] = useState('');
    const [equipmentCount, setEquipmentCount] = useState('');

    const handleManpowerChange = (event) => {
        setManpower(event.target.value);
    };

    const handleManpowerCountChange = (event) => {
        setManpowerCount(event.target.value);
    };

    const handleEquipmentChange = (event) => {
        setEquipment(event.target.value);
    };

    const handleEquipmentCountChange = (event) => {
        setEquipmentCount(event.target.value);
    };

    const handleSave = () => {
        // Implement save functionality here
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className={classes.modalContainer}>
                <div className={classes.modalContent}>
                    <h2>Edit Resources</h2>
                    <div className={classes.inputContainer}>
                        <h3>Required Manpower</h3>
                        <TextField label="Manpower Skill 1" value={manpower} onChange={handleManpowerChange} />
                        <Input type="number" value={manpowerCount} className={classes.numberInput} onChange={handleManpowerCountChange} />
                        {/* Add more manpower inputs as needed */}
                    </div>
                    <div className={classes.inputContainer}>
                        <h3>Required Equipment</h3>
                        <TextField label="Equipment" value={equipment} onChange={handleEquipmentChange} />
                        <Input type="number" value={equipmentCount} className={classes.numberInput} onChange={handleEquipmentCountChange} />
                        {/* Add more equipment inputs as needed */}
                    </div>
                    <div>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={handleSave}>
                            Save
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditResourcesModal;
