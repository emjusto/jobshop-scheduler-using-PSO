// assets
import {
    IconBrandFramer,
    IconTypography,
    IconPalette,
    IconShadow,
    IconUsers,
    IconClipboard,
    IconWindmill,
    IconTools,
    IconLayoutGridAdd
} from '@tabler/icons';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconClipboard: IconClipboard,
    IconUsers: IconUsers,
    IconWindmill: IconWindmill,
    IconTools: IconTools,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd
};

//-----------------------|| PSO PAGES MENU ITEMS ||-----------------------//

export const psoPages = {
    id: 'pso-pages',
    title: 'Management',
    type: 'group',
    children: [
        {
            id: 'projects',
            title: 'Projects',
            type: 'item',
            icon: icons['IconClipboard'],
            url: '/pso-pages/projects-list',
            breadcrumbs: false
            // children: [
            //     {
            //         id: 'projects-list',
            //         title: 'Projects List',
            //         type: 'item',
            //         url: '/pso-pages/projects-list',
            //         breadcrumbs: false
            //     },
            //     {
            //         id: 'new-project',
            //         title: 'Add New Project',
            //         type: 'item',
            //         url: '/pso-pages/new-project',
            //         breadcrumbs: false
            //     }
            // ]
        },
        {
            id: 'skill',
            title: 'Manpower',
            type: 'item',
            icon: icons['IconTools'],
            url: '/pso-pages/skill-list',
            breadcrumbs: false
        },
        // {
        //     id: 'employees',
        //     title: 'Manpower',
        //     type: 'item',
        //     icon: icons['IconUsers'],
        //     url: '/pso-pages/employee-list',
        //     breadcrumbs: false
        //     // children: [
        //     //     {
        //     //         id: 'employee-list',
        //     //         title: 'Employee List',
        //     //         type: 'item',
        //     //         url: '/pso-pages/employee-list',
        //     //         breadcrumbs: false
        //     //     },
        //     //     {
        //     //         id: 'new-employee',
        //     //         title: 'Add New Employee',
        //     //         type: 'item',
        //     //         url: '/pso-pages/new-employee',
        //     //         breadcrumbs: false
        //     //     }
        //     // ]
        // },
        {
            id: 'equipment',
            title: 'Equipment',
            type: 'item',
            icon: icons['IconWindmill'],
            url: '/pso-pages/equipment-list',
            breadcrumbs: false
            // children: [
            //     {
            //         id: 'equipment-list',
            //         title: 'Equipment List',
            //         type: 'item',
            //         url: '/pso-pages/equipment-list',
            //         breadcrumbs: false
            //     },
            //     {
            //         id: 'new-equipment',
            //         title: 'Add New Equipment',
            //         type: 'item',
            //         url: '/pso-pages/new-equipment',
            //         breadcrumbs: false
            //     }
            // ]
        }
    ]
};
