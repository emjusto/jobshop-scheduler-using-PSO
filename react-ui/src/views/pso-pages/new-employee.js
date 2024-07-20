// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Grid, Autocomplete } from '@material-ui/core';
// import MainCard from '../../ui-component/cards/MainCard';
// import axios from 'axios';

// const EmployeeForm = ({ onCancel, employees, selectedEmployee, setEmployees, onEdit }) => {
//     const [formData, setFormData] = useState({
//         Name: '',
//         roles: []
//     });

//     const [skills, setSkills] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         fetchSkills();
//     }, []);
//     // useEffect(() => {
//     //     if (selectedEmployee) {
//     //         console.log('SELEDTEDDD', selectedEmployee);
//     //         setFormData({
//     //             Name: selectedEmployee.name,
//     //             roles: selectedEmployee.roles
//     //         });
//     //     }
//     // }, [selectedEmployee]);
//     useEffect(() => {
//         if (selectedEmployee) {
//             console.log('SELEDTEDDD', selectedEmployee);
//             // Assuming selectedEmployee.roles is an array of role IDs
//             const roleIds = selectedEmployee.roles.map((role) => role.skill_id);
//             setFormData({
//                 Name: selectedEmployee.name,
//                 roles: roleIds
//             });
//         }
//     }, [selectedEmployee]);
//     // useEffect(() => {
//     //     console.log('Selected Employee:', selectedEmployee);
//     //     fetchSkills();
//     //     if (selectedEmployee) {
//     //         console.log('Setting Form Data:', selectedEmployee);
//     //         setFormData({
//     //             name: selectedEmployee.name,
//     //             roles: selectedEmployee.roles
//     //         });
//     //     }
//     // }, [selectedEmployee]);

//     // const formattedSkills = selectedEmployee
//     //     ? selectedEmployee.skills.map((skill) => ({
//     //           id: skill.skill_id,
//     //           label: skill.name
//     //       }))
//     //     : skills;

//     const fetchSkills = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/get-skills');
//             setSkills(response.data);
//             console.log('skills:', skills);
//         } catch (error) {
//             console.error('Error fetching skills:', error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     // const handleRoleChange = (event, value) => {
//     //     setFormData((prevData) => ({
//     //         ...prevData,
//     //         roles: value
//     //     }));
//     // };
//     const handleRoleChange = (event, value) => {
//         const selectedRoles = value.map((role) => role.id);
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             roles: selectedRoles
//         }));
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     console.log('formData:', formData);
//     //     console.log(
//     //         'formData.roles:',
//     //         formData.roles.map((role) => role.id)
//     //     );
//     //     console.log('formData.roles.length:', formData.roles.length);
//     //     if (!formData.Name || formData.roles.length === 0) {
//     //         setErrorMessage('Please provide a name and select at least one role.');
//     //         setSuccessMessage('');
//     //         return;
//     //     }
//     //     const isDuplicateName = employees.some((employee) => employee.name === formData.name && employee.id !== selectedEmployee?.id);
//     //     if (isDuplicateName) {
//     //         setErrorMessage('Employee with the same name already exists');
//     //         return;
//     //     }
//     //     try {
//     //         if (selectedEmployee) {
//     //             console.log('SKILLS: ', skills);
//     //             // If editing existing employee
//     //             await axios.put(`http://localhost:5000/update-employee/${selectedEmployee.id}`, formData);
//     //             const updatedEmployees = employees.map((employee) =>
//     //                 employee.id === selectedEmployee.id ? { ...employee, ...formData } : employee
//     //             );
//     //             setEmployees(updatedEmployees);
//     //             setSuccessMessage('Employee updated successfully');
//     //             setErrorMessage('');
//     //             // Close the modal
//     //             onCancel();
//     //         } else {
//     //             const roleIds = formData.roles.map((role) => role.id);
//     //             const dataToSend = {
//     //                 Name: formData.Name,
//     //                 roles: roleIds
//     //             };
//     //             const response = await axios.post('http://localhost:5000/add-employee', dataToSend);
//     //             setSuccessMessage('Employee added successfully');
//     //             setErrorMessage('');
//     //             setFormData({
//     //                 Name: '',
//     //                 roles: []
//     //             });
//     //         }
//     //     } catch (error) {
//     //         if (error.response) {
//     //             setErrorMessage('Failed to add employee: ' + error.response.data.error);
//     //             setSuccessMessage('');
//     //         } else if (error.request) {
//     //             setErrorMessage('No response received from the server');
//     //             setSuccessMessage('');
//     //         } else {
//     //             setErrorMessage('Error setting up the request: ' + error.message);
//     //             setSuccessMessage('');
//     //         }
//     //     }
//     // };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.Name || formData.roles.length === 0) {
//             setErrorMessage('Please provide a name and select at least one role.');
//             setSuccessMessage('');
//             return;
//         }
//         const isDuplicateName = employees.some((employee) => employee.name === formData.Name && employee.id !== selectedEmployee?.id);
//         if (isDuplicateName) {
//             setErrorMessage('Employee with the same name already exists');
//             return;
//         }
//         try {
//             if (selectedEmployee) {
//                 // If editing existing employee
//                 await axios.put(`http://localhost:5000/update-employee/${selectedEmployee.id}`, formData);
//                 const updatedEmployees = employees.map((employee) =>
//                     employee.id === selectedEmployee.id ? { ...employee, ...formData } : employee
//                 );
//                 setEmployees(updatedEmployees);
//                 setSuccessMessage('Employee updated successfully');
//                 setErrorMessage('');
//                 // Close the modal
//                 onCancel();
//             } else {
//                 const roleIds = formData.roles.map((role) => role.skill_id); // Extract role IDs
//                 const dataToSend = {
//                     Name: formData.Name,
//                     roles: roleIds
//                 };
//                 const response = await axios.post('http://localhost:5000/add-employee', dataToSend);
//                 setSuccessMessage('Employee added successfully');
//                 setErrorMessage('');
//                 setFormData({
//                     Name: '',
//                     roles: []
//                 });
//             }
//         } catch (error) {
//             if (error.response) {
//                 setErrorMessage('Failed to add employee: ' + error.response.data.error);
//                 setSuccessMessage('');
//             } else if (error.request) {
//                 setErrorMessage('No response received from the server');
//                 setSuccessMessage('');
//             } else {
//                 setErrorMessage('Error setting up the request: ' + error.message);
//                 setSuccessMessage('');
//             }
//         }
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     console.log('Formdata: ', formData.Name);
//     //     console.log('Selected Employee: ', selectedEmployee);
//     //     console.log('Employees: ', employees);
//     //     if (!formData.Name || formData.roles.length === 0) {
//     //         setErrorMessage('Please provide a name and select at least one role.');
//     //         setSuccessMessage('');
//     //         return;
//     //     }
//     //     const isDuplicateName = employees.some((employee) => employee.name === formData.Name && employee.id !== selectedEmployee?.id);
//     //     if (isDuplicateName) {
//     //         setErrorMessage('Employee with the same name already exists');
//     //         return;
//     //     }
//     //     try {
//     //         if (selectedEmployee) {
//     //             // If editing existing employee
//     //             await axios.put(`http://localhost:5000/update-employee/${selectedEmployee.id}`, formData);
//     //             const updatedEmployees = employees.map((employee) =>
//     //                 employee.id === selectedEmployee.id ? { ...employee, ...formData } : employee
//     //             );
//     //             setEmployees(updatedEmployees);
//     //             setSuccessMessage('Employee updated successfully');
//     //             setErrorMessage('');
//     //             // Close the modal
//     //             onCancel();
//     //         } else {
//     //             const roleIds = formData.roles.map((role) => role.id); // Extract role IDs
//     //             const dataToSend = {
//     //                 Name: formData.Name,
//     //                 roles: roleIds
//     //             };
//     //             const response = await axios.post('http://localhost:5000/add-employee', dataToSend);
//     //             setSuccessMessage('Employee added successfully');
//     //             setErrorMessage('');
//     //             setFormData({
//     //                 Name: '',
//     //                 roles: []
//     //             });
//     //         }
//     //     } catch (error) {
//     //         if (error.response) {
//     //             setErrorMessage('Failed to add employee: ' + error.response.data.error);
//     //             setSuccessMessage('');
//     //         } else if (error.request) {
//     //             setErrorMessage('No response received from the server');
//     //             setSuccessMessage('');
//     //         } else {
//     //             setErrorMessage('Error setting up the request: ' + error.message);
//     //             setSuccessMessage('');
//     //         }
//     //     }
//     // };

//     return (
//         <MainCard title="New Employee">
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField fullWidth label="Name" name="Name" value={formData.Name} onChange={handleChange} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             multiple
//                             fullWidth
//                             value={formData.roles}
//                             // value={formData.roles.map((roleId) => skills.find((skill) => skill.skill_id === roleId))}
//                             onChange={handleRoleChange}
//                             options={skills}
//                             // options={formattedSkills}
//                             // getOptionLabel={(option) => option.name}
//                             getOptionLabel={(option) => option?.name || 'Default Label'}
//                             // getOptionSelected={(option, value) => option.skill_id === value.skill_id} // Add this line
//                             renderInput={(params) => <TextField {...params} label="Roles" />}
//                         />
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Button variant="contained" color="primary" type="submit">
//                             Add employee
//                         </Button>
//                         <Button onClick={onCancel} variant="outlined" color="primary">
//                             Cancel
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//             {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
//             {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
//         </MainCard>
//     );
// };

// export default EmployeeForm;
// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Grid, Autocomplete } from '@material-ui/core';
// import MainCard from '../../ui-component/cards/MainCard';
// import axios from 'axios';

// const EmployeeForm = ({ onCancel, employees, selectedEmployee, setEmployees }) => {
//     const [formData, setFormData] = useState({
//         Name: '',
//         roles: []
//     });

//     const [skills, setSkills] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         fetchSkills();
//     }, []);

//     useEffect(() => {
//         if (selectedEmployee) {
//             setFormData({
//                 Name: selectedEmployee.name,
//                 roles: selectedEmployee.roles
//             });
//         }
//     }, [selectedEmployee]);

//     const fetchSkills = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/get-skills');
//             setSkills(response.data);
//         } catch (error) {
//             console.error('Error fetching skills:', error);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleRoleChange = (event, value) => {
//         setFormData((prevData) => ({
//             ...prevData,
//             roles: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!formData.Name === 0) {
//             setErrorMessage('Please provide a name and select at least one role.');
//             setSuccessMessage('');
//             return;
//         }
//         if (selectedEmployee) {
//     const roleIds = formData.roles.map((role) => role.id); // Extract role IDs
//         try {
//             if (selectedEmployee) {
//                 // If editing existing employee
//                 await axios.put(`http://localhost:5000/update-employee/${selectedEmployee.id}`, formData);
//                 const updatedEmployees = employees.map((employee) =>
//                     employee.id === selectedEmployee.id ? { ...employee, ...formData } : employee
//                 );
//                 setEmployees(updatedEmployees);
//                 setSuccessMessage('Employee updated successfully');
//                 setErrorMessage('');
//                 onCancel();
//             }
//         } catch (error) {
//             if (error.response) {
//                 setErrorMessage('Failed to update employee: ' + error.response.data.error);
//                 setSuccessMessage('');
//             } else if (error.request) {
//                 setErrorMessage('No response received from the server');
//                 setSuccessMessage('');
//             } else {
//                 setErrorMessage('Error setting up the request: ' + error.message);
//                 setSuccessMessage('');
//             }
//         }
//     };

//     return (
//         <MainCard title="Edit Employee">
//             <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <TextField fullWidth label="Name" name="Name" value={formData.Name} onChange={handleChange} />
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <Autocomplete
//                             multiple
//                             fullWidth
//                             value={formData.roles}
//                             onChange={handleRoleChange}
//                             options={skills}
//                             getOptionLabel={(option) => option.name}
//                             renderInput={(params) => <TextField {...params} label="Roles" />}
//                         />
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Button variant="contained" color="primary" type="submit">
//                             Save Changes
//                         </Button>
//                         <Button onClick={onCancel} variant="outlined" color="primary">
//                             Cancel
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </form>
//             {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
//             {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
//         </MainCard>
//     );
// };

// export default EmployeeForm;

import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Autocomplete } from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';
import axios from 'axios';

const EmployeeForm = ({ onCancel, employees, selectedEmployee, setEmployees }) => {
    const [formData, setFormData] = useState({
        Name: '',
        roles: []
    });

    const [skills, setSkills] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-skills');
            setSkills(response.data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                Name: selectedEmployee.name,
                roles: selectedEmployee.skills
            });
        }
    }, [selectedEmployee]);

    // useEffect(() => {
    //     if (selectedEmployee) {
    //         console.log('TRY:', selectedEmployee.roles);
    //         // If there are selected roles for the employee, map them to an array of role IDs
    //         const selectedRoleIds = selectedEmployee.roles.map((role) => role.id);
    //         setFormData({
    //             Name: selectedEmployee.name,
    //             roles: selectedRoleIds // Set the value to an array of role IDs
    //         });
    //     }
    // }, [selectedEmployee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRoleChange = (event, value) => {
        setFormData((prevData) => ({
            ...prevData,
            roles: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.Name || formData.roles.length === 0) {
            setErrorMessage('Please provide a name and select at least one role.');
            setSuccessMessage('');
            return;
        }
        const roleIds = formData.roles.map((role) => role.id);
        try {
            if (selectedEmployee) {
                // If editing existing employee
                await axios.put(`http://localhost:5000/update-employee/${selectedEmployee.id}`, {
                    Name: formData.Name,
                    roles: roleIds
                });
                const updatedEmployees = employees.map((employee) =>
                    employee.id === selectedEmployee.id ? { ...employee, Name: formData.Name, roles: roleIds } : employee
                );
                setEmployees(updatedEmployees);
                setSuccessMessage('Employee updated successfully');
                setErrorMessage('');
                // Close the modal
                onCancel();
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            } else {
                // const roleIds = formData.roles.map((role) => role.id);
                const dataToSend = {
                    Name: formData.Name,
                    roles: roleIds
                };
                const response = await axios.post('http://localhost:5000/add-employee', dataToSend);
                setSuccessMessage('Employee added successfully');
                setErrorMessage('');
                setFormData({
                    Name: '',
                    roles: []
                });
                onCancel();
                setTimeout(() => {
                    window.location.reload();
                }, 300);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage('Failed to add employee: ' + error.response.data.error);
                setSuccessMessage('');
            } else if (error.request) {
                setErrorMessage('No response received from the server');
                setSuccessMessage('');
            } else {
                setErrorMessage('Error setting up the request: ' + error.message);
                setSuccessMessage('');
            }
        }
    };

    return (
        <MainCard title="Manpower Form">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Name" name="Name" value={formData.Name} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            multiple
                            fullWidth
                            value={formData.roles}
                            // value={selectedRoleIds}
                            // getOptionSelected={(option, value) => option.id === value}
                            onChange={handleRoleChange}
                            options={skills}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => <TextField {...params} label="Roles" />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            {selectedEmployee ? 'Update' : 'Add'} Manpower
                        </Button>
                        <Button onClick={onCancel} variant="outlined" color="primary">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </MainCard>
    );
};

export default EmployeeForm;
