// assets
import { IconBrandFramer, IconTypography, IconPalette, IconShadow, IconUsers, IconClipboard, IconWindmill, IconLayoutGridAdd } from '@tabler/icons';

// constant
const icons = {
    IconTypography: IconTypography,
    IconPalette: IconPalette,
    IconShadow: IconShadow,
    IconClipboard: IconClipboard,
    IconUsers: IconUsers,
    IconWindmill: IconWindmill,
    IconBrandFramer: IconBrandFramer,
    IconLayoutGridAdd: IconLayoutGridAdd
};

//-----------------------|| UTILITIES MENU ITEMS ||-----------------------//

export const utilities = {
    id: 'utilities',
    title: 'Management',
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: 'Typography',
            type: 'item',
            url: '/utils/util-typography',
            icon: icons['IconTypography'],
            breadcrumbs: false
        },
        {
            id: 'util-color',
            title: 'Projects (Color)',
            type: 'item',
            url: '/utils/util-color',
            icon: icons['IconClipboard'],
            breadcrumbs: false
        },
        {
            id: 'util-shadow',
            title: 'Employees (Shadow)',
            type: 'item',
            url: '/utils/util-shadow',
            icon: icons['IconUsers'],
            breadcrumbs: false
        },
        {
            id: 'icons',
            title: 'Equipment (Icons)',
            type: 'collapse',
            icon: icons['IconWindmill'],
            children: [
                {
                    id: 'tabler-icons',
                    title: 'Tabler Icons',
                    type: 'item',
                    url: '/icons/tabler-icons',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Material Icons',
                    type: 'item',
                    url: '/icons/material-icons',
                    breadcrumbs: false
                }
            ]
        }
        // {
        //     id: 'equipment',
        //     title: 'Equipment',
        //     type: 'collapse',
        //     icon: icons['IconWindmill'],
        //     children: [
        //         {
        //             id: 'tabler-equip',
        //             title: 'Tabler Equip',
        //             type: 'item',
        //             url: '/icons/tabler-equip',
        //             breadcrumbs: false
        //         },
        //         {
        //             id: 'material-icons2',
        //             title: 'Material Icons2',
        //             type: 'item',
        //             url: '/icons/material-icons2',
        //             breadcrumbs: false
        //         }
        //     ]
        // }

    ]
};
