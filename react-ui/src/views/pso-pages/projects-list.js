import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MainCard from '../../ui-component/cards/MainCard';
import { IconSearch } from '@tabler/icons';
import { Delete } from '@material-ui/icons';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    button: {
        marginRight: '1rem'
    },
    searchField: {
        marginLeft: 'auto'
    }
});

const ProjectTable = () => {
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [searched, setSearched] = useState('');
    const [filterStage, setFilterStage] = useState(null);
    const [hoverRow, setHoverRow] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/projects');
            const projectsWithStage = response.data.map((project) => ({
                ...project,
                stage: calculateStage(project.start_date, project.end_date)
            }));
            setRows(projectsWithStage);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const calculateStage = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (today < start) {
            return 'Upcoming';
        } else if (today >= start && today <= end) {
            return 'In-Progress';
        } else {
            return 'Completed';
        }
    };

    const requestSearch = (event) => {
        const searchedVal = event.target.value;
        setSearched(searchedVal);

        const normalizedSearch = searchedVal.toLowerCase();

        const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(normalizedSearch));

        setRows(filteredRows);
    };

    const cancelSearch = () => {
        setSearched('');
        fetchProjects();
    };

    const applyStageFilter = (stage) => {
        if (stage) {
            const filteredRows = rows.filter((row) => row.stage === stage);
            setRows(filteredRows);
        } else {
            fetchProjects();
        }
    };

    const filterByStage = (stage) => {
        setFilterStage(stage);
        applyStageFilter(stage);
    };

    const handleMouseEnter = (id) => {
        setHoverRow(id);
    };

    const handleMouseLeave = () => {
        setHoverRow(null);
    };

    const handleDeleteClick = (projectId) => {
        setSelectedProjectId(projectId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/delete-project/${selectedProjectId}`);
            setRows(rows.filter((row) => row.id !== selectedProjectId));
            setDeleteDialogOpen(false);
            setSelectedProjectId(null);
            alert('Project deleted successfully.');
        } catch (error) {
            console.error('Error deleting project:', error.response ? error.response.data : error.message);
            alert(`Error deleting project: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedProjectId(null);
    };

    return (
        <>
            <MainCard title="Projects">
                <div className={classes.buttonGroup}>
                    <div>
                        <Button
                            variant={filterStage === null ? 'contained' : 'outlined'}
                            color="primary"
                            className={classes.button}
                            onClick={() => filterByStage(null)}
                        >
                            All
                        </Button>
                        <Button
                            variant={filterStage === 'In-Progress' ? 'contained' : 'outlined'}
                            color="primary"
                            className={classes.button}
                            onClick={() => filterByStage('In-Progress')}
                        >
                            In-Progress
                        </Button>
                        <Button
                            variant={filterStage === 'Completed' ? 'contained' : 'outlined'}
                            color="primary"
                            className={classes.button}
                            onClick={() => filterByStage('Completed')}
                        >
                            Completed
                        </Button>
                        <Button
                            variant={filterStage === 'Upcoming' ? 'contained' : 'outlined'}
                            color="primary"
                            className={classes.button}
                            onClick={() => filterByStage('Upcoming')}
                        >
                            Upcoming
                        </Button>
                    </div>
                    <TextField
                        value={searched}
                        onChange={requestSearch}
                        className={classes.searchField}
                        placeholder="Search projects"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1.3rem" color="grey" />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <TableContainer>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Start Date</TableCell>
                                <TableCell align="right">End Date</TableCell>
                                {/* <TableCell align="right">Duration</TableCell> */}
                                <TableCell align="right">Stage</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onMouseEnter={() => handleMouseEnter(row.id)}
                                    onMouseLeave={() => handleMouseLeave()}
                                    style={{ backgroundColor: hoverRow === row.id ? '#e0e0e0' : 'transparent' }}
                                >
                                    <TableCell component="th" scope="row">
                                        <Link to={`/pso-pages/project/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography variant="inherit">{row.name}</Typography>
                                        </Link>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="inherit">{row.start_date}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="inherit">{row.end_date}</Typography>
                                    </TableCell>
                                    {/* <TableCell align="right">
                                        <Typography variant="inherit">{row.duration} days</Typography>
                                    </TableCell> */}
                                    <TableCell align="right">
                                        <Typography variant="inherit">{row.stage}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button startIcon={<Delete />} color="secondary" onClick={() => handleDeleteClick(row.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Delete Project</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure you want to delete this project?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProjectTable;

//LATEST PROJECT TABLE
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { Typography, InputAdornment } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import MainCard from '../../ui-component/cards/MainCard';
// import { IconSearch } from '@tabler/icons';
// import { Delete } from '@material-ui/icons';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650
//     },
//     buttonGroup: {
//         display: 'flex',
//         justifyContent: 'space-between'
//     },
//     button: {
//         marginRight: '1rem'
//     },
//     searchField: {
//         marginLeft: 'auto'
//     }
// });

// const ProjectTable = () => {
//     const classes = useStyles();
//     const [rows, setRows] = useState([]);
//     const [searched, setSearched] = useState('');
//     const [filterStage, setFilterStage] = useState(null);
//     const [hoverRow, setHoverRow] = useState(null);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [selectedProjectId, setSelectedProjectId] = useState(null);

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const fetchProjects = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/projects');
//             setRows(response.data);
//         } catch (error) {
//             console.error('Error fetching projects:', error);
//         }
//     };

//     const requestSearch = (event) => {
//         const searchedVal = event.target.value;
//         setSearched(searchedVal);

//         const normalizedSearch = searchedVal.toLowerCase();

//         const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(normalizedSearch));

//         setRows(filteredRows);
//     };

//     const cancelSearch = () => {
//         setSearched('');
//         fetchProjects();
//     };

//     const applyStageFilter = (stage) => {
//         if (stage) {
//             const filteredRows = rows.filter((row) => row.stage === stage);
//             setRows(filteredRows);
//         } else {
//             fetchProjects();
//         }
//     };

//     const filterByStage = (stage) => {
//         setFilterStage(stage);
//         applyStageFilter(stage);
//     };

//     const handleMouseEnter = (id) => {
//         setHoverRow(id);
//     };

//     const handleMouseLeave = () => {
//         setHoverRow(null);
//     };

//     // const handleDelete = async (projectId) => {
//     //     if (window.confirm('Are you sure you want to delete this project?')) {
//     //         try {
//     //             await axios.delete(`http://localhost:5000/delete-project/${projectId}`);
//     //             setRows(rows.filter((row) => row.id !== projectId));
//     //             alert('Project deleted successfully.');
//     //         } catch (error) {
//     //             console.error('Error deleting project:', error);
//     //             alert('Error deleting project. Please try again later.');
//     //         }
//     //     }
//     // };

//     const handleDeleteClick = (projectId) => {
//         setSelectedProjectId(projectId);
//         setDeleteDialogOpen(true);
//     };

//     const handleDeleteConfirm = async () => {
//         try {
//             await axios.delete(`http://localhost:5000/delete-project/${selectedProjectId}`);
//             setRows(rows.filter((row) => row.id !== selectedProjectId));
//             setDeleteDialogOpen(false);
//             setSelectedProjectId(null);
//             alert('Project deleted successfully.');
//         } catch (error) {
//             console.error('Error deleting project:', error);
//             alert('Error deleting project. Please try again later.');
//         }
//     };

//     const handleDeleteCancel = () => {
//         setDeleteDialogOpen(false);
//         setSelectedProjectId(null);
//     };
//     return (
//         <>
//             <MainCard title="Projects">
//                 <div className={classes.buttonGroup}>
//                     <div>
//                         <Button
//                             variant={filterStage === null ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage(null)}
//                         >
//                             All
//                         </Button>
//                         <Button
//                             variant={filterStage === 'In-Progress' ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage('In-Progress')}
//                         >
//                             In-Progress
//                         </Button>
//                         <Button
//                             variant={filterStage === 'Complete' ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage('Complete')}
//                         >
//                             Complete
//                         </Button>
//                     </div>
//                     <TextField
//                         value={searched}
//                         onChange={requestSearch}
//                         className={classes.searchField}
//                         placeholder="Search projects"
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <IconSearch stroke={1.5} size="1.3rem" color="grey" />
//                                 </InputAdornment>
//                             )
//                         }}
//                     />
//                 </div>
//                 <TableContainer>
//                     <Table className={classes.table} aria-label="simple table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell align="right">Start Date</TableCell>
//                                 <TableCell align="right">Duration</TableCell>
//                                 <TableCell align="right">Stage</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     style={{ textDecoration: 'none', color: 'inherit' }}
//                                     onMouseEnter={() => handleMouseEnter(row.id)}
//                                     onMouseLeave={() => handleMouseLeave(row.id)}
//                                     sx={{ backgroundColor: hoverRow === row.id ? '#e0e0e0' : 'transparent' }}
//                                 >
//                                     <TableCell component="th" scope="row">
//                                         <Link to={`/pso-pages/project/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                                             <Typography variant="inherit">{row.name}</Typography>
//                                         </Link>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.start_date}</Typography>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.duration}</Typography>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.stage}</Typography>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Button
//                                             // variant="outlined"
//                                             startIcon={<Delete />}
//                                             color="secondary"
//                                             onClick={() => handleDeleteClick(row.id)}
//                                         >
//                                             Delete
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </MainCard>
//             <br />
//             <Dialog
//                 open={deleteDialogOpen}
//                 onClose={handleDeleteCancel}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogTitle id="alert-dialog-title">{'Delete Project'}</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="alert-dialog-description">Are you sure you want to delete this project?</DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDeleteCancel} color="primary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };

// export default ProjectTable;
//ORIGINAL PROJECT TABLE
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Typography, InputAdornment } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
// import MainCard from '../../ui-component/cards/MainCard';
// import { IconSearch } from '@tabler/icons';
// import { DepartureBoardOutlined } from '@material-ui/icons';

// const useStyles = makeStyles({
//     table: {
//         minWidth: 650
//     },
//     buttonGroup: {
//         display: 'flex',
//         justifyContent: 'space-between'
//         // marginBottom: '1rem',
//         //padding: '1rem',
//         //paddingTop: '5rem',
//     },
//     button: {
//         marginRight: '1rem'
//     },
//     searchField: {
//         marginLeft: 'auto'
//     }
// });

// const projects = [
//     { id: 1, name: 'Constuction of 2-Storey CSC Field Office Building', start: '2024-02-01', duration: '60 days', stage: 'In-Progress' },
//     {
//         id: 2,
//         name: 'Repair and Rehabilitation of various DepEd Central Office Buildings and Ground Improvement',
//         start: '2023-08-01',
//         duration: '90 days',
//         stage: 'Complete'
//     },
//     { id: 3, name: 'Sample Project', start: '2024-08-01', duration: '30 days', stage: 'In-Progress' }
// ];

// const ProjectTable = () => {
//     const classes = useStyles();
//     const [rows, setRows] = useState(projects);
//     const [searched, setSearched] = useState('');
//     const [filterStage, setFilterStage] = useState(null);

//     const requestSearch = (event) => {
//         const searchedVal = event.target.value;
//         setSearched(searchedVal);

//         const normalizedSearch = searchedVal.toLowerCase();

//         const filteredRows = projects.filter((row) => row.name.toLowerCase().includes(normalizedSearch));

//         setRows(filteredRows);
//     };

//     const cancelSearch = () => {
//         setSearched('');
//         setRows(projects);
//     };

//     const applyStageFilter = (stage) => {
//         if (stage) {
//             const filteredRows = projects.filter((row) => row.stage === stage);
//             setRows(filteredRows);
//         } else {
//             setRows(projects);
//         }
//     };

//     const filterByStage = (stage) => {
//         setFilterStage(stage);
//         applyStageFilter(stage);
//     };

//     const [hoverRow, setHoverRow] = useState(null);

//     const handleMouseEnter = (id) => {
//         setHoverRow(id);
//     };

//     const handleMouseLeave = () => {
//         setHoverRow(null);
//     };

//     return (
//         <>
//             <MainCard title="Projects">
//                 <div className={classes.buttonGroup}>
//                     <div>
//                         <Button
//                             variant={filterStage === null ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage(null)}
//                         >
//                             All
//                         </Button>
//                         <Button
//                             variant={filterStage === 'In-Progress' ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage('In-Progress')}
//                         >
//                             In-Progress
//                         </Button>
//                         <Button
//                             variant={filterStage === 'Complete' ? 'contained' : 'outlined'}
//                             color="primary"
//                             className={classes.button}
//                             onClick={() => filterByStage('Complete')}
//                         >
//                             Complete
//                         </Button>
//                     </div>
//                     <TextField
//                         value={searched}
//                         onChange={requestSearch}
//                         // onCancelSearch={() => cancelSearch()}
//                         className={classes.searchField}
//                         placeholder="Search projects"
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <IconSearch stroke={1.5} size="1.3rem" color="grey" />
//                                 </InputAdornment>
//                             )
//                         }}
//                     />
//                 </div>
//                 <TableContainer>
//                     <Table className={classes.table} aria-label="simple table">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell align="right">Start Date</TableCell>
//                                 <TableCell align="right">Duration</TableCell>
//                                 <TableCell align="right">Stage</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {rows.map((row) => (
//                                 <TableRow
//                                     key={row.id}
//                                     // component={Link}
//                                     // to={`/pso-pages/new-project/${row.id}`}
//                                     style={{ textDecoration: 'none', color: 'inherit' }}
//                                     onMouseEnter={() => handleMouseEnter(row.id)}
//                                     onMouseLeave={() => handleMouseLeave(row.id)}
//                                     sx={{ backgroundColor: hoverRow === row.id ? '#e0e0e0' : 'transparent' }}
//                                 >
//                                     <TableCell component="th" scope="row">
//                                         <Link to={`/pso-pages/new-project/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//                                             <Typography variant="inherit">{row.name}</Typography>
//                                         </Link>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.start}</Typography>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.duration}</Typography>
//                                     </TableCell>
//                                     <TableCell align="right">
//                                         <Typography variant="inherit">{row.stage}</Typography>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </MainCard>
//             <br />
//         </>
//     );
// };

// export default ProjectTable;

// import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/styles';
// import { Avatar, Box, ButtonBase, Card, CardContent, Grid, InputAdornment, OutlinedInput, Popper } from '@material-ui/core';
// import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
// import Transitions from '../../../ui-component/extended/Transitions';
// import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import MainCard from './../../../ui-component/cards/MainCard';
// import SearchSection from './../../../SearchSection';

// // Import your table-related components and libraries here
// const projects = [
//   { id: 1, project: 'John Doe', stage: "In-Progress", country: 'USA', dateCreated: '2022-01-01', isAdmin: false },
//  { id: 2, project: 'Jane Smith', stage: "Complete", country: 'Canada', dateCreated: '2022-02-15', isAdmin: true },
// // Your project data here...
// ];

// const useStyles = makeStyles((theme) => ({
//   // Your existing styles
// }));

// const ProjectsList = () => {
//   const classes = useStyles();
//   const [value, setValue] = useState('');
//   const [filteredRows, setFilteredRows] = useState(projects);

//   const requestSearch = (searchedVal) => {
//     setValue(searchedVal);

//     const normalizedSearch = searchedVal.toLowerCase();

//     const filteredList = projects.filter((row) =>
//       row.project.toLowerCase().includes(normalizedSearch)
//     );

//     setFilteredRows(filteredList);
//   };

//   const clearSearch = () => {
//     setValue('');
//     setFilteredRows(projects);
//   };

//   return (
//     <MainCard title="Projects">
//       <SearchSection value={value} onChange={requestSearch} onClear={clearSearch} />
//       {/* Your table component using filteredRows */}
//       <TableContainer>
//           <Table className={classes.table} aria-label="simple table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Food (100g serving)</TableCell>
//                 <TableCell align="right">Calories</TableCell>
//                 <TableCell align="right">Fat&nbsp;(g)</TableCell>
//                 <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//                 <TableCell align="right">Protein&nbsp;(g)</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {value.map((row) => (
//                 <TableRow key={row.name}>
//                   <TableCell component="th" scope="row">
//                     {row.name}
//                   </TableCell>
//                   <TableCell align="right">{row.calories}</TableCell>
//                   <TableCell align="right">{row.fat}</TableCell>
//                   <TableCell align="right">{row.carbs}</TableCell>
//                   <TableCell align="right">{row.protein}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//     </MainCard>
//   );
// };

// export default ProjectsList;
