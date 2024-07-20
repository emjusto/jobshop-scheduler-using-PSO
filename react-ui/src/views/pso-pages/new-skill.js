import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, Grid, MenuItem, Typography, Box, Input } from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    form: {
        maxWidth: '400px',
        margin: 'auto',
        marginTop: theme.spacing(1)
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
    },
    maxWorker: {
        border: '1px solid grey',
        width: '30%',
        padding: '0.5rem',
        background: '#fafafa',
        borderRadius: '10px',
        textAlign: 'center'
    }
}));

const SkillForm = ({ onCancel, skills, setSkills, selectedSkill }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({
        skillName: '',
        description: '',
        maxWorkers: ''
    });

    useEffect(() => {
        if (selectedSkill) {
            setFormData({
                skillName: selectedSkill.name,
                description: selectedSkill.description,
                maxWorkers: selectedSkill.maxWorkers
            });
        }
    }, [selectedSkill]);

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
        // Check if skillName is empty
        if (!formData.skillName.trim()) {
            setErrorMessage('Manpower Name cannot be empty');
            return;
        }

        if (!formData.maxWorkers) {
            setErrorMessage('Please indicate number of workers');
            return;
        }

        // Check if the skill name already exists
        const isDuplicateName = skills.some((skill) => skill.name === formData.skillName && skill.id !== selectedSkill?.id);
        if (isDuplicateName) {
            setErrorMessage('Manpower already exists');
            return;
        }
        try {
            if (selectedSkill) {
                // If editing existing skill
                await axios.put(`http://localhost:5000/update-skill/${selectedSkill.id}`, formData);
                const updatedSkills = skills.map((skill) => (skill.id === selectedSkill.id ? { ...skill, ...formData } : skill));
                setSkills(updatedSkills);
                setSuccessMessage('Manpower added successfully');
                setErrorMessage('');
                // Close the modal
                onCancel();
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            } else {
                if (skills.some((skill) => skill.name === formData.skillName)) {
                    setErrorMessage('Manpower already exists');
                    return;
                }
                // Send skill data to the backend using Axios
                const response = await axios.post('http://localhost:5000/add-skill', formData);
                console.log(response.data);
                // Update skills state with the newly added skill
                // const newSkill = response.data; // Assuming the API returns the newly added skill object
                // setSkills((prevSkills) => [...prevSkills, newSkill]);
                setSkills((prevSkills) => [...prevSkills, response.data]);
                // setSkills([...skills, response.data]);
                // Clear form data after successful submission
                setFormData({ skillName: '', description: '' });
                setSuccessMessage('Manpower added successfully');
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
        <MainCard title="New Manpower">
            <form className={classes.form} onSubmit={handleSubmit}>
                {/* <Typography variant="h6" gutterBottom>
                    Skill Information
                </Typography> */}
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Manpower Name" name="skillName" value={formData.skillName} onChange={handleChange} />
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
                        <p>Total number of workers available:</p>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            type="number"
                            placeholder="Quantity"
                            fullWidth
                            label="Quantity"
                            name="maxWorkers"
                            value={formData.maxWorkers}
                            className={classes.maxWorker}
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
                        {selectedSkill ? 'Save' : 'Add'}
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

export default SkillForm;
