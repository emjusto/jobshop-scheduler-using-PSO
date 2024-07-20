// import React from 'react';

// // material-ui
// import { Typography } from '@material-ui/core';

// // project imports
// import MainCard from '../../ui-component/cards/MainCard';

// //==============================|| SAMPLE PAGE ||==============================//

// const EmployeeList = () => {
//     return (
//         <MainCard title="Employee List">
//             <Typography variant="body2">
//                 Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
//                 enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue
//                 dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president,
//                 sunk in culpa qui officiate descent molls anim id est labours.
//             </Typography>
//         </MainCard>
//     );
// };

// export default EmployeeList;

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

// const employees = [
//   { id: 1, name: "Juan Dela Cruz", role: "Foreman"},
//   { id: 2, name: "Maria Makiling", role: "Electrician"},
//   { id: 3, name: "Pedro Gil", role: "Painter"},
//   { id: 4, name: "Shan Chai", role: "Painter"},
// ];

// const EmpTable = () => {
//     const classes = useStyles();
//     const [rows, setRows] = useState(employees);
//     const [searched, setSearched] = useState("");
//     const [selectedRole, setSelectedRole] = useState(null);

//     const requestSearch = (event) => {
//       const searchedVal = event.target.value;
//       setSearched(searchedVal);

//       const normalizedSearch = searchedVal.toLowerCase();

//       const filteredRows = employees.filter((row) =>
//         row.name.toLowerCase().includes(normalizedSearch)
//       );

//       applyFilters(filteredRows, selectedRole);
//     };

//     const cancelSearch = () => {
//       setSearched("");
//       applyFilters(employees, selectedRole);
//     };

//     const handleRoleChange = (event, value) => {
//       setSelectedRole(value);
//       applyFilters(employees, null, searched, value);
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
//         <MainCard title="Employees">
//         <div className={classes.buttonGroup}>
//           <div>
//           <Grid container justifyContent="start" alignItems="center">
//             <Grid item className={classes.filter}>
//               <Autocomplete
//                 options={Array.from(new Set(employees.map((row) => row.role)))}
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
//             </Grid>
//             <Grid item className={classes.filter}>
//               <TextField
//                 value={searched}
//                 onChange={requestSearch}
//                 // onCancelSearch={() => cancelSearch()}
//                 className={classes.searchField}
//                 placeholder="Search employees"
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
//                 to="/pso-pages/new-employee"
//                 >
//                 Add new employee
//                 </Button>
//         </div>
//           <TableContainer>
//           <Table className={classes.table} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell align="left">Role</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//             {rows.map((row) => (
//                 <TableRow
//                 key={row.id}
//                 onMouseEnter={() => handleMouseEnter(row.id)}
//                 onMouseLeave={() => handleMouseLeave(row.id)}
//                 sx={{ backgroundColor: hoverRow === row.id ? '#e0e0e0' : 'transparent' }}
//                 >
//                 <TableCell component="th" scope="row">
//                     <Link to={`/pso-pages/new-employee/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                     <Typography variant="inherit">{row.name}</Typography>
//                     </Link>
//                 </TableCell>
//                 <TableCell align="left">
//                     <Typography variant="inherit">{row.role}</Typography>
//                 </TableCell>
//                 </TableRow>
//             ))}
//             </TableBody>

//           </Table>
//         </TableContainer>
//         </MainCard>
//         <br />
//       </>
//     );
//   };

//   export default EmpTable;

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
// import EmployeeForm from './new-employee';
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

// const EmpTable = () => {
//     const classes = useStyles();
//     const [employees, setEmployees] = useState([]);
//     const [searched, setSearched] = useState('');
//     const [originalEmps, setOriginalEmps] = useState([]);
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedEmployee, setSelectedEmployee] = useState(null);

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     const fetchEmployees = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/get-employees');
//             const empData = response.data;
//             setEmployees(empData);
//             setOriginalEmps(empData); // Set the original equipment list
//         } catch (error) {
//             console.error('Error fetching employees:', error);
//         }
//     };

//     console.log(employees);

//     const handleOpenModal = () => {
//         setOpenModal(true);
//     };

//     const handleCloseModal = () => {
//         setOpenModal(false);
//         setSelectedEmployee(null);
//     };

//     const handleEdit = (employee) => {
//         setSelectedEmployee(employee);
//         console.log('Selected Employee:', employee);
//         console.log('Skills:');
//         employee.skills.forEach((skill, index) => {
//             console.log(`${index + 1}. Name: ${skill.skill_id}`);
//         });

//         setOpenModal(true);
//     };
//     // useEffect(() => {
//     //     if (selectedEmployee) {
//     //         console.log('Selected Employee:', selectedEmployee);
//     //         console.log('Skills:');
//     //         selectedEmployee.skills.forEach((skill, index) => {
//     //             console.log(`${index + 1}. Name: ${skill.skill_id}`);
//     //         });
//     //     }
//     // }, [selectedEmployee]);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/delete-employee/${id}`);
//             const updatedEmployees = employees.filter((employee) => employee.id !== id);
//             setEmployees(updatedEmployees);
//             setOriginalEmps(updatedEmployees); // Update the original equipment list
//         } catch (error) {
//             console.error('Error deleting employee:', error);
//         }
//     };

//     // const requestSearch = (event) => {
//     //     const searchedVal = event.target.value;
//     //     setSearched(searchedVal);
//     // };

//     const requestSearch = (event) => {
//         const searchedVal = event.target.value.toLowerCase();
//         setSearched(searchedVal);
//         const filteredEmps = originalEmps.filter(
//             (employee) => employee.name.toLowerCase().includes(searchedVal) || employee.description.toLowerCase().includes(searchedVal)
//         );
//         setEmployees(filteredEmps);
//     };

//     return (
//         <>
//             <MainCard title="Manpower">
//                 <div className={classes.buttonGroup}>
//                     <div>
//                         <Grid container justifyContent="start" alignItems="center">
//                             <Grid item className={classes.filter}>
//                                 <TextField
//                                     value={searched}
//                                     onChange={requestSearch}
//                                     className={classes.searchField}
//                                     placeholder="Search manpower"
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
//                         Add new manpower
//                     </Button>
//                 </div>
//                 <TableContainer component={Paper}>
//                     <Table className={classes.table} aria-label="simple table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Roles</TableCell>
//                                 {/* Add more columns as needed */}
//                                 <TableCell>Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {employees.map((employee, index) => (
//                                 <TableRow key={index}>
//                                     <TableCell component="th" scope="row" className={classes.spacedRow}>
//                                         <Link
//                                             to={`/pso-pages/new-employee/${employee.id}`}
//                                             style={{ textDecoration: 'none', color: 'inherit' }}
//                                         >
//                                             <Typography variant="inherit">{employee.name}</Typography>
//                                         </Link>
//                                     </TableCell>
//                                     {/* <TableCell>{employee.roles ? employee.skills.join(', ') : ''}</TableCell> */}
//                                     <TableCell className={classes.spacedRow}>
//                                         {employee.skills.map((skill, index) => (
//                                             <span key={index}>
//                                                 {skill.name}
//                                                 {index !== employee.skills.length - 1 ? ', ' : ''}
//                                             </span>
//                                         ))}
//                                     </TableCell>
//                                     {/* Add more cells for additional columns */}
//                                     <TableCell className={classes.spacedRow}>
//                                         <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
//                                             <Button onClick={() => handleEdit(employee)} startIcon={<IconEdit />} color="primary">
//                                                 Edit
//                                             </Button>
//                                             <Button onClick={() => handleDelete(employee.id)} startIcon={<Delete />} color="secondary">
//                                                 Delete
//                                             </Button>
//                                         </Box>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </MainCard>
//             <Dialog open={openModal} onClose={handleCloseModal}>
//                 <EmployeeForm
//                     onCancel={handleCloseModal}
//                     employees={employees}
//                     selectedEmployee={selectedEmployee}
//                     setEmployees={setEmployees}
//                 />
//             </Dialog>
//         </>
//     );
// };

// export default EmpTable;

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
import EmployeeForm from './new-employee';
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

const EmpTable = () => {
    const classes = useStyles();
    const [employees, setEmployees] = useState([]);
    const [originalEmployees, setOriginalEmployees] = useState([]);
    const [searched, setSearched] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-employees');
            const employeeData = response.data;
            setEmployees(employeeData);
            setOriginalEmployees(employeeData); // Set the original employee list
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployee(null);
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete-employee/${id}`);
            const updatedEmployees = employees.filter((employee) => employee.id !== id);
            setEmployees(updatedEmployees);
            setOriginalEmployees(updatedEmployees); // Update the original employee list
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const requestSearch = (event) => {
        const searchedVal = event.target.value.toLowerCase();
        setSearched(searchedVal);
        const filteredEmployees = originalEmployees.filter(
            (employee) =>
                employee.name.toLowerCase().includes(searchedVal) ||
                employee.skills.some((skill) => skill.name.toLowerCase().includes(searchedVal))
        );
        setEmployees(filteredEmployees);
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
                                <TableCell>Roles</TableCell>
                                <TableCell>Current Task</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow
                                    key={index}
                                    onMouseEnter={() => handleMouseEnter(employee.id)}
                                    onMouseLeave={() => handleMouseLeave(employee.id)}
                                    sx={{ backgroundColor: hoverRow === employee.id ? '#e0e0e0' : 'transparent' }}
                                >
                                    <TableCell component="th" scope="row" className={classes.spacedRow}>
                                        <Link
                                            to={`/pso-pages/new-employee/${employee.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <Typography variant="inherit">{employee.name}</Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell className={classes.spacedRow}>
                                        {employee.skills.map((skill, index) => (
                                            <span key={index}>
                                                {skill.name}
                                                {index !== employee.skills.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell className={classes.spacedRow}></TableCell>
                                    <TableCell className={classes.spacedRow}>
                                        <Box mt={2} mb={2} display="flex" justifyContent="flex-end">
                                            <Button onClick={() => handleEdit(employee)} startIcon={<IconEdit />} color="primary">
                                                Edit
                                            </Button>
                                            <Button onClick={() => handleDelete(employee.id)} startIcon={<Delete />} color="secondary">
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
            <Dialog open={openModal} onClose={handleCloseModal}>
                <EmployeeForm
                    onCancel={handleCloseModal}
                    employees={employees}
                    selectedEmployee={selectedEmployee}
                    setEmployees={setEmployees}
                />
            </Dialog>
        </>
    );
};

export default EmpTable;
