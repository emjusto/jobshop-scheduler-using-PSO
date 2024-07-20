import React, { useEffect, useState } from 'react';
import configData from '../../../config';

// material-ui
import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import axios from 'axios';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import WelcomeCard from './WelcomeCard';
import ProjectCard from './ProjectCard';
import TotalProjectsCard from './TotalProjectsCard';
import TotalTasksCard from './TotalTasksCard';
import TotalEmpCard from './TotalEmpCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';
import { makeStyles } from '@material-ui/styles';

import ProjectTable from './../../pso-pages/projects-list';
import EmpTable from './../../pso-pages/skill-list';
import EquipTable from './../../pso-pages/equipment-list';

//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

// const useStyles = makeStyles({
//     button: {
//         display: 'none',
//         border: '2px solid black'
//     }
// });
const useStyles = makeStyles({
    projectTableContainer: {
        // display: 'none',
        border: '2px solid black'
        // transition: 'all 0.3s ease-in-out'
    },
    projectTableContainerVisible: {
        // display: 'block',
        border: '2px solid red'
        // transition: 'all 0.3s ease-in-out'
    }
});
const Dashboard = () => {
    const classes = useStyles();
    const [isLoading, setLoading] = useState(true);
    const [userdata, setUserdata] = useState({});
    const [employeeData, setEmployeedata] = useState({});
    const [equipData, setEquipdata] = useState({});
    const [projectData, setProjectdata] = useState({});
    const [roles, setRoles] = useState([]);
    const [roleCount, setRoleCount] = useState('');
    // const [display, setDisplay] = useState('');
    // const [isProjectTableVisible, setIsProjectTableVisible] = useState(false);
    const [activeTable, setActiveTable] = useState(0);
    const [employeeCount, setEmployeeCount] = useState('');
    const [equipCount, setEquipCount] = useState('');
    const [projectCount, setProjectCount] = useState('');

    // const handleClick = () => {
    //     setDisplay('2px solid black');
    // };
    const handleClick = (index) => {
        // setIsProjectTableVisible(!isProjectTableVisible);
        setActiveTable(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch(configData.API_SERVER + '/users/login');
                const response = await fetch('http://localhost:5000/output_all_data'); // Replace with your actual API endpoint
                const data = await response.json();
                const firstUser = data.employees[0]; // Get the first user
                // const firstUser = data.username; // Get the first user
                setUserdata(firstUser); // Set the first username
                // setUsername(firstUser); // Set the first username
                setLoading(false);
                console.log('Data from server:', firstUser);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-skills');
            const rolesData = response.data;
            // const skills = rolesData.map((role) => role.name);
            // setRoles(skills);
            // const skillsArray = Object.values(response.data);
            setRoles(rolesData);
            let count = String(rolesData.length);
            setRoleCount(count);
            // loadedRoles = rolesData;
            // console.log('Roles: ', loadedRoles);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // const response = await fetch(configData.API_SERVER + '/users/login');
                const response = await fetch('http://localhost:5000/get-employees'); // Replace with your actual API endpoint
                const data = await response.json();
                setEmployeedata(data); // Set the first username
                let count = String(data.length);
                setEmployeeCount(count);
                setLoading(false);
                console.log('Data from server:', count);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-equips'); // Replace with your actual API endpoint
                const data = await response.json();
                setEquipdata(data); // Set the first username
                let count = String(data.length);
                setEquipCount(count);
                setLoading(false);
                console.log('Data from server:', count);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEquipment();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // const response = await fetch(configData.API_SERVER + '/users/login');
                const response = await fetch('http://localhost:5000/projects'); // Replace with your actual API endpoint
                const data = await response.json();
                setProjectdata(data); // Set the first username
                let count = String(data.length);
                setProjectCount(count);
                setLoading(false);
                console.log('Data from server:', count);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {/* welcome elma */}
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <WelcomeCard isLoading={isLoading} userdata={userdata.username} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        {/* <TotalProjectsCard isLoading={isLoading} onClick={handleClick} /> */}
                        <Button onClick={() => handleClick(0)}>
                            <TotalProjectsCard isLoading={isLoading} totalProjects={projectCount} />
                        </Button>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        {/* <div className={isProjectTableVisible ? classes.projectTableContainerVisible : classes.projectTableContainer}>
                            <TotalEmpCard
                                isLoading={isLoading}
                                className={isProjectTableVisible ? classes.projectTableContainerVisible : classes.projectTableContainer}
                            />
                        </div> */}
                        <Button onClick={() => handleClick(1)}>
                            <TotalEmpCard isLoading={isLoading} totalEmp={roleCount} />
                        </Button>
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Button onClick={() => handleClick(2)}>
                            <TotalTasksCard isLoading={isLoading} totalEquip={equipCount} />
                        </Button>
                    </Grid>
                </Grid>

                {/* <Grid item xs={12} marginTop={5} marginLeft={1}>
                    <Typography fontSize={25} fontWeight={500}>
                        Recent Projects
                    </Typography>
                </Grid> */}
                {/* <Grid item xs={12} marginTop={3} marginLeft={0}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={4}>
                            <ProjectCard isLoading={isLoading} />
                        </Grid>
                        <Grid item xs={4}>
                            <ProjectCard isLoading={isLoading} />
                        </Grid>
                        <Grid item xs={4}>
                            <ProjectCard isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid> */}

                <Grid item xs={12} marginTop={3} marginLeft={0}>
                    {/* {isProjectTableVisible && <ProjectTable />} Render ProjectTable only if visible */}
                    {activeTable === 0 && <ProjectTable />}
                    {activeTable === 1 && <EmpTable />}
                    {activeTable === 2 && <EquipTable />}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
