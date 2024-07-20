// import React, { useState } from "react";
// import { Link } from 'react-router-dom';

// //material-ui
// import {Typography, InputAdornment, Grid, Autocomplete } from '@material-ui/core';
// import { makeStyles, useTheme } from '@material-ui/styles';
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// // import SearchIcon from '@material-ui/icons/Search';
// import { IconSearch, IconPlus } from '@tabler/icons';

// //project imports
// import MainCard from "../../ui-component/cards/MainCard";

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     // marginBottom: '1rem',
//     //padding: '1rem',
//     //paddingTop: '5rem',
//   },
//   filter: {
//     marginRight: '1rem',
//   },
//   searchField: {
//     marginLeft: 'auto',
//   },
//   startAdornment: {
//     fontSize: '2rem',
//     color: "red",
// },
// });

// const equipment = [
//   { id: 1, name: "Excavator"},
//   { id: 2, name: "Concrete Mixer"},
//   { id: 3, name: "Backhoe"},
// ];

// const EquipTable = () => {
//     const classes = useStyles();
//     const [rows, setRows] = useState(equipment);
//     const [searched, setSearched] = useState("");
//     const [selectedRole, setSelectedRole] = useState(null);

//     const requestSearch = (event) => {
//       const searchedVal = event.target.value;
//       setSearched(searchedVal);

//       const normalizedSearch = searchedVal.toLowerCase();

//       const filteredRows = equipment.filter((row) =>
//         row.name.toLowerCase().includes(normalizedSearch)
//       );

//       applyFilters(filteredRows, selectedRole);
//     };

//     const cancelSearch = () => {
//       setSearched("");
//       applyFilters(equipment, selectedRole);
//     };

//     const handleRoleChange = (event, value) => {
//       setSelectedRole(value);
//       applyFilters(equipment, null, searched, value);
//     };

//     const applyFilters = (data, stage = null, search = "", role = null) => {
//       let filteredData = data;

//       if (search) {
//         const normalizedSearch = search.toLowerCase();
//         filteredData = filteredData.filter((row) =>
//           row.name.toLowerCase().includes(normalizedSearch)
//         );
//       }

//       if (role) {
//         filteredData = filteredData.filter((row) => row.role === role);
//       }

//       setRows(filteredData);
//     };

//     const [hoverRow, setHoverRow] = useState(null);

//     const handleMouseEnter = (id) => {
//       setHoverRow(id);
//     };

//     const handleMouseLeave = () => {
//       setHoverRow(null);
//     };

//     return (
//       <>
//         <MainCard title="Equipment">
//         <div className={classes.buttonGroup}>
//           <div>
//           <Grid container justifyContent="start" alignItems="center">
//             {/* <Grid item className={classes.filter}>
//               <Autocomplete
//                 options={Array.from(new Set(equipment.map((row) => row.role)))}
//                 value={selectedRole}
//                 onChange={handleRoleChange}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Role"
//                     variant="outlined"
//                     className={classes.searchField}
//                   />
//                 )}
//               />
//             </Grid> */}
//             <Grid item className={classes.filter}>
//               <TextField
//                 value={searched}
//                 onChange={requestSearch}
//                 // onCancelSearch={() => cancelSearch()}
//                 className={classes.searchField}
//                 placeholder="Search equipment"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <IconSearch stroke={1.5} size="1.3rem" color="grey" />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </Grid>
//           </Grid>
//           </div>
//           <Button
//                 variant="outlined"
//                 color="secondary"
//                 startIcon={<IconPlus />}
//                 component={Link}
//                 to="/pso-pages/new-equipment"
//                 >
//                 Add new equipment
//                 </Button>
//         </div>
//           <TableContainer>
//           <Table className={classes.table} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 {/* <TableCell align="left">Role</TableCell> */}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             {rows.map((row) => (
//             <TableRow
//               key={row.id}
//             //   component={Link}
//             //   to={`/pso-pages/new-equipment/${row.id}`}
//             //   style={{ textDecoration: 'none', color: 'inherit' }}
//               onMouseEnter={() => handleMouseEnter(row.id)}
//               onMouseLeave={() => handleMouseLeave(row.id)}
//               sx={{ backgroundColor: hoverRow === row.id ? '#e0e0e0' : 'transparent' }}
//             >
//               <TableCell component="th" scope="row">
//                 <Link to={`/pso-pages/new-equipment/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                 <Typography variant="inherit">{row.name}</Typography>
//                 </Link>
//               </TableCell>
//               {/* <TableCell align="left">
//                 <Typography variant="inherit">{row.role}</Typography>
//               </TableCell> */}
//             </TableRow>
//           ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         </MainCard>
//         <br />
//       </>
//     );
//   };

//   export default EquipTable;

// import React, { useState, component, useEffect, row } from 'react';
// import { Link } from 'react-router-dom';

// //material-ui
// import { Typography, InputAdornment, Grid, Autocomplete, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@material-ui/core';
// import { makeStyles, useTheme } from '@material-ui/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// // import SearchIcon from '@material-ui/icons/Search';
// import { IconSearch, IconPlus, IconEdit } from '@tabler/icons';
// import { Delete } from '@material-ui/icons';

// //project imports
// import MainCard from '../../ui-component/cards/MainCard';

// import EquipForm from './new-equipment';
// import axios from 'axios';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650
//     },
//     buttonGroup: {
//         display: 'flex',
//         justifyContent: 'space-between'
//     },
//     filter: {
//         marginRight: '1rem'
//     },
//     searchField: {
//         marginLeft: 'auto'
//     },
//     spacedRow: {
//         paddingBottom: '0px',
//         paddingTop: '0px'
//     }
// });

// const EquipTable = () => {
//     const classes = useStyles();
//     const [equips, setEquips] = useState([]);
//     const [searched, setSearched] = useState('');
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedEquip, setSelectedEquip] = useState(null);
//     const [originalEquips, setOriginalEquips] = useState([]);

//     useEffect(() => {
//         fetchEquip();
//     }, []);

//     const fetchEquip = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/get-equips');
//             setEquips(response.data);
//             setOriginalEquips(response.data);
//         } catch (error) {
//             console.error('Error fetching equipment:', error);
//         }
//     };

//     const handleOpenModal = () => {
//         setOpenModal(true);
//     };

//     const handleCloseModal = () => {
//         setOpenModal(false);
//         setSelectedEquip(null);
//     };

//     const handleEdit = (equip) => {
//         setSelectedEquip(equip);
//         setOpenModal(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/delete-equip/${id}`);
//             const updatedEquip = equips.filter((equip) => equip.id !== id);
//             setEquips(updatedEquip);
//         } catch (error) {
//             console.error('Error deleting equipment:', error);
//         }
//     };

//     // const requestSearch = (event) => {
//     //     const searchedVal = event.target.value;
//     //     setSearched(searchedVal);
//     // };
//     // const requestSearch = (event) => {
//     //     const searchedVal = event.target.value.toLowerCase(); // Normalize search term to lowercase
//     //     setSearched(searchedVal);
//     //     const filteredEquips = equips.filter(
//     //         (equip) =>
//     //             equip.name.toLowerCase().includes(searchedVal) || // Search by name
//     //             equip.description.toLowerCase().includes(searchedVal) // Optionally search by description
//     //     );
//     //     setEquips(filteredEquips); // Update displayed data with filtered list
//     // };

//     const requestSearch = (event) => {
//         const searchedVal = event.target.value;
//         console.log(searchedVal);
//         if (searchedVal === '') {
//             console.log('NOTHING:', searchedVal);
//             setSearched('');
//             setEquips(originalEquips);
//             console.log(originalEquips);
//         }
//         setSearched(searchedVal);

//         const normalizedSearch = searchedVal.toLowerCase();

//         const filteredRows = equips.filter((equip) => equip.name.toLowerCase().includes(normalizedSearch));

//         setEquips(filteredRows);
//     };

//     const cancelSearch = () => {
//         setSearched('');
//         setEquips(equips);
//     };

//     return (
//         <>
//             <MainCard title="Equipment">
//                 <div className={classes.buttonGroup}>
//                     <div>
//                         <Grid container justifyContent="start" alignItems="center">
//                             <Grid item className={classes.filter}>
//                                 <TextField
//                                     value={searched}
//                                     onChange={requestSearch}
//                                     className={classes.searchField}
//                                     placeholder="Search Equipment"
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <IconSearch stroke={1.5} size="1.3rem" color="grey" />
//                                             </InputAdornment>
//                                         )
//                                     }}
//                                 />
//                             </Grid>
//                         </Grid>
//                     </div>
//                     <Button variant="outlined" color="secondary" startIcon={<IconPlus />} onClick={handleOpenModal}>
//                         Add new equipment
//                     </Button>
//                 </div>
//                 <TableContainer component={Paper}>
//                     <Table className={classes.table} aria-label="simple table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Description</TableCell>
//                                 <TableCell>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {equips.map((equip, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell component="th" scope="row" className={classes.spacedRow}>
//                                         <Link to={`/pso-pages/new-equip/${equip.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                                             <Typography variant="inherit">{equip.name}</Typography>
//                                         </Link>
//                                     </TableCell>
//                                     <TableCell className={classes.spacedRow}>{equip.description}</TableCell>
//                                     <TableCell className={classes.spacedRow}>
//                                         <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
//                                             <Button onClick={() => handleEdit(equip)} startIcon={<IconEdit />} color="primary"></Button>
//                                             <Button
//                                                 onClick={() => handleDelete(equip.id)}
//                                                 startIcon={<Delete />}
//                                                 color="secondary"
//                                             ></Button>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </MainCard>
//             <br />
//             <Dialog open={openModal} onClose={handleCloseModal}>
//                 <EquipForm onCancel={handleCloseModal} equips={equips} selectedEquip={selectedEquip} setEquips={setEquips} />
//             </Dialog>
//         </>
//     );
// };

// export default EquipTable;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Typography,
    InputAdornment,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Dialog
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { IconSearch, IconPlus, IconEdit } from '@tabler/icons';
import { Delete } from '@material-ui/icons';
import MainCard from '../../ui-component/cards/MainCard';
import EquipForm from './new-equipment';
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

const EquipTable = () => {
    const classes = useStyles();
    const [equips, setEquips] = useState([]);
    const [originalEquips, setOriginalEquips] = useState([]);
    const [searched, setSearched] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedEquip, setSelectedEquip] = useState(null);

    useEffect(() => {
        fetchEquip();
    }, []);

    const fetchEquip = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-equips');
            const equipData = response.data;
            setEquips(equipData);
            setOriginalEquips(equipData); // Set the original equipment list
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEquip(null);
    };

    const handleEdit = (equip) => {
        setSelectedEquip(equip);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete-equip/${id}`);
            const updatedEquip = equips.filter((equip) => equip.id !== id);
            setEquips(updatedEquip);
            setOriginalEquips(updatedEquip); // Update the original equipment list
        } catch (error) {
            console.error('Error deleting equipment:', error);
        }
    };

    const requestSearch = (event) => {
        const searchedVal = event.target.value.toLowerCase();
        setSearched(searchedVal);
        const filteredEquips = originalEquips.filter(
            (equip) => equip.name.toLowerCase().includes(searchedVal) || equip.description.toLowerCase().includes(searchedVal)
        );
        setEquips(filteredEquips);
    };

    const [hoverRow, setHoverRow] = useState(null);

    const handleMouseEnter = (id) => {
        setHoverRow(id);
    };

    const handleMouseLeave = () => {
        setHoverRow(null);
    };

    return (
        <>
            <MainCard title="Equipment">
                <div className={classes.buttonGroup}>
                    <div>
                        <Grid container justifyContent="start" alignItems="center">
                            <Grid item className={classes.filter}>
                                <TextField
                                    value={searched}
                                    onChange={requestSearch}
                                    className={classes.searchField}
                                    placeholder="Search Equipment"
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
                        Add new equipment
                    </Button>
                </div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                {/* <TableCell>Current Task</TableCell> */}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {equips.map((equip, index) => (
                                <TableRow
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(equip.id)}
                                    onMouseLeave={() => handleMouseLeave(equip.id)}
                                    sx={{ backgroundColor: hoverRow === equip.id ? '#e0e0e0' : 'transparent' }}
                                >
                                    <TableCell component="th" scope="row" className={classes.spacedRow}>
                                        <Link
                                            to={`/pso-pages/new-equipment/${equip.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Typography variant="inherit">{equip.name}</Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell className={classes.spacedRow}>{equip.description}</TableCell>
                                    {/* <TableCell className={classes.spacedRow}></TableCell> */}
                                    <TableCell className={classes.spacedRow}>
                                        <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
                                            <Button onClick={() => handleEdit(equip)} startIcon={<IconEdit />} color="primary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(equip.id)} startIcon={<Delete />} color="secondary">
                                                Delete
                                            </Button>
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
                <EquipForm onCancel={handleCloseModal} equips={equips} selectedEquip={selectedEquip} setEquips={setEquips} />
            </Dialog>
        </>
    );
};

export default EquipTable;
