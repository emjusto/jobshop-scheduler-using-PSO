// import React from 'react';

// // material-ui
// import { Typography } from '@material-ui/core';

// // project imports
// import MainCard from '../../ui-component/cards/MainCard';

// //==============================|| SAMPLE PAGE ||==============================//

// const NewEquipment = () => {
//     return (
//         <MainCard title="New Equipment">
//             <Typography variant="body2">
//                 Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
//                 enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue
//                 dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president,
//                 sunk in culpa qui officiate descent molls anim id est labours.
//             </Typography>
//         </MainCard>
//     );
// };

// export default NewEquipment;

// import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
// import { TextField, Button, Grid, MenuItem, Typography } from '@material-ui/core';
// import MainCard from '../../ui-component/cards/MainCard';

// const useStyles = makeStyles((theme) => ({
//   form: {
//     maxWidth: '400px',
//     margin: 'auto',
//     marginTop: theme.spacing(4),
//   },
//   button: {
//     marginTop: theme.spacing(2),
//   },
// }));

// const EquipmentForm = () => {
//   const classes = useStyles();
//   const [formData, setFormData] = useState({
//     equipmentName: '',
//     category: '',
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log(formData);
//   };

//   return (
//     <MainCard title="New Equipment">
//     <form className={classes.form} onSubmit={handleSubmit}>
//       <Typography variant="h6" gutterBottom>
//         Equipment Information
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Equipment Name"
//             name="equipmentName"
//             value={formData.equipmentName}
//             onChange={handleChange}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             select
//             label="Category"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//           >
//             <MenuItem value="category1">Material Handling</MenuItem>
//             <MenuItem value="category2">Excavator</MenuItem>
//             <MenuItem value="category3">Loaders</MenuItem>
//           </TextField>
//         </Grid>
//       </Grid>
//       <Button className={classes.button} variant="contained" color="primary" type="submit">
//         Add
//       </Button>
//     </form>
//     </MainCard>
//   );
// };

// export default EquipmentForm;

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid, MenuItem, Typography, Box, Input } from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    form: {
        maxWidth: '400px',
        margin: 'auto',
        marginTop: theme.spacing(4)
    },
    button: {
        marginTop: theme.spacing(2)
    },
    successMessage: {
        color: 'green',
        marginTop: theme.spacing(2)
    },
    errorMessage: {
        color: 'red',
        marginTop: theme.spacing(2)
    }
}));

const EquipForm = ({ onCancel, equips, setEquips, selectedEquip }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        equipName: '',
        description: '',
        productivity: '',
        unit: 'lifts per day'
    });

    useEffect(() => {
        if (selectedEquip) {
            setFormData({
                equipName: selectedEquip.name,
                description: selectedEquip.description,
                productivity: selectedEquip.productivity,
                unit: selectedEquip.unit
            });
        }
    }, [selectedEquip]);

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if equipName is empty
        if (!formData.equipName.trim()) {
            setErrorMessage('Equipment Name cannot be empty');
            return;
        }

        if (!formData.productivity) {
            setErrorMessage('Please indicate equipment productivity');
            return;
        }

        // Check if the equip name already exists
        const isDuplicateName = equips.some((equip) => equip.name === formData.equipName && equip.id !== selectedEquip?.id);
        if (isDuplicateName) {
            setErrorMessage('Equipment with the same name already exists');
            return;
        }
        try {
            if (selectedEquip) {
                // If editing existing equip
                await axios.put(`http://localhost:5000/update-equip/${selectedEquip.id}`, formData);
                const updatedEquips = equips.map((equip) => (equip.id === selectedEquip.id ? { ...equip, ...formData } : equip));
                setEquips(updatedEquips);
                setSuccessMessage('Equipment added successfully');
                setErrorMessage('');
                // Close the modal
                onCancel();
                // setTimeout(() => {
                //     window.location.reload();
                // }, 300);
            } else {
                if (equips.some((equip) => equip.name === formData.equipName)) {
                    setErrorMessage('Equipment with the same name already exists');
                    return;
                }
                // Send equipment data to the backend using Axios
                const response = await axios.post('http://localhost:5000/add-equip', formData);
                console.log(response.data);
                // Update skills state with the newly added skill
                // const newSkill = response.data; // Assuming the API returns the newly added skill object
                // setSkills((prevSkills) => [...prevSkills, newSkill]);
                setEquips((prevEquips) => [...prevEquips, response.data]);
                // setSkills([...skills, response.data]);
                // Clear form data after successful submission
                setFormData({ equipName: '', description: '', productivity: '' });
                setSuccessMessage('Equipment added successfully');
                setErrorMessage('');
                // Close the modal
                onCancel();
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        } catch (error) {
            // Handle error response
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Request failed with status code:', error.response.status);
                console.error('Response data:', error.response.data);
                setErrorMessage(`Error: ${error.response.data.error}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server');
                setErrorMessage('No response received from the server');
            } else {
                // Something happened in setting up the request that triggered an error
                console.error('Error:', error.message);
                setErrorMessage(`Error: ${error.message}`);
            }
            setSuccessMessage('');
        }
    };
    return (
        <MainCard title="New Equipment">
            <form className={classes.form} onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Equipment Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Equipment Name" name="equipName" value={formData.equipName} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline // Allows multiline input
                            rows={4} // Adjust height of the input field
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <p>Equipment Productivity:</p>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            type="number"
                            placeholder="Rate"
                            fullWidth
                            label="Rate"
                            name="productivity"
                            value={formData.productivity}
                            // className={classes.maxWorker}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            // multiline // Allows multiline input
                            // rows={4} // Adjust height of the input field
                            label="Unit"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ marginRight: '10px', color: 'white' }}
                    >
                        {selectedEquip ? 'Save' : 'Add'}
                    </Button>
                    <Button onClick={onCancel} className={classes.button} variant="outlined" color="primary">
                        Cancel
                    </Button>
                </Box>

                {successMessage && <Typography className={classes.successMessage}>{successMessage}</Typography>}
                {errorMessage && <Typography className={classes.errorMessage}>{errorMessage}</Typography>}
            </form>
        </MainCard>
    );
};

export default EquipForm;
