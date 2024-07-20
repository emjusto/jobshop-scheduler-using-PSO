// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
// import { format, differenceInCalendarDays } from 'date-fns';

// const ReportsPage = () => {
//     const { projectId } = useParams();
//     const [reportData, setReportData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchReportData = async () => {
//             try {
//                 // Fetch tasks data
//                 const tasksResponse = await axios.get(`http://localhost:5000/tasks/${projectId}`);
//                 const tasksData = tasksResponse.data;

//                 // Fetch all projects data
//                 const projectsResponse = await axios.get(`http://localhost:5000/projects`);
//                 const projectsData = projectsResponse.data;

//                 // Find the project with the matching projectId
//                 const project = projectsData.find((proj) => proj.id === parseInt(projectId));

//                 if (project) {
//                     // Set report data with project name and tasks data
//                     setReportData({
//                         projectName: project.name,
//                         startDate: project.start_date,
//                         endDate: project.end_date,
//                         tasks: tasksData
//                     });

//                     setLoading(false);
//                 } else {
//                     setError('Project not found');
//                     setLoading(false);
//                 }
//             } catch (err) {
//                 setError(err.message);
//                 setLoading(false);
//             }
//         };

//         fetchReportData();
//     }, [projectId]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     const { projectName, startDate, endDate, tasks } = reportData;

//     // Parse the allocated workers from tasks
//     const totalWorkersEach = tasks.map((task) => task.AllocatedWorkers).join('\n');

//     // Calculate earliest start date and latest end date from task data
//     const startDates = tasks.map((task) => new Date(task.StartDate));
//     const endDates = tasks.map((task) => new Date(task.EndDate));
//     console.log('STARTS: ', startDates);
//     console.log('ENDS: ', endDates);

//     const earliestStartDate = new Date(Math.min(...startDates));
//     const latestEndDate = new Date(Math.max(...endDates));

//     console.log('EARLIEST: ', earliestStartDate);

//     // Calculate total project duration
//     const totalDuration = differenceInCalendarDays(latestEndDate, earliestStartDate) + 1;

//     return (
//         <Box p={3}>
//             <Typography variant="h4" gutterBottom>
//                 Reports for Project ID: {projectId}
//             </Typography>
//             <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
//                 <Typography variant="h5" gutterBottom>
//                     Project Details
//                 </Typography>
//                 <Typography variant="body1">
//                     <strong>Project Name:</strong> {projectName}
//                 </Typography>
//                 <Typography variant="body1">
//                     <strong>Start Date:</strong> {format(new Date(earliestStartDate), "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)")}
//                 </Typography>
//                 <Typography variant="body1">
//                     <strong>End Date:</strong> {format(new Date(latestEndDate), "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)")}
//                 </Typography>
//                 <Typography variant="body1">
//                     <strong>Total Workers:</strong>{' '}
//                     {totalWorkersEach.split('\n').map((worker, index) => (
//                         <div key={index}>{worker}</div>
//                     ))}
//                 </Typography>
//                 <Typography variant="body1">
//                     <strong>Total Project Duration:</strong> {totalDuration} days
//                 </Typography>
//             </Paper>
//             <Paper elevation={3} style={{ padding: '16px' }}>
//                 <Typography variant="h5" gutterBottom>
//                     Task Details
//                 </Typography>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Task ID</TableCell>
//                             <TableCell>Scope of Work</TableCell>
//                             <TableCell>Duration</TableCell>
//                             <TableCell>Start Date</TableCell>
//                             <TableCell>End Date</TableCell>
//                             <TableCell>Predecessor</TableCell>
//                             <TableCell>Productivity Rate</TableCell>
//                             <TableCell>Manpower</TableCell>
//                             <TableCell>Workload</TableCell>
//                             <TableCell>Equipment</TableCell>
//                             <TableCell>Allocated Workers</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {tasks.map((task) => (
//                             <TableRow key={task.TaskID}>
//                                 <TableCell>{task.TaskID}</TableCell>
//                                 <TableCell>{task.TaskName}</TableCell>
//                                 <TableCell>{task.Duration}</TableCell>
//                                 <TableCell>{format(new Date(task.StartDate), "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)")}</TableCell>
//                                 <TableCell>{format(new Date(task.EndDate), "EEE MMM dd yyyy HH:mm:ss 'GMT'xxx (zzzz)")}</TableCell>
//                                 <TableCell>{task.Predecessor}</TableCell>
//                                 <TableCell>{task.ProductivityRate}</TableCell>
//                                 <TableCell>{task.RequiredSkill.join(', ')}</TableCell>
//                                 <TableCell>{task.Workload}</TableCell>
//                                 <TableCell>{task.Equipment}</TableCell>
//                                 <TableCell>{task.AllocatedWorkers}</TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </Paper>
//         </Box>
//     );
// };

// export default ReportsPage;
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Grid } from '@material-ui/core';
import { IconPlus, IconX, IconArrowBack } from '@tabler/icons';
import { format, differenceInCalendarDays } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { GanttComponent, Sort, Inject, PdfExport, Toolbar, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-gantt';
import GanttProject from './new-project';

const taskValues = {
    id: 'TaskID',
    name: 'TaskName',
    startDate: 'StartDate',
    endDate: 'EndDate',
    duration: 'Duration',
    // progress: 'Progress',
    dependency: 'Predecessor',
    // resourceInfo: 'resources',
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

const editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
    newRowPosition: 'Child',
    allowPdfExport: true
};
const sortSettings = {
    columns: [{ field: 'StartDate', direction: 'Ascending' }]
};

const ReportsPage = () => {
    const { projectId } = useParams();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const history = useHistory();
    const ganttInstance = useRef(null);
    let gantttasks;

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                // Fetch tasks data
                const tasksResponse = await axios.get(`http://localhost:5000/tasks/${projectId}`);
                const tasksData = tasksResponse.data;

                // Fetch all projects data
                const projectsResponse = await axios.get(`http://localhost:5000/projects`);
                const projectsData = projectsResponse.data;

                // Find the project with the matching projectId
                const project = projectsData.find((proj) => proj.id === parseInt(projectId));

                if (project) {
                    // Set report data with project name and tasks data
                    setReportData({
                        projectName: project.name,
                        startDate: project.start_date,
                        endDate: project.end_date,
                        tasks: tasksData
                    });

                    setLoading(false);
                } else {
                    setError('Project not found');
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReportData();
    }, [projectId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const actionBegin = (args) => {
        if (args.requestType == 'beforeOpenEditDialog' || args.requestType == 'beforeOpenAddDialog') {
            // args.Resources.columns[3].visible = false;
            const data = args.data;
            console.log('LOADED UNEDIT DATA FROM ARGS: ', args.data);
            console.log('LOADED FROM TASKS: ', tasks);
            console.log('fhfkfjk');
        }
        // if (args.requestType === 'beforeAdd') {
        //     // args.cancel = true;
        //     // const data = args.data;
        //     // console.log('LOADED UNEDIT DATA: ', data);
        //     // ganttInstance.current.editModule.dialogModule.dialogClose();
        //     // isAddRecordTriggered = true;
        //     // setTimeout(() => {
        //     //     ganttInstance.current.editModule.addRecord(data, 'Bottom');
        //     //     isAddRecordTriggered = false;
        //     // }, 600);
        // }
        const data = args.data;
        gantttasks = tasks;
        console.log('LOADED UNEDIT DATA: ', gantttasks);
    };

    const handleBack = async () => {
        history.push(`/pso-pages/project/${projectId}`);
    };

    const { projectName, startDate, endDate, tasks } = reportData;

    // Parse the allocated workers from tasks
    // const totalWorkersEach = tasks.map((task) => task.AllocatedWorkers).join('\n');
    // Parse and aggregate the allocated workers from tasks
    const workerTotals = tasks.reduce((acc, task) => {
        const workers = task.AllocatedWorkers.split(', ');
        workers.forEach((worker) => {
            const [name, count] = worker.split(': ');
            if (acc[name]) {
                acc[name] += parseInt(count, 10);
            } else {
                acc[name] = parseInt(count, 10);
            }
        });
        return acc;
    }, {});

    const totalWorkersEach = Object.entries(workerTotals)
        .map(([name, count]) => `${name}: ${count}`)
        .join('\n');

    // console.log('GANTT TASKS: ', gantttasks);
    // Calculate earliest start date and latest end date from task data
    const startDates = tasks.map((task) => new Date(task.StartDate));
    const endDates = tasks.map((task) => new Date(task.EndDate));

    const earliestStartDate = new Date(Math.min(...startDates));
    const latestEndDate = new Date(Math.max(...endDates));

    // Calculate total project duration
    const totalDuration = differenceInCalendarDays(latestEndDate, earliestStartDate) + 1;
    let grid;
    const toolbarClick = (args) => {
        if (args.item.id.includes('pdfexport')) {
            ganttInstance.current.pdfExport({
                filename: 'Project-Data.pdf',
                enableFooter: false,
                showPredecessorLines: false
                // fitToWidthSettings: {
                //     isFitToWidth: true
                // }
            });
        }
    };

    const beforePdfExport = () => {
        if (grid) {
            grid.columns[3].visible = false;
            grid.columns[2].visible = false;
        }
    };
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Reports for Project ID: {projectId}
            </Typography>
            {/* <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
                <Typography variant="h5" gutterBottom>
                    Project Details
                </Typography>
                <Typography variant="body1">
                    <strong>Project Name:</strong> {projectName}
                </Typography>
                <Typography variant="body1">
                    <strong>Start Date:</strong> {format(new Date(earliestStartDate), 'EEE MMM dd yyyy')}
                </Typography>
                <Typography variant="body1">
                    <strong>End Date:</strong> {format(new Date(latestEndDate), 'EEE MMM dd yyyy')}
                </Typography>
                <Typography variant="body1">
                    <strong>Manpower:</strong>{' '}
                    {totalWorkersEach.split('\n').map((worker, index) => (
                        <div key={index}>{worker}</div>
                    ))}
                    <strong>Total Workers:</strong>{' '}
                    {totalWorkersEach.split('\n').map((worker, index) => (
                        <div key={index}>{worker}</div>
                    ))}
                </Typography>
                <Typography variant="body1">
                    <strong>Total Project Duration:</strong> {totalDuration} days
                </Typography>
            </Paper> */}
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '24px' }}>
                <Typography variant="h5" gutterBottom>
                    Project Summary
                </Typography>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <strong>Project Name: </strong> {projectName}
                            </TableCell>
                            <TableCell>
                                <strong>Optimized Project Duration: </strong> {totalDuration} days
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Start Date: </strong>
                                {format(new Date(earliestStartDate), 'EEE MMM dd yyyy')}
                            </TableCell>
                            <TableCell>
                                <strong>End Date: </strong> {format(new Date(latestEndDate), 'EEE MMM dd yyyy')}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Allocated Manpower:</strong>
                            </TableCell>
                            <TableCell>{totalWorkersEach}</TableCell>
                        </TableRow>
                        {/* <TableRow>
                            <TableCell>
                                <strong>Manpower:</strong>
                            </TableCell>
                            <TableCell>{totalWorkersEach}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <strong>Total Project Duration:</strong>
                            </TableCell>
                            <TableCell>{totalDuration} days</TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </Paper>
            {/* <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant="h5" gutterBottom>
                    Task Details
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Scope of Work</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Predecessor</TableCell>
                            <TableCell>Productivity Rate</TableCell>
                            <TableCell>Manpower</TableCell>
                            <TableCell>Workload</TableCell>
                            <TableCell>Equipment</TableCell>
                            <TableCell>Allocated Workers</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.TaskID}>
                                <TableCell>{task.TaskID}</TableCell>
                                <TableCell>{task.TaskName}</TableCell>
                                <TableCell>{task.Duration}</TableCell>
                                <TableCell>{format(new Date(task.StartDate), 'EEE MMM dd yyyy')}</TableCell>
                                <TableCell>{format(new Date(task.EndDate), 'EEE MMM dd yyyy')}</TableCell>
                                <TableCell>{task.Predecessor}</TableCell>
                                <TableCell>{task.ProductivityRate}</TableCell>
                                <TableCell>{task.RequiredSkill.join(', ')}</TableCell>
                                <TableCell>{task.Workload}</TableCell>
                                <TableCell>{task.Equipment}</TableCell>
                                <TableCell>{task.AllocatedWorkers}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper> */}

            <GanttComponent
                dataSource={tasks}
                taskFields={taskValues}
                sortSettings={sortSettings}
                allowSorting={true}
                actionBegin={actionBegin}
                allowPdfExport={true}
                toolbarClick={toolbarClick}
                ref={ganttInstance}
                toolbar={['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PdfExport']}
                height="400px"
            >
                <Inject services={[Sort, PdfExport, Toolbar]}></Inject>
                <ColumnsDirective>
                    <ColumnDirective field="TaskID" headerText="ID" width="100"></ColumnDirective>
                    <ColumnDirective field="TaskName" headerText="Scope of Work"></ColumnDirective>
                    <ColumnDirective field="StartDate" format="dd-MMM-yy" width="100"></ColumnDirective>
                    <ColumnDirective field="Duration" textAlign="Right" width="100"></ColumnDirective>
                    <ColumnDirective field="EndDate" format="dd-MMM-yy" width="100"></ColumnDirective>
                    <ColumnDirective field="Workload" headerText="Workload" width="100"></ColumnDirective>
                    <ColumnDirective field="WorkloadUnit" headerText="Unit" width="100"></ColumnDirective>
                    <ColumnDirective field="ProductivityRate" headerText="Productivity Rate" width="100"></ColumnDirective>
                    {/* <ColumnDirective field="UnitPerHour" headerText="Unit/Hour" allowEditing={false} width="100"></ColumnDirective> */}
                    <ColumnDirective
                        field="RequiredSkill"
                        // edit={multiSelectList}
                        headerText="Required Manpower"
                        width="200"
                    ></ColumnDirective>
                    <ColumnDirective field="Equipment" headerText="Required Equipment" width="200"></ColumnDirective>
                    <ColumnDirective field="AllocatedWorkers" headerText="Allocated Workers" width="200"></ColumnDirective>
                    {/* <ColumnDirective field="resources" headerText="Resources" width="200"></ColumnDirective> */}
                </ColumnsDirective>
            </GanttComponent>
            <Grid item xs={12}></Grid>
            <Button
                color="secondary"
                variant="contained"
                style={{ marginRight: '10px', marginTop: '20px' }}
                onClick={handleBack}

                // onClick={this.handleEditResourcesClick}
            >
                <IconArrowBack></IconArrowBack>
                Back to projects
            </Button>
        </Box>
    );
};

export default ReportsPage;
