import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Gantt from '../../components/Gantt/Gantt';
import MessageArea from '../../components/MessageArea/MessageArea';
import AlertMessage from './alert';
import MainCard from '../../ui-component/cards/MainCard';
import { Button, Box, TextField, Grid, Input, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Resizable } from 're-resizable';
// import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
// import EditResourcesModal from './EditResourcesModal';
import { IconPlus, IconX } from '@tabler/icons';
import GanttChartWithRadioButtons from './ZoomView.js';
import { ClickEventArgs } from '@syncfusion/ej2-navigations/src/toolbar/toolbar';
import {
    GanttComponent,
    TaskFieldsModel,
    ColumnsDirective,
    ColumnDirective,
    EditDialogFieldDirective,
    EditDialogFieldsDirective,
    AddDialogFieldDirective,
    AddDialogFieldsDirective,
    Edit,
    Sort,
    Inject,
    PdfExport,
    Toolbar,
    ToolbarItem,
    VirtualScroll,
    Selection,
    ContextMenu
} from '@syncfusion/ej2-react-gantt';
import { MultiSelect, CheckBoxSelection, DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    SelfRefData,
    resourceDetails,
    templateData,
    HouseData,
    houseData,
    BuildingData,
    roadData,
    buildingData,
    mgData
} from '../../components/GanttJS/data.js';
import '../../components/GanttJS/Gantt-react.css';
import axios from 'axios';
import EquipForm from './new-equipment.js';
import { House } from '@material-ui/icons';

const editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
    newRowPosition: 'Child',
    allowPdfExport: true
};

const taskValues = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    progress: 'Progress',
    dependency: 'Predecessor',
    resourceInfo: 'resources',
    parentID: 'ParentId',
    skills: 'RequiredSkill',
    projectID: 'ProjectID',
    workload: 'Workload',
    productivityRate: 'ProductivityRate',
    equipment: 'Equipment',
    equipmentUnit: 'EquipmentUnit',
    workloadUnit: 'WorkloadUnit',
    allocatedWorkers: 'AllocatedWorkers'
};

// const resourceFields = {
//     id: 'resourceId',
//     name: 'resourceName',
//     unit: 'unit'
// };
const resourceFields = {
    id: 'id',
    name: 'name',
    skills: 'skills'
    // unit: 'unit'
};

const skillDataSource = [
    { id: 1, text: 'Skill 1' },
    { id: 2, text: 'Skill 2' }
];

const editDialogFields = [
    { type: 'General' },
    { type: 'Predecessor' },
    { type: 'Dependency' },
    { type: 'Resources' },
    { type: 'Notes' },
    {
        type: 'Custom',
        headerText: 'Required Skill',
        field: [{ type: 'RequiredSkill', dataSource: skillDataSource, edit: 'dropdownlist', labelText: 'Pick a Skill' }]
    }
];

const sortSettings = {
    columns: [{ field: 'StartDate', direction: 'Ascending' }]
};

const modes = [
    {
        item: 'Hour',
        id: '1'
    },
    {
        item: 'Day',
        id: '2'
    },
    {
        item: 'Week',
        id: '3'
    },
    {
        item: 'Month',
        id: '4'
    },
    {
        item: 'Year',
        id: '5'
    }
];

const zoomFields = { text: 'item', value: 'id' };

let isAddRecordTriggered = false;
MultiSelect.Inject(CheckBoxSelection);

const GanttProject = ({ projectId }) => {
    const history = useHistory();
    // const navigate = useNavigate();
    const user = useSelector((state) => state.account.user);
    const [currentZoom, setCurrentZoom] = useState('Week');
    const [messages, setMessages] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [manpower, setManpower] = useState([{ label: '', quantity: '' }]);
    const [equipment, setEquipment] = useState([{ label: '', quantity: '' }]);
    const [equips, setEquips] = useState([]);
    const [originalEquips, setOriginalEquips] = useState([]);
    const [taskDetails, setTaskDetails] = useState('');
    const [projectTitle, setProjectTitle] = useState('');
    //const [projectId, setProjectId] = useState('');
    const [projectLocation, setProjectLocation] = useState('');
    const [projectDuration, setProjectDuration] = useState('');
    const [projectManager, setProjectManager] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const ganttInstance = useRef(null);
    const [roles, setRoles] = useState([]); // State to store skills data fetched from backend
    const [employees, setEmployees] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    // const [isGanttVisible, setIsGanttVisible] = useState(false);

    const [isCreateVisible, setIsCreateVisible] = useState(true);
    const [isSelectVisible, setIsSelectVisible] = useState(!isCreateVisible);

    const [alertInfo, setAlertInfo] = useState(null);
    let loadedRoles;
    let loadedEquips;
    let loadedManpower;
    let filteredTasksData;
    let loadedTasks;
    let selectedTemplate;

    const timelineSettings = {
        timelineViewMode: currentZoom,
        timelineUnitSize: 50
    };

    function clickHandler() {
        let data = [
            {
                TaskID: 1,
                TaskName: 'New Added Task',
                StartDate: new Date('Fri Apr 19 2019 17:00:00 GMT+0800 (Philippine Standard Time)').toLocaleDateString('en-US'),
                Duration: 14,
                Workload: parseFloat(50.5),
                ProductivityRate: parseFloat(50.5),
                Predecessor: '175FS, 174FS'
                // Progress: 50
            },
            {
                TaskID: 1,
                TaskName: 'New Added Task',
                StartDate: new Date('Fri Apr 19 2019 17:00:00 GMT+0800 (Philippine Standard Time)').toLocaleDateString('en-US'),
                Duration: 14,
                Workload: parseFloat(50.5),
                ProductivityRate: parseFloat(50.5),
                Predecessor: '175FS, 174FS',
                RequiredSkill: ['Carpenter'],
                Equipment: 'Bulldozer'
                // Progress: 50
            }
        ];
        // handleSaveChanges();
        // let data = selectedOption;
        // setIsCreateVisible(false);
        // setIsGanttVisible(true);
        console.log('SELECTED OPTION: ', selectedOption);
        if (selectedOption === 'HouseData') {
            houseData.map((task) => ganttInstance.current.editModule.addRecord(task));
            setIsSelectVisible(false);
        }
        if (selectedOption === 'BuildingData') buildingData.map((task) => ganttInstance.current.editModule.addRecord(task));
        if (selectedOption === 'RoadData') roadData.map((task) => ganttInstance.current.editModule.addRecord(task));
        // if (selectedOption === 'option1') setIsGanttVisible(true);

        // let dataa = selectedTemplate;
        // //setIsGanttVisible(!isGanttVisible);
        // houseData.map((task) => ganttInstance.current.editModule.addRecord(task));

        // ganttInstance.current.editModule.addRecord(data);
        // setTasks(templateData);
    }

    const handleCreateProject = () => {
        handleSaveChanges();
        setIsSelectVisible(true);
    };

    // const clickHandler = () => {
    //     // 1. Save the project data to the database (replace this with your database logic)
    //     handleSaveChanges().then(() => {
    //         // 2. Add HouseData to the Gantt chart (replace this with your Gantt chart logic)
    //         addHouseDataToGanttChart();
    //     });
    // };

    // const addHouseDataToGanttChart = () => {
    //     HouseData.map((task) => ganttInstance.current.editModule.addRecord(task));
    // };

    // useEffect(() => {
    //     fetchTasks();
    // }, []);
    // const fetchTasks = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/tasks');
    //         const tasksData = response.data;
    //         console.log('DATA: ', tasksData);
    //         // const skills = rolesData.map((role) => role.name);
    //         // setRoles(skills);
    //         // const skillsArray = Object.values(response.data);

    //         filteredTasksData = tasksData;
    //         // console.log('FILTERED RESOURCES: ', filteredTasksData);

    //         setTasks(tasksData);
    //         console.log('FETCHED TASKS: ', tasks);
    //         tasksData.forEach((task) => {
    //             task.resources = task.resources.filter((resource) => resource !== undefined || resource !== null);
    //             console.log(task.resources);
    //         });

    //         console.log('NEW FETCVH: ', tasksData);
    //         setTasks(tasksData);

    //         //loadedRoles = rolesData;
    //         //console.log('Roles: ', loadedRoles);
    //     } catch (error) {
    //         console.error('Error fetching tasks:', error);
    //     }
    // };

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
            loadedRoles = rolesData;
            console.log('Roles: ', loadedRoles);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    useEffect(() => {
        fetchEquip();
    }, []);

    const fetchEquip = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-equips');
            const equipData = response.data;
            setEquips(equipData);
            loadedEquips = equipData;
            console.log('LOADED EQUIPS: ', loadedEquips);
            setOriginalEquips(equipData); // Set the original equipment list
        } catch (error) {
            console.error('Error fetching equipment:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get-employees');
            const employeeData = response.data;
            setEmployees(employeeData);
            loadedManpower = employeeData;
            console.log('Manpower: ', loadedManpower);
            //setOriginalEmployees(employeeData); // Set the original employee list
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        if (projectId) {
            loadTaskDetails(projectId);
            setIsCreateVisible(false);
            setIsSelectVisible(true);
            // setIsGanttVisible(true);
        }
    }, [projectId]);

    const loadTaskDetails = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/tasks/${projectId}`);
            const taskData = response.data;
            console.log('TASKS DATAA: ', taskData);
            setTasks(taskData);
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                if (error.response.status === 404) {
                    console.error('Tasks not found');
                    alert('Tasks not found');
                } else {
                    console.error('Server error:', error.response.data.message);
                    alert(`Server error: ${error.response.data.message}`);
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('Network error:', error.message);
                alert('Network error. Please check your internet connection and try again.');
            } else {
                // Something else caused the error
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };
    useEffect(() => {
        if (projectId) {
            loadProjectDetails(projectId);
        }
    }, [projectId]);

    const loadProjectDetails = async (projectId) => {
        try {
            const response = await axios.get(`http://localhost:5000/project/${projectId}`);
            const projectData = response.data;
            console.log('PROJECT DATA: ', projectData);

            // const taskResponse = await axios.get(`http://localhost:5000/tasks/${projectId}`);
            // const taskData = taskResponse.data;
            // console.log('TASKS DATA: ', taskData);
            // const responseTask = await axios.get(`http://localhost:5000/tasks/${projectId}`);
            // const taskData = responseTask.data;
            // console.log('TASKS DATA: ', taskData);

            // if (taskData && taskData.length > 0) {
            //     const taskEndDates = taskData.map((task) => new Date(task.end_date));
            //     const latestEndDate = new Date(Math.max(...taskEndDates));
            //     setEndDate(latestEndDate);
            // }
            // // setTasks(taskData);

            //setTasks(taskData);
            setProjectTitle(projectData.name);
            setProjectLocation(projectData.location);
            setProjectDuration(projectData.duration);
            setProjectManager(projectData.manager_id);
            setStartDate(projectData.start_date);
            setEndDate(projectData.end_date);

            // projectData.tasks.map((taskID) => )
            //setTasks(projectData.tasks);

            console.log('Project details loaded successfully');
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                if (error.response.status === 404) {
                    console.error('Project not found');
                    alert('Project not found');
                } else {
                    console.error('Server error:', error.response.data.message);
                    alert(`Server error: ${error.response.data.message}`);
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('Network error:', error.message);
                alert('Network error. Please check your internet connection and try again.');
            } else {
                // Something else caused the error
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    // const loadProjectDetails = async (projectId) => {
    //     try {
    //         // Fetch project details
    //         const projectResponse = await axios.get(`http://localhost:5000/project/${projectId}`);
    //         const projectData = projectResponse.data;
    //         console.log('PROJECT DATA: ', projectData);

    //         // Fetch tasks associated with the project
    //         const taskResponse = await axios.get(`http://localhost:5000/tasks/${projectId}`);
    //         const tasksData = taskResponse.data;
    //         console.log('TASKS DATA: ', tasksData);

    //         // Calculate earliest start date and latest end date from task data
    //         const startDates = tasksData.map((task) => new Date(task.start_date));
    //         const endDates = tasksData.map((task) => new Date(task.end_date));

    //         const earliestStartDate = new Date(Math.min(...startDates));
    //         const latestEndDate = new Date(Math.max(...endDates));

    //         // Calculate total project duration
    //         const totalDuration = Math.ceil((latestEndDate - earliestStartDate) / (1000 * 60 * 60 * 24)) + 1;

    //         // Update state with project details
    //         setProjectTitle(projectData.name);
    //         setProjectLocation(projectData.location);
    //         setProjectDuration(totalDuration);
    //         setProjectManager(projectData.manager_id);
    //         setStartDate(earliestStartDate);
    //         setEndDate(latestEndDate);

    //         console.log('Project details loaded successfully');
    //     } catch (error) {
    //         if (error.response) {
    //             // Server responded with a status other than 2xx
    //             if (error.response.status === 404) {
    //                 console.error('Project not found');
    //                 alert('Project not found');
    //             } else {
    //                 console.error('Server error:', error.response.data.message);
    //                 alert(`Server error: ${error.response.data.message}`);
    //             }
    //         } else if (error.request) {
    //             // Request was made but no response received
    //             console.error('Network error:', error.message);
    //             alert('Network error. Please check your internet connection and try again.');
    //         } else {
    //             // Something else caused the error
    //             console.error('Error:', error.message);
    //             alert(`Error: ${error.message}`);
    //         }
    //     }
    // };

    const actionBegin = (args) => {
        // if (args.requestType == 'beforeOpenEditDialog' || args.requestType == 'beforeOpenAddDialog') {
        //     args.Resources.columns[3].visible = false;
        // }
        if (
            args.requestType === 'beforeAdd' &&
            ganttInstance.current.selectionModule.selectedRowIndexes.length === 0 &&
            !isAddRecordTriggered
        ) {
            args.cancel = true;
            const data = args.newTaskData;
            ganttInstance.current.editModule.dialogModule.dialogClose();
            isAddRecordTriggered = true;
            setTimeout(() => {
                ganttInstance.current.editModule.addRecord(data, 'Bottom');
                isAddRecordTriggered = false;
            }, 600);
        }
    };

    const actionComplete = async (args) => {
        if (args.requestType === 'add') {
            console.log("Added new record values available in the 'args' variable as 'newTaskData'", args);
            const newTaskData = args.newTaskData;
            console.log('ADDED RESOURCES: ', newTaskData.resources);
            console.log('ADDED SKILLS: ', newTaskData.RequiredSkill);
            console.log('ADDED EQUIPMENT: ', newTaskData.Equipment);

            const requiredSkillIDs = Array.isArray(newTaskData.RequiredSkill) ? newTaskData.RequiredSkill.map((skill) => skill) : [];
            const arrayEquip = [newTaskData.Equipment];
            const equipsName = Array.isArray(arrayEquip) ? arrayEquip.map((equip) => equip) : [];
            console.log('EQUIPMENT NAME: ', equipsName);
            // console.log('EQUIP IDS: ', equipIDs);
            console.log('EQUIPNAME: ', newTaskData.Equipment);
            console.log('START DATE: ', newTaskData.StartDate);

            // Ensure resources are also in the correct format and filter out invalid entries
            const resourceIDs = Array.isArray(newTaskData.resources)
                ? newTaskData.resources.filter((resource) => resource && resource.id).map((resource) => resource.id)
                : [];

            console.log(resourceIDs);
            const formattedTaskData = {
                TaskName: newTaskData.TaskName,
                Duration: newTaskData.Duration,
                StartDate: new Date(newTaskData.StartDate).toLocaleDateString('en-US'), // Format to 'MM/DD/YYYY'
                EndDate: newTaskData.EndDate ? new Date(newTaskData.EndDate).toLocaleDateString('en-US') : null,
                ProjectID: projectId,
                ParentId: newTaskData.ParentId,
                RequiredSkill: requiredSkillIDs,
                resources: resourceIDs,
                Equipment: equipsName,
                unit: newTaskData.EquipmentUnit,
                WorkloadUnit: newTaskData.WorkloadUnit,
                Workload: parseFloat(newTaskData.Workload),
                ProductivityRate: parseFloat(newTaskData.ProductivityRate),
                Predecessor: Array.isArray(newTaskData.Predecessor) ? newTaskData.Predecessor.join(', ') : newTaskData.Predecessor,
                AllocatedWorkers: newTaskData.AllocatedWorkers
            };

            formattedTaskData.Duration = parseInt(newTaskData.Duration);

            try {
                const response = await axios.post('http://localhost:5000/add-task', formattedTaskData);

                if (response.status === 201) {
                    console.log('Task added successfully:', response.data);
                    // fetchTasks(); // Refresh tasks after adding a new one
                    loadTaskDetails(projectId);
                } else {
                    console.error('Unexpected response status:', response.status);
                    console.error('Response data:', response.data);
                    alert('Error adding task. Please check the console for more details.');
                }
            } catch (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Server responded with an error:', error.response.data);
                    alert(`Error adding task: ${error.response.data.message || 'Server error'}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received from server:', error.request);
                    alert('Error adding task: No response received from server. Please try again later.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error setting up the request:', error.message);
                    alert(`Error adding task: ${error.message}`);
                }
            }
        }

        if (args.requestType === 'save') {
            const ModifiedTaskData = args.modifiedTaskData[0];
            const taskId = ModifiedTaskData.TaskID; // Assuming TaskID is the ID of the task being edited
            console.log('UPDATED TASK ID: ', taskId);
            console.log('Modified data: ', ModifiedTaskData);
            console.log("Edited record values available in the 'args' variable as 'modifiedTaskData'", args);
            console.log('EQUIPMENT CHANGED TO: ', ModifiedTaskData.Equipment);

            if (!taskId) {
                console.error('Task ID is undefined');
                return;
            }

            const requiredSkillIDs = Array.isArray(ModifiedTaskData.RequiredSkill)
                ? ModifiedTaskData.RequiredSkill.map((skill) => skill)
                : [];

            // Check if Equipment data is a single name or an array
            const equipmentNames = Array.isArray(ModifiedTaskData.Equipment) ? ModifiedTaskData.Equipment : [ModifiedTaskData.Equipment];

            console.log('EQUIPMENT NAMES: ', equipmentNames);
            // const arrayEquip = [ModifiedTaskData.Equipment];
            // const equipsName = Array.isArray(arrayEquip) ? arrayEquip.map((equip) => equip) : [];
            // console.log('EQUIPMENT NAME: ', equipsName);
            // const equipIDs = Array.isArray(ModifiedTaskData.Equipment) ? ModifiedTaskData.Equipment.map((equip) => equip) : [];
            //console.log('EQUIP IDS: ', equipIDs);
            //console.log('EQUIPNAME: ', ModifiedTaskData.Equipment);
            // Ensure resources are also in the correct format (if needed)
            // const resourceIDs = Array.isArray(ModifiedTaskData.resources) ? ModifiedTaskData.resources.map((resource) => resource.id) : [];
            // const filteredResources = resourceIDs.filter((resource) => resource !== undefined);
            const resourceIDs = Array.isArray(ModifiedTaskData.resources)
                ? ModifiedTaskData.resources.filter((resource) => resource && resource.id).map((resource) => resource.id)
                : [];

            const updatedTaskData = {
                TaskName: ModifiedTaskData.TaskName,
                Duration: ModifiedTaskData.Duration,
                StartDate: new Date(ModifiedTaskData.StartDate).toLocaleDateString('en-US'), // Format to 'MM/DD/YYYY'
                EndDate: ModifiedTaskData.EndDate ? new Date(ModifiedTaskData.EndDate).toLocaleDateString('en-US') : null,
                ProjectID: projectId,
                ParentId: ModifiedTaskData.ParentId,
                RequiredSkill: requiredSkillIDs,
                resources: resourceIDs,
                Equipment: equipmentNames,
                unit: ModifiedTaskData.EquipmentUnit,
                WorkloadUnit: ModifiedTaskData.WorkloadUnit,
                Workload: parseFloat(ModifiedTaskData.Workload),
                ProductivityRate: parseFloat(ModifiedTaskData.ProductivityRate),
                Predecessor: Array.isArray(ModifiedTaskData.Predecessor)
                    ? ModifiedTaskData.Predecessor.join(', ')
                    : ModifiedTaskData.Predecessor,
                AllocatedWorkers: ModifiedTaskData.AllocatedWorkers
            };
            updatedTaskData.Duration = parseInt(ModifiedTaskData.Duration);
            console.log('UPDATED TASK DATA: ', updatedTaskData);

            try {
                const response = await axios.put(`http://localhost:5000/update-task/${taskId}`, updatedTaskData);

                if (response.status === 200) {
                    console.log('Task updated successfully:', response.data);
                    // fetchTasks(); // Refresh tasks after updating
                    loadTaskDetails(projectId);
                } else {
                    console.error('Unexpected response status:', response.status);
                    console.error('Response data:', response.data);
                    alert('Error updating task. Please check the console for more details.');
                }
            } catch (error) {
                // Error handling code
            }
        }

        // if (args.requestType === 'save') {
        //     console.log("Edited record values available in the 'args' variable as 'modifiedTaskData'", args);

        // }

        // if (args.requestType === 'delete') {
        //     console.log('Modified Records after Delete action', args);
        //     console.log(args.data[0]);
        // }
        if (args.requestType === 'delete') {
            console.log('Modified Records after Delete action', args);
            console.log(args.data[0]);
            const deletedTaskData = args.data[0];
            console.log('DELETED ID: ', deletedTaskData.TaskID); // Assuming only one task is deleted at a time
            try {
                const response = await axios.delete(`http://localhost:5000/delete-task/${deletedTaskData.TaskID}`);

                if (response.status === 200) {
                    console.log('Task deleted successfully:', response.data);
                    // fetchTasks(); // Refresh tasks after deleting
                    loadTaskDetails(projectId);
                } else {
                    console.error('Unexpected response status:', response.status);
                    console.error('Response data:', response.data);
                    alert('Error deleting task. Please check the console for more details.');
                }
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with an error:', error.response.data);
                    alert(`Error deleting task: ${error.response.data.message || 'Server error'}`);
                } else if (error.request) {
                    console.error('No response received from server:', error.request);
                    alert('Error deleting task: No response received from server. Please try again later.');
                } else {
                    console.error('Error setting up the request:', error.message);
                    alert(`Error deleting task: ${error.message}`);
                }
            }
        }
    };

    const editResourcesParams = { columns: [{ field: 'Skills', valueAccessor: skillNames, allowEditing: false }] };
    function skillNames(field, data, column) {
        const skill = data.skills?.map((skill) => skill.name).join(', ');
        console.log('EDT RESOURCE PARAMS: ', skill);
        return skill;
    }

    // const skills = [
    //     { skillName: 'Carpenter', skillId: '1' },
    //     { skillName: 'Painter', skillId: '2' },
    //     { skillName: 'Former', skillId: '3' },
    //     { skillName: 'Driver', skillId: '4' },
    //     { skillName: 'Director', skillId: '5' }
    // ];
    // let ganttInstance;
    let elem;
    // MultiSelect.Inject(CheckBoxSelection);
    let multiSelectObj;

    const multiSelectList = {
        create: () => {
            elem = document.createElement('input');
            return elem;
        },
        read: () => {
            return multiSelectObj.value;
        },
        destroy: () => {
            multiSelectObj.destroy();
        },
        write: (args) => {
            // Get the skill IDs from the row data
            const skillIds = args.rowData[args.column.field] || [];

            // Map the skill IDs to skill names
            // const skillNames = skillIds
            //     .map((id) => {
            //         const skill = loadedRoles.find((role) => role.id === id);
            //         return skill ? skill.name : '';
            //     })
            //     .filter((name) => name !== '');
            console.log('SKILLS ARRAY: ', loadedRoles);
            // Prepare the skills for the MultiSelect dataSource
            const formattedRoles = Array.isArray(loadedRoles) ? loadedRoles.map((role) => ({ id: role.id, name: role.name })) : [];

            // Create the MultiSelect component
            multiSelectObj = new MultiSelect({
                dataSource: formattedRoles,
                mode: 'CheckBox',
                fields: { value: 'name', text: 'name' },
                floatLabelType: 'Always',
                placeholder: 'Required Manpower',
                // Set the value to the skill IDs for saving purposes, but show the names
                value: args.rowData[args.column.field] || []
            });

            multiSelectObj.appendTo(elem);
        }
    };

    // let elem;
    let dropdownlistObj;
    let dropdownlist = {
        create: () => {
            elem = document.createElement('input');
            return elem;
        },
        read: () => {
            return dropdownlistObj.value;
        },
        destroy: () => {
            dropdownlistObj.destroy();
        },
        write: (args) => {
            console.log('LOADED QYUEOIEJE: ', loadedEquips);
            const formattedEquips = Array.isArray(loadedEquips) ? loadedEquips.map((equip) => ({ id: equip.id, name: equip.name })) : [];
            dropdownlistObj = new DropDownList({
                dataSource: formattedEquips,
                fields: { value: 'name', text: 'name' },
                floatLabelType: 'Never',
                placeholder: 'Required Equipment',
                value: args.rowData[args.column.field]
            });
            dropdownlistObj.appendTo(elem);
        }
    };
    const addMessage = (message) => {
        const maxLogLength = 5;
        const newMessage = { message };
        const newMessages = [newMessage, ...messages];

        if (newMessages.length > maxLogLength) {
            newMessages.length = maxLogLength;
        }
        setMessages(newMessages);
    };

    const logDataUpdate = (type, action, item, id) => {
        let text = item && item.text ? ` (${item.text})` : '';
        let message = `${type} ${action}: ${id} ${text}`;
        if (type === 'link' && action !== 'delete') {
            message += ` (source: ${item.source}, target: ${item.target})`;
        }
        addMessage(message);
    };

    // Function to handle radio button change
    const handleZoomChange = (event) => {
        setCurrentZoom(event.target.value); // Update the zoom level state
        console.log(currentZoom);
    };

    const handleManpowerButtonClick = () => {
        setManpower([...manpower, { label: '', quantity: '' }]);
    };

    const handleEquipmentButtonClick = () => {
        setEquipment([...equipment, { label: '', quantity: '' }]);
    };

    const handleDeleteManpower = (index) => {
        setManpower(manpower.filter((_, i) => i !== index));
    };

    const handleDeleteEquipment = (index) => {
        setEquipment(equipment.filter((_, i) => i !== index));
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        // console.log('SELECTED OPTION', selectedOption);
        selectedTemplate = event.target.value;
        console.log('SELECTED OPTION', selectedTemplate);
        // setTasks(event.target.value);
    };

    const handleCompute = async () => {
        // handleSaveChanges();
        try {
            let response;
            response = await axios.get(`http://localhost:5000/optimize-tasks/${projectId}`);
            let computedData = response.data;
            // setTasks(computedData);
            // computedData.map((task) => ganttInstance.current.editModule.addRecord(task));
            computedData.map((task) => ganttInstance.current.updateRecordByID(task));
            // computedData.map((task) => console.log('TASK: ', task));

            // ganttInstance.updateRecordByID = computedData;
            // ganttInstance.dataSource = computedData;
            // ganttInstance.refresh();
            console.log('COMPUTED DATA: ', computedData);
            handleSaveChanges();
        } catch (error) {
            console.error('Error fetching computed data:', error);
            setAlertInfo({ type: 'error', message: 'Error: Check dependencies' });
            window.alert('Error: Make sure to add dependecies');
        }
    };

    const handleViewReport = async () => {
        history.push(`/pso-pages/reports/${projectId}`);
    };

    const handleSaveChanges = async () => {
        setIsCreateVisible(false);
        setIsSelectVisible(false);
        const projectDetails = {
            name: projectTitle,
            location: projectLocation,
            duration: 100,
            manager_id: String(user._id),
            tasks: tasks,
            start_date: startDate,
            end_date: endDate
        };

        try {
            let response;
            if (projectId) {
                // Update existing project
                response = await axios.put(`http://localhost:5000/update-project/${projectId}`, projectDetails);
                if (response.status === 200) {
                    console.log('Project updated successfully:', response.data);
                    setAlertInfo({ type: 'success', message: 'Changes have been saved!' });
                } else {
                    console.error('Unexpected response status:', response.status);
                    alert('Error updating project.');
                }
            } else {
                // Create new project
                response = await axios.post('http://localhost:5000/save-project', projectDetails);
                if (response.status === 201) {
                    console.log('Project created successfully:', response.data);
                    const newProjectId = response.data.project_id;
                    console.log('NEW PROJECT ID: ', newProjectId);
                    history.push(`/pso-pages/project/${newProjectId}`);
                    //setProjectId(response.data.project_id); // Save the new project ID
                } else {
                    console.error('Unexpected response status:', response.status);
                    alert('Error creating project.');
                }
            }
            window.alert('Changes have been saved!');
            // setAlertInfo({ type: 'success', message: 'Changes have been saved!' });
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.data);
                alert(`Error saving project: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                console.error('No response received from server:', error.request);
                alert('Error saving project: No response received from server. Please try again later.');
            } else {
                console.error('Error setting up the request:', error.message);
                alert(`Error saving project: ${error.message}`);
            }
        }
    };
    const renderManpowerInputs = () => {
        return manpower.map((manpowerField, index) => (
            <Grid container spacing={1} key={`manpower-${index}`}>
                <Grid item xs={9}>
                    <TextField
                        label={`Manpower ${index + 1} (e.g. "Steelmen")`}
                        fullWidth
                        value={manpowerField.label}
                        onChange={(e) => {
                            const updatedManpower = [...manpower];
                            updatedManpower[index].label = e.target.value;
                            setManpower(updatedManpower);
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Input
                        type="number"
                        placeholder="Quantity"
                        fullWidth
                        value={manpowerField.quantity}
                        inputProps={{ style: inputStyles }}
                        onChange={(e) => {
                            const updatedManpower = [...manpower];
                            updatedManpower[index].quantity = e.target.value;
                            setManpower(updatedManpower);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button onClick={() => handleDeleteManpower(index)}>
                        <IconX />
                    </Button>
                </Grid>
            </Grid>
        ));
    };

    const renderEquipmentInputs = () => {
        return equipment.map((equipmentField, index) => (
            <Grid container spacing={1} key={`equipment-${index}`}>
                <Grid item xs={9}>
                    <TextField
                        label={`Equipment ${index + 1} (e.g. "Crane")`}
                        fullWidth
                        value={equipmentField.label}
                        onChange={(e) => {
                            const updatedEquipment = [...equipment];
                            updatedEquipment[index].label = e.target.value;
                            setEquipment(updatedEquipment);
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Input
                        type="number"
                        placeholder="Quantity"
                        fullWidth
                        value={equipmentField.quantity}
                        inputProps={{ style: inputStyles }}
                        onChange={(e) => {
                            const updatedEquipment = [...equipment];
                            updatedEquipment[index].quantity = e.target.value;
                            setEquipment(updatedEquipment);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Button onClick={() => handleDeleteEquipment(index)}>
                        <IconX />
                    </Button>
                </Grid>
            </Grid>
        ));
    };

    const onChange = (args) => {
        if (args.value === '1') {
            ganttInstance.timelineSettings.timelineViewMode = 'Hour';
        } else if (args.value === '2') {
            ganttInstance.timelineSettings.timelineViewMode = 'Day';
        } else if (args.value === '3') {
            ganttInstance.timelineSettings.timelineViewMode = 'Week';
        } else if (args.value === '4') {
            ganttInstance.timelineSettings.timelineViewMode = 'Month';
        } else if (args.value === '5') {
            ganttInstance.timelineSettings.timelineViewMode = 'Year';
        }
    };

    const toolbarOptions = ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'PdfExport'];
    const toolbarClick = (args) => {
        if (args.item.id.includes('pdfexport')) {
            ganttInstance.current.pdfExport({
                filename: 'Project-Data.pdf',
                enableFooter: false,
                showPredecessorLines: false
            });
        }
    };
    return (
        <MainCard title="Schedule Project">
            <form>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField label="Project Title" fullWidth value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Location"
                            fullWidth
                            value={projectLocation}
                            onChange={(e) => setProjectLocation(e.target.value)}
                        />
                    </Grid>

                    {/* <Grid item xs={6}>
                        <TextField
                            label="Duration"
                            fullWidth
                            value={projectDuration}
                            onChange={(e) => setProjectDuration(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="Project Manager"
                            fullWidth
                            value={projectManager}
                            onChange={(e) => setProjectManager(e.target.value)}
                        />
                    </Grid> */}
                    <Grid item xs={6}>
                        <TextField
                            label="Start Date"
                            fullWidth
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                placeholder: ''
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            label="End Date"
                            fullWidth
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                placeholder: ''
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}></Grid>

                    {/* <Grid item xs={6}></Grid> */}
                    {isCreateVisible && (
                        <Grid item xs={4}>
                            <Button variant="contained" color="secondary" sx={{ width: '80%' }} onClick={handleCreateProject}>
                                Create project
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={6}></Grid>
                    <Grid item xs={12}></Grid>
                    {isSelectVisible && (
                        <Grid container>
                            <Grid item xs={6}>
                                <FormControl sx={{ minWidth: '100%', paddingTop: 1 }}>
                                    {/* <h4 marginLeft="50px">Choose a template</h4> */}

                                    <InputLabel sx={{ marginTop: '20px', fontSize: '18px' }}>Choose a project template</InputLabel>
                                    <Select sx={{ marginTop: '30px' }} value={selectedOption} onChange={handleSelectChange} label="Option">
                                        {/* <MenuItem value="None">
                                    <em>None</em>
                                </MenuItem> */}
                                        <MenuItem value="option1">None</MenuItem>
                                        <MenuItem value="HouseData">Small Project (House)</MenuItem>
                                        <MenuItem value="BuildingData">Medium Project (Typical Building Floor)</MenuItem>
                                        <MenuItem value="RoadData">Medium Project (Road)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={12}></Grid>

                            {/* <Grid item xs={6}></Grid> */}
                            <Grid item xs={4}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ width: '80%', marginTop: '20px' }}
                                    onClick={clickHandler}
                                >
                                    Load new template
                                </Button>
                            </Grid>
                        </Grid>
                        // </div>
                    )}

                    {/* <Grid item xs={5}>
                             <h3 style={{ marginLeft: '10px' }}>Manpower Requirement:</h3>
                         </Grid>
                         <Grid item xs={1}>
                             <Button variant="outlined" color="secondary" onClick={this.handleManpowerButtonClick} startIcon={<IconPlus />}>
                                 Add
                            </Button>/                         </Grid>
                         <Grid item xs={5}>
                             <h3 style={{ marginLeft: '10px' }}>Equipment Requirement</h3>
                         </Grid>
                         <Grid item xs={1}>
                             <Button
                                 variant="outlined"
                                 color="secondary"
                                 style={{ marginRight: '10px' }}
                                 onClick={this.handleEquipmentButtonClick}
                                 startIcon={<IconPlus />}
                             >
                                 Add
                             </Button>
                         </Grid>
                         <Grid item xs={6}>
                             {renderManpowerInputs()}
                        </Grid>
                         <Grid item xs={6}>
                             {renderEquipmentInputs()}
                         </Grid> */}
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}></Grid>
                </Grid>
            </form>
            {/* {isGanttVisible && ( */}
            <div>
                <GanttChartWithRadioButtons zoomLevel={currentZoom} onZoomChange={handleZoomChange} />
                {/* <Resizable defaultSize={{ width: '100%', height: 800 }}> */}
                <GanttComponent
                    width="100%"
                    height="500"
                    ref={ganttInstance}
                    //ref={(gantt) => (ganttInstance = gantt)}
                    //dataSource={SelfRefData}
                    timelineSettings={timelineSettings}
                    dataSource={tasks ? tasks : selectedOption}
                    editSettings={editOptions}
                    loadingIndicator={{ indicatorType: 'Spinner' }}
                    toolbar={[
                        'Add',
                        'Edit',
                        'Delete',
                        'Update',
                        'Cancel',
                        'ExpandAll',
                        'CollapseAll',
                        'ZoomIn',
                        'ZoomOut',
                        'ZoomToFit',
                        'PdfExport'
                    ]}
                    // viewType="ResourceView"
                    allowSelection={true}
                    selectionSettings={{ enableToggle: true }}
                    showOverAllocation={true}
                    enableMultiTaskbar={true}
                    taskFields={taskValues}
                    sortSettings={sortSettings}
                    allowSorting={true}
                    // resources={resourceDetails}
                    resources={employees}
                    resourceFields={resourceFields}
                    labelSettings={{ rightLabel: 'resources', taskLabel: 'TaskName' }}
                    editDialogFields={editDialogFields}
                    enableContextMenu={true}
                    toolbarClick={toolbarClick}
                    allowPdfExport={true}
                    actionBegin={actionBegin}
                    actionComplete={actionComplete}
                >
                    <Inject services={[Edit, Toolbar, Selection, PdfExport, ContextMenu, VirtualScroll, Sort]}></Inject>
                    <ColumnsDirective>
                        <ColumnDirective field="TaskID" headerText="ID" width="100"></ColumnDirective>
                        <ColumnDirective field="TaskName" headerText="Scope of Work"></ColumnDirective>
                        <ColumnDirective field="StartDate" format="dd-MMM-yy" width="100"></ColumnDirective>
                        <ColumnDirective field="Duration" textAlign="Right" width="100"></ColumnDirective>
                        <ColumnDirective field="EndDate" format="dd-MMM-yy" width="100"></ColumnDirective>
                        <ColumnDirective field="Workload" headerText="Workload" format="N2" width="100"></ColumnDirective>
                        <ColumnDirective field="WorkloadUnit" headerText="Unit" width="100"></ColumnDirective>
                        <ColumnDirective field="ProductivityRate" headerText="Productivity Rate" width="100"></ColumnDirective>
                        {/* <ColumnDirective field="UnitPerHour" headerText="Unit/Hour" allowEditing={false} width="100"></ColumnDirective> */}
                        <ColumnDirective
                            field="RequiredSkill"
                            edit={multiSelectList}
                            headerText="Required Manpower"
                            width="200"
                        ></ColumnDirective>
                        <ColumnDirective
                            field="Equipment"
                            headerText="Required Equipment"
                            width="200"
                            edit={dropdownlist}
                        ></ColumnDirective>
                        <ColumnDirective field="AllocatedWorkers" headerText="Allocated Workers" width="200"></ColumnDirective>
                        {/* <ColumnDirective field="resources" headerText="Resources" width="200"></ColumnDirective> */}
                    </ColumnsDirective>
                    <AddDialogFieldsDirective>
                        <AddDialogFieldDirective
                            type="General"
                            headerText="General"
                            fields={[
                                'TaskID',
                                'TaskName',
                                'StartDate',
                                'Duration',
                                'EndDate',
                                'RequiredSkill',
                                'Equipment',
                                'AllocatedWorkers'
                            ]}
                        ></AddDialogFieldDirective>
                        <AddDialogFieldDirective type="Dependency"></AddDialogFieldDirective>

                        {/* <AddDialogFieldDirective type="ProjectID"></AddDialogFieldDirective> */}
                        {/* <AddDialogFieldDirective type="WorkloadUnit"></AddDialogFieldDirective> */}
                        <AddDialogFieldDirective
                            type="Custom"
                            headerText="Workload"
                            fields={['Workload', 'WorkloadUnit', 'ProductivityRate', 'UnitPerHour']}
                        ></AddDialogFieldDirective>
                        {/* <AddDialogFieldDirective type="Resources" additionalParams={editResourcesParams}></AddDialogFieldDirective> */}
                        <AddDialogFieldDirective type="AllocatedWorkers"></AddDialogFieldDirective>
                    </AddDialogFieldsDirective>
                    <EditDialogFieldsDirective>
                        <EditDialogFieldDirective
                            type="General"
                            headerText="General"
                            fields={[
                                'TaskID',
                                'TaskName',
                                'StartDate',
                                'Duration',
                                'EndDate',
                                'RequiredSkill',
                                'Equipment',
                                'AllocatedWorkers'
                            ]}
                        ></EditDialogFieldDirective>
                        <EditDialogFieldDirective type="Dependency"></EditDialogFieldDirective>
                        <EditDialogFieldDirective
                            type="Custom"
                            headerText="Workload"
                            fields={['Workload', 'WorkloadUnit', 'ProductivityRate', 'UnitPerHour']}
                        ></EditDialogFieldDirective>
                        {/* <EditDialogFieldDirective type="Resources" additionalParams={editResourcesParams}></EditDialogFieldDirective> */}
                        <EditDialogFieldDirective type="AllocatedWorkers"></EditDialogFieldDirective>
                    </EditDialogFieldsDirective>
                </GanttComponent>
                {/* </Resizable> */}
                {/* <MessageArea messages={taskDetails} /> */}
                <div dangerouslySetInnerHTML={{ __html: taskDetails }}></div>
                <Grid container spacing={1}>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}></Grid>{' '}
                </Grid>{' '}
                <Box mt={2} mb={2} display="flex" justifyContent="flex-start">
                    {' '}
                    <Button
                        color="secondary"
                        variant="contained"
                        style={{ marginRight: '10px', color: 'white' }}
                        onClick={handleSaveChanges}
                    >
                        Save Changes{' '}
                    </Button>{' '}
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ marginRight: '10px', color: 'white' }}
                        onClick={handleCompute}
                        // onClick={this.handleEditResourcesClick}
                    >
                        Compute Schedule
                    </Button>
                    <Button
                        color="secondary"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        onClick={handleViewReport}
                        // onClick={this.handleEditResourcesClick}
                    >
                        View report
                    </Button>
                    {/* <Button color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button color="secondary" variant="outlined" onClick={clickHandler} style={{ marginRight: '10px' }}>
                        Add Task
                    </Button> */}
                </Box>
            </div>
            {alertInfo && <AlertMessage type={alertInfo.type} message={alertInfo.message} onClose={() => setAlertInfo(null)} />}
            {/* )} */}
            {/* <EditResourcesModal /> */}
        </MainCard>
    );
};

const inputStyles = {
    WebkitAppearance: 'none',
    MozAppearance: 'textfield',
    textAlign: 'center'
};

export default GanttProject;
