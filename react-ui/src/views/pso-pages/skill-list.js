import React, { useState, component, useEffect, row } from 'react';
import { Link } from 'react-router-dom';

//material-ui
import { Typography, InputAdornment, Grid, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import SearchIcon from '@material-ui/icons/Search';
import { IconSearch, IconPlus, IconEdit } from '@tabler/icons';
import { Delete } from '@material-ui/icons';

//project imports
import MainCard from '../../ui-component/cards/MainCard';

import SkillForm from './new-skill';
import axios from 'axios';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    filter: {
        marginRight: '1rem'
    },
    searchField: {
        marginLeft: 'auto'
    },
    spacedRow: {
        paddingBottom: '0px',
        paddingTop: '0px'
    }
});

const SkillTable = () => {
    const classes = useStyles();
    const [skills, setSkills] = useState([]);
    const [searched, setSearched] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-skills');
            setSkills(response.data);
            console.log(skills);
        } catch (error) {
            console.error('Error fetching manpower:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSkill(null);
    };

    const handleEdit = (skill) => {
        setSelectedSkill(skill);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete-skill/${id}`);
            const updatedSkills = skills.filter((skill) => skill.id !== id);
            setSkills(updatedSkills);
        } catch (error) {
            console.error('Error deleting manpower:', error);
        }
    };

    const requestSearch = (event) => {
        const searchedVal = event.target.value;
        setSearched(searchedVal);
    };

    return (
        <>
            <MainCard title="Manpower">
                <div className={classes.buttonGroup}>
                    <div>
                        <Grid container justifyContent="start" alignItems="center">
                            <Grid item className={classes.filter}>
                                <TextField
                                    value={searched}
                                    onChange={requestSearch}
                                    className={classes.searchField}
                                    placeholder="Search manpower"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconSearch stroke={1.5} size="1.3rem" color="grey" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                    <Button variant="outlined" color="secondary" startIcon={<IconPlus />} onClick={handleOpenModal}>
                        Add new manpower
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Total Workers</TableCell>
                                {/* <TableCell>Busy</TableCell> */}
                                <TableCell style={{ display: 'flex', justifyContent: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {skills.map((skill, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" className={classes.spacedRow}>
                                        <Link to={`/pso-pages/new-skill/${skill.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography variant="inherit">{skill.name}</Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell className={classes.spacedRow}>{skill.description}</TableCell>
                                    <TableCell className={classes.spacedRow}>{skill.maxWorkers}</TableCell>
                                    {/* <TableCell className={classes.spacedRow}></TableCell> */}
                                    <TableCell className={classes.spacedRow}>
                                        <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
                                            <Button onClick={() => handleEdit(skill)} startIcon={<IconEdit />} color="primary"></Button>
                                            <Button
                                                onClick={() => handleDelete(skill.id)}
                                                startIcon={<Delete />}
                                                color="secondary"
                                            ></Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
            <br />
            <Dialog open={openModal} onClose={handleCloseModal}>
                <SkillForm onCancel={handleCloseModal} skills={skills} selectedSkill={selectedSkill} setSkills={setSkills} />
            </Dialog>
        </>
    );
};

export default SkillTable;
