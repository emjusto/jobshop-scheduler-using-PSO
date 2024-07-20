Object.defineProperty(exports, '__esModule', { value: true });
exports.resourceData = [
    {
        TaskID: 1,
        TaskName: 'Column',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 2,
                TaskName: 'Rebar',
                StartDate: new Date('03/29/2019'),
                Duration: 2,
                Progress: 30,
                work: 16
                // resources: [{ resourceId: 1, unit: 70 }, 6]
            },
            {
                TaskID: 3,
                TaskName: 'Formworks',
                StartDate: new Date('03/29/2019'),
                Duration: 4,
                // resources: [2, 3, 5],
                work: 96
            },
            {
                TaskID: 4,
                TaskName: 'Concreting',
                StartDate: new Date('03/29/2019'),
                Duration: 1,
                work: 16,
                // resources: [8, { resourceId: 9, unit: 50 }],
                Progress: 30
            }
        ]
    },
    {
        TaskID: 5,
        TaskName: 'Shearwall',
        StartDate: new Date('03/29/2019'),
        EndDate: new Date('04/21/2019'),
        subtasks: [
            {
                TaskID: 6,
                TaskName: 'Rebar',
                StartDate: new Date('03/29/2019'),
                Duration: 3,
                Progress: 30,
                // resources: [{ resourceId: 4, unit: 50 }],
                work: 30
            },
            {
                TaskID: 7,
                TaskName: 'Formwork',
                StartDate: new Date('04/01/2019'),
                Duration: 3,
                work: 48,
                // resources: [4, 8],
                Predecessor: '6FS'
            },
            {
                TaskID: 8,
                TaskName: 'Concreting',
                StartDate: new Date('04/01/2019'),
                Duration: 2,
                work: 60
                // resources: [12, { resourceId: 5, unit: 70 }]
            },
            {
                TaskID: 9,
                TaskName: 'Curring/Stripping',
                StartDate: new Date('04/01/2019'),
                Duration: 2,
                work: 60
            }
        ]
    },
    {
        TaskID: 10,
        TaskName: 'Beams/Girders',
        StartDate: new Date('04/01/2019'),
        Duration: 1,
        Progress: 30,
        // resources: [12],
        work: 24
    }
];
exports.resourceDetails = [
    { resourceId: 1, resourceName: 'Martin Tamer' },
    { resourceId: 2, resourceName: 'Rose Fuller' },
    { resourceId: 3, resourceName: 'Margaret Buchanan' },
    { resourceId: 4, resourceName: 'Fuller King' },
    { resourceId: 5, resourceName: 'Davolio Fuller' },
    { resourceId: 6, resourceName: 'Van Jack' },
    { resourceId: 7, resourceName: 'Fuller Buchanan' },
    { resourceId: 8, resourceName: 'Jack Davolio' },
    { resourceId: 9, resourceName: 'Tamer Vinet' },
    { resourceId: 10, resourceName: 'Vinet Fuller' },
    { resourceId: 11, resourceName: 'Bergs Anton' },
    { resourceId: 12, resourceName: 'Construction Supervisor' }
];

// exports.SelfRefData = [
//     { TaskId: 1, TaskName: 'Project Initiation', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
//     { TaskId: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, ParentId: 1 },
//     { TaskId: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, ParentId: 1 },
//     {
//         TaskId: 4,
//         TaskName: 'Soil test approval',
//         StartDate: new Date('04/02/2019'),
//         Duration: 4,
//         Progress: 50,
//         ParentId: 1,
//         Predecessor: '1FS'
//     },
//     { TaskId: 5, TaskName: 'Project Estimation', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
//     { TaskId: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5 },
//     { TaskId: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5 },
//     { TaskId: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5 }
// ];

exports.SelfRefData = [
    { TaskID: 1, TaskName: 'Project Initiation', StartDate: new Date('04/02/2019'), ProjectID: 1 },
    {
        TaskID: 2,
        TaskName: 'Identify Site location',
        StartDate: new Date('04/02/2019'),
        Duration: 4,
        Progress: 50,
        ParentId: 1,
        ProjectID: 1,
        resources: [32, 31],
        RequiredSkill: [77, 90]
    },
    { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, ParentId: 1, ProjectID: 1 },
    {
        TaskID: 4,
        TaskName: 'Soil test approval',
        StartDate: new Date('04/02/2019'),
        Duration: 4,
        Progress: 50,
        ParentId: 1,
        ProjectID: 1,
        Predecessor: '1FS'
    },
    { TaskID: 5, TaskName: 'Project Estimation', StartDate: new Date('04/02/2019'), ProjectID: 1 },
    {
        TaskID: 6,
        TaskName: 'Develop floor plan for estimation',
        StartDate: new Date('04/04/2019'),
        Duration: 3,
        Progress: 50,
        ParentId: 5,
        ProjectID: 1
    },
    { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5, ProjectID: 1 },
    { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5, ProjectID: 1 }
];

exports.templateData = [
    {
        TaskID: 242,
        TaskName: 'Site Preparation',
        Duration: 3,
        StartDate: 'Mon Jun 03 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed Jun 05 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 0.5,
        // "Progress": 0,
        // RequiredSkill: [101],
        Workload: 120
        // "Equipment": ["Bulldozer", "Excavator"]
    },
    {
        TaskID: 243,
        TaskName: 'Foundation Laying',
        Duration: 5,
        StartDate: 'Thu Jun 06 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 10 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 1,
        ProductivityRate: 0.6,
        // "Progress": 0,
        // "RequiredSkill": ["Concrete Worker"],
        Workload: 200
        // "Equipment": ["Concrete Mixer"]
    },
    {
        TaskID: 244,
        TaskName: 'Framing',
        Duration: 7,
        StartDate: 'Tue Jun 11 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 17 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 2,
        ProductivityRate: 0.7,
        // "Progress": 0,
        RequiredSkill: ['Carpenter'],
        Workload: 300
        // "Equipment": ["Hammer", "Saw"]
    },
    {
        TaskID: 245,
        TaskName: 'Electrical Installation',
        Duration: 4,
        StartDate: 'Tue Jun 18 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Jun 21 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 3,
        ProductivityRate: 0.8,
        // "Progress": 0,
        // "RequiredSkill": ["Electrician"],
        Workload: 180
        // "Equipment": ["Drill", "Wire Stripper"]
    },
    {
        TaskID: 246,
        TaskName: 'Plumbing Installation',
        Duration: 4,
        StartDate: 'Sat Jun 22 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Jun 25 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 3,
        ProductivityRate: 0.75,
        Progress: 0,
        // "RequiredSkill": ["Plumber"],
        Workload: 150
        // "Equipment": ["Pipe Wrench", "Pipe Cutter"]
    },
    {
        TaskID: 247,
        TaskName: 'Roofing',
        Duration: 5,
        StartDate: 'Wed Jun 26 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jun 30 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 4,
        ProductivityRate: 0.85,
        Progress: 0,
        // "RequiredSkill": ["Roofer"],
        Workload: 220
        // "Equipment": ["Ladder", "Nail Gun"]
    },
    {
        TaskID: 248,
        TaskName: 'Interior Finishing',
        Duration: 7,
        StartDate: 'Mon Jul 01 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jul 07 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 6,
        ProductivityRate: 0.9,
        Progress: 0,
        // "RequiredSkill": ["Painter", "Drywall Installer"],
        Workload: 250
        // "Equipment": ["Paint Roller", "Drywall Saw"]
    },
    {
        TaskID: 249,
        TaskName: 'Final Inspection',
        Duration: 1,
        StartDate: 'Mon Jul 08 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jul 08 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: 7,
        ProductivityRate: 1.0,
        Progress: 0,
        // "RequiredSkill": ["101"],
        Workload: 50
        // "Equipment": ["Checklist"]
    }
];

exports.HouseData = [
    {
        TaskID: 242,
        TaskName: 'Site Preparation',
        Duration: 3,
        StartDate: 'Mon Jun 03 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed Jun 05 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 0.5,
        // "Progress": 0,
        RequiredSkill: ['Carpenter'],
        Workload: 120
        // "Equipment": ["Bulldozer", "Excavator"]
    },
    {
        TaskID: 243,
        TaskName: 'Foundation Laying',
        Duration: 5,
        StartDate: 'Thu Jun 06 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 10 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '1FS',
        ProductivityRate: 0.6,
        // "Progress": 0,
        // "RequiredSkill": ["Concrete Worker"],
        Workload: 200
        // "Equipment": ["Concrete Mixer"]
    },
    {
        TaskID: 244,
        TaskName: 'Framing',
        Duration: 7,
        StartDate: 'Tue Jun 11 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 17 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '2FS',
        ProductivityRate: 0.7,
        // "Progress": 0,
        RequiredSkill: ['Carpenter'],
        Workload: 300
        // "Equipment": ["Hammer", "Saw"]
    },
    {
        TaskID: 245,
        TaskName: 'Electrical Installation',
        Duration: 4,
        StartDate: 'Tue Jun 18 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Jun 21 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.8,
        // "Progress": 0,
        // "RequiredSkill": ["Electrician"],
        Workload: 180
        // "Equipment": ["Drill", "Wire Stripper"]
    },
    {
        TaskID: 246,
        TaskName: 'Plumbing Installation',
        Duration: 4,
        StartDate: 'Sat Jun 22 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Jun 25 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.75,
        Progress: 0,
        // "RequiredSkill": ["Plumber"],
        Workload: 150
        // "Equipment": ["Pipe Wrench", "Pipe Cutter"]
    },
    {
        TaskID: 247,
        TaskName: 'Roofing',
        Duration: 5,
        StartDate: 'Wed Jun 26 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jun 30 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '4FS',
        ProductivityRate: 0.85,
        Progress: 0,
        // "RequiredSkill": ["Roofer"],
        Workload: 220
        // "Equipment": ["Ladder", "Nail Gun"]
    },
    {
        TaskID: 248,
        TaskName: 'Interior Finishing',
        Duration: 7,
        StartDate: 'Mon Jul 01 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jul 07 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '6FS',
        ProductivityRate: 0.9,
        Progress: 0,
        // "RequiredSkill": ["Painter", "Drywall Installer"],
        Workload: 250
        // "Equipment": ["Paint Roller", "Drywall Saw"]
    },
    {
        TaskID: 249,
        TaskName: 'Final Inspection',
        Duration: 1,
        StartDate: 'Mon Jul 08 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jul 08 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '7FS',
        ProductivityRate: 1.0,
        Progress: 0,
        // "RequiredSkill": ["101"],
        Workload: 50,
        Equipment: 'Crane'
    }
];

exports.buildingData = [
    {
        TaskID: 1,
        TaskName: 'Rebar',
        Duration: 6, // Actual number of days
        StartDate: 'Mon Jun 03 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jun 09 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 25,
        RequiredSkill: ['Steelmen'],
        Workload: 54772.5,
        WorkloadUnit: 'kg',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 2,
        TaskName: 'Formwork',
        Duration: 4, // Actual number of days
        StartDate: 'Mon Jun 10 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Jun 13 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '1FS',
        ProductivityRate: 0.3,
        RequiredSkill: ['Carpenter'],
        Workload: 1327.5,
        WorkloadUnit: 'sq. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 3,
        TaskName: 'Concreting',
        Duration: 2, // Actual number of days
        StartDate: 'Fri Jun 14 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sat Jun 15 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '2FS',
        ProductivityRate: 0.37,
        RequiredSkill: ['Mason'],
        Workload: 1177.15,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 4,
        TaskName: 'Curing/Stripping',
        Duration: 1, // Actual number of days
        StartDate: 'Sun Jun 16 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jun 16 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.3,
        RequiredSkill: ['Laborer'],
        Workload: 1323,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 5,
        TaskName: 'PC Slab Installation',
        Duration: 3, // Actual number of days
        StartDate: 'Mon Jun 17 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed Jun 19 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '4FS',
        ProductivityRate: 0.3,
        RequiredSkill: ['Electrician'],
        Workload: 1361,
        WorkloadUnit: 'pcs',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 6,
        TaskName: 'PC Wall Installation',
        Duration: 2, // Actual number of days
        StartDate: 'Thu Jun 20 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Jun 21 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '5FS',
        ProductivityRate: 0.25,
        RequiredSkill: ['Steelmen'],
        Workload: 1947,
        WorkloadUnit: 'kg',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 7,
        TaskName: 'Slab Rebar',
        Duration: 19, // Actual number of days
        StartDate: 'Sat Jun 22 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Jul 11 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '6FS',
        ProductivityRate: 25,
        RequiredSkill: ['Steelmen'],
        Workload: 14028,
        WorkloadUnit: 'kg',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 8,
        TaskName: 'Slab Concreting',
        Duration: 2, // Actual number of days
        StartDate: 'Fri Jul 12 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sat Jul 13 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '7FS',
        ProductivityRate: 0.37,
        RequiredSkill: ['Mason'],
        Workload: 1967,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 9,
        TaskName: 'Scaffolding',
        Duration: 6, // Actual number of days
        StartDate: 'Sun Jul 14 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Jul 19 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '8FS',
        ProductivityRate: 0.4,
        RequiredSkill: ['Helper'],
        Workload: 2364,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    }
];

exports.houseData = [
    {
        TaskID: 1,
        TaskName: 'Site Preparation',
        Duration: 3,
        StartDate: 'Mon Jun 03 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed Jun 05 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 0.5,
        RequiredSkill: ['Laborer'],
        Workload: 11565.24,
        WorkloadUnit: 'kg',
        Equipment: 'Excavator',
        AllocatedWorkers: ''
    },
    {
        TaskID: 2,
        TaskName: 'Foundation Laying',
        Duration: 5,
        StartDate: 'Thu Jun 06 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 10 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '1FS',
        ProductivityRate: 0.3,
        RequiredSkill: ['Concrete Worker'],
        Workload: 704.8,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Concrete Mixer',
        AllocatedWorkers: ''
    },
    {
        TaskID: 3,
        TaskName: 'Framing',
        Duration: 7,
        StartDate: 'Tue Jun 11 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jun 17 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '2FS',
        ProductivityRate: 0.37,
        RequiredSkill: ['Carpenter'],
        Workload: 155.88,
        WorkloadUnit: 'sq. m.',
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 4,
        TaskName: 'Electrical Installation',
        Duration: 4,
        StartDate: 'Tue Jun 18 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Jun 21 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.8,
        RequiredSkill: ['Electrician'],
        Workload: 328,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 5,
        TaskName: 'Plumbing Installation',
        Duration: 4,
        StartDate: 'Sat Jun 22 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Jun 25 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.75,
        RequiredSkill: ['Plumber'],
        Workload: 16397.0,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 6,
        TaskName: 'Roofing',
        Duration: 5,
        StartDate: 'Wed Jun 26 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jun 30 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '4FS',
        ProductivityRate: 0.85,
        RequiredSkill: ['Roofer'],
        Workload: 345.15,
        WorkloadUnit: 'sq. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 7,
        TaskName: 'Interior Finishing',
        Duration: 7,
        StartDate: 'Mon Jul 01 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Jul 07 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '6FS',
        ProductivityRate: 0.9,
        RequiredSkill: ['Painter'],
        Workload: 93.02,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 8,
        TaskName: 'Final Inspection',
        Duration: 1,
        StartDate: 'Mon Jul 08 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Jul 08 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '7FS',
        ProductivityRate: 1.0,
        RequiredSkill: ['Inspector'],
        Workload: 155,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    }
];

exports.roadData = [
    {
        TaskID: 1,
        TaskName: 'Site Clearing',
        Duration: 6,
        StartDate: 'Tue Jun 04 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Jun 11 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 0.5,
        RequiredSkill: ['Laborer'],
        Workload: 110565.24,
        WorkloadUnit: 'kg',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 2,
        TaskName: 'Excavation',
        Duration: 8,
        StartDate: 'Wed Jun 12 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Jun 20 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: null,
        ProductivityRate: 0.3,
        RequiredSkill: ['Laborer'],
        Workload: 704.8,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Excavator',
        AllocatedWorkers: ''
    },
    {
        TaskID: 3,
        TaskName: 'Subgrade Preparation',
        Duration: 6,
        StartDate: 'Fri Jun 21 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Jun 27 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '2FS',
        ProductivityRate: 0.37,
        RequiredSkill: ['Laborer'],
        Workload: 155.88,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 4,
        TaskName: 'Base Course Laying',
        Duration: 6,
        StartDate: 'Fri Jun 28 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed July 03 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 0.8,
        RequiredSkill: ['Mason'],
        Workload: 28,
        WorkloadUnit: 'sq. m.',
        Equipment: 'Concrete Mixer',
        AllocatedWorkers: ''
    },
    {
        TaskID: 5,
        TaskName: 'Asphalt Paving',
        Duration: 13,
        StartDate: 'Thu July 04 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed July17 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '3FS',
        ProductivityRate: 10,
        RequiredSkill: ['Paver', 'Laborer'],
        Workload: 36397.0,
        WorkloadUnit: 'cu. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 6,
        TaskName: 'Drainage Installation',
        Duration: 6,
        StartDate: 'Thu July 18 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Wed July 24 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '4FS',
        ProductivityRate: 0.85,
        RequiredSkill: ['Laborer'],
        Workload: 345.15,
        Equipment: 'Excavator',
        AllocatedWorkers: ''
    },
    {
        TaskID: 7,
        TaskName: 'Curb Installation',
        Duration: 26,
        StartDate: 'Thu Jul 25 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Aug 20 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '6FS',
        ProductivityRate: 0.9,
        RequiredSkill: ['Mason', 'Laborer'],
        Workload: 93.02,
        Equipment: 'Concrete Mixer',
        AllocatedWorkers: ''
    },
    {
        TaskID: 8,
        TaskName: 'Pavement Markings',
        Duration: 5,
        StartDate: 'Fri Aug 20 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Mon Aug 26 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '6FS',
        ProductivityRate: 0.9,
        RequiredSkill: ['Painter', 'Laborer'],
        Workload: 93.02,
        WorkloadUnit: 'sq. m.',
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 9,
        TaskName: 'Final Inspection',
        Duration: 1,
        StartDate: 'Fri Aug 27 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Aug 27 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: null,
        Predecessor: '7FS',
        ProductivityRate: 1.0,
        RequiredSkill: ['Inspector'],
        Workload: 135.2,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    }
];

// exports.mgData = [
//     {
//         TaskID: 1,
//         TaskName: 'Rebar',
//         Duration: 3,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '',
//         ProductivityRate: 0.5,
//         RequiredSkill: ['Steelmen'],
//         Workload: 11565.24,
//         Equipment: 'Crane',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 2,
//         TaskName: 'Formwork',
//         Duration: 5,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '1FS',
//         ProductivityRate: 0.3,
//         RequiredSkill: ['Carpenter'],
//         Workload: 704.8,
//         Equipment: 'Excavator',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 3,
//         TaskName: 'Concreting',
//         Duration: 7,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '2FS',
//         ProductivityRate: 0.37,
//         RequiredSkill: ['Mason'],
//         Workload: 155.88,
//         Equipment: '',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 4,
//         TaskName: 'Curing/Stripping',
//         Duration: 4,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '3FS',
//         ProductivityRate: 0.8,
//         RequiredSkill: ['Helper'],
//         Workload: 28,
//         Equipment: '',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 5,
//         TaskName: 'PC Slab Installation',
//         Duration: 4,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '3FS',
//         ProductivityRate: 0.75,
//         RequiredSkill: ['Electrician'],
//         Workload: 36397.0,
//         Equipment: '',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 6,
//         TaskName: 'PC Wall Installation',
//         Duration: 5,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '4FS',
//         ProductivityRate: 0.85,
//         RequiredSkill: ['Carpenter'],
//         Workload: 345.15,
//         Equipment: '',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 7,
//         TaskName: 'Slab Rebar',
//         Duration: 7,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '6FS',
//         ProductivityRate: 0.9,
//         RequiredSkill: ['Steelmen'],
//         Workload: 93.02,
//         Equipment: '',
//         AllocatedWorkers: ''
//     },
//     {
//         TaskID: 8,
//         TaskName: 'Slab Concreting',
//         Duration: 1,
//         StartDate: '',
//         EndDate: '',
//         ParentId: '',
//         Predecessor: '7FS',
//         ProductivityRate: 1.0,
//         RequiredSkill: ['Mason'],
//         Workload: 5,
//         Equipment: '',
//         AllocatedWorkers: ''
//     }
// ];
exports.mgData = [
    {
        TaskID: 1,
        TaskName: 'Rebar',
        Duration: 3,
        StartDate: 'Fri Aug 01 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sun Aug 03 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '',
        ProductivityRate: 0.5,
        RequiredSkill: ['Steelmen'],
        Workload: 11565.24,
        Equipment: 'Crane',
        AllocatedWorkers: ''
    },
    {
        TaskID: 2,
        TaskName: 'Formwork',
        Duration: 5,
        StartDate: 'Mon Aug 04 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Aug 08 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '1FS',
        ProductivityRate: 0.3,
        RequiredSkill: ['Carpenter'],
        Workload: 704.8,
        Equipment: 'Excavator',
        AllocatedWorkers: ''
    },
    {
        TaskID: 3,
        TaskName: 'Concreting',
        Duration: 7,
        StartDate: 'Sat Aug 09 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Aug 15 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '2FS',
        ProductivityRate: 0.37,
        RequiredSkill: ['Mason'],
        Workload: 155.88,
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 4,
        TaskName: 'Curing/Stripping',
        Duration: 4,
        StartDate: 'Sat Aug 16 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Tue Aug 19 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '3FS',
        ProductivityRate: 0.8,
        RequiredSkill: ['Helper'],
        Workload: 28,
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 5,
        TaskName: 'PC Slab Installation',
        Duration: 4,
        StartDate: 'Wed Aug 20 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Sat Aug 23 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '3FS',
        ProductivityRate: 0.75,
        RequiredSkill: ['Electrician'],
        Workload: 36397.0,
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 6,
        TaskName: 'PC Wall Installation',
        Duration: 5,
        StartDate: 'Sun Aug 24 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Aug 28 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '4FS',
        ProductivityRate: 0.85,
        RequiredSkill: ['Carpenter'],
        Workload: 345.15,
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 7,
        TaskName: 'Slab Rebar',
        Duration: 7,
        StartDate: 'Fri Aug 29 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Thu Sep 04 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '6FS',
        ProductivityRate: 0.9,
        RequiredSkill: ['Steelmen'],
        Workload: 93.02,
        Equipment: '',
        AllocatedWorkers: ''
    },
    {
        TaskID: 8,
        TaskName: 'Slab Concreting',
        Duration: 1,
        StartDate: 'Fri Sep 05 2024 08:00:00 GMT+0800 (Philippine Standard Time)',
        EndDate: 'Fri Sep 05 2024 17:00:00 GMT+0800 (Philippine Standard Time)',
        ParentId: '',
        Predecessor: '7FS',
        ProductivityRate: 1.0,
        RequiredSkill: ['Mason'],
        Workload: 5,
        Equipment: '',
        AllocatedWorkers: ''
    }
];
