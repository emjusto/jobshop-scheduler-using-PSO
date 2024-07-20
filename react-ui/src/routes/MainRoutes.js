import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch, useLocation } from 'react-router-dom';

// project imports
import MainLayout from './../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import AuthGuard from './../utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('../views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('../views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('../views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('../views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('../views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('../views/sample-page')));

//PSO Pages
const ProjectsList = Loadable(lazy(() => import('../views/pso-pages/projects-list')));
const NewProject = Loadable(lazy(() => import('../views/pso-pages/new-project')));
const EditProject = Loadable(lazy(() => import('../views/pso-pages/project')));
const EmployeeList = Loadable(lazy(() => import('../views/pso-pages/employee-list')));
const NewEmployee = Loadable(lazy(() => import('../views/pso-pages/new-employee')));
const EquipmentList = Loadable(lazy(() => import('../views/pso-pages/equipment-list')));
const NewEquipment = Loadable(lazy(() => import('../views/pso-pages/new-equipment')));
const NewSkill = Loadable(lazy(() => import('../views/pso-pages/new-skill')));
const SkillList = Loadable(lazy(() => import('../views/pso-pages/skill-list')));
const SkillPage = Loadable(lazy(() => import('../views/pso-pages/skillPage')));
const ReportsPage = Loadable(lazy(() => import('../views/pso-pages/reports')));

//-----------------------|| MAIN ROUTING ||-----------------------//

const MainRoutes = () => {
    const location = useLocation();

    return (
        <Route
            path={[
                '/dashboard/default',

                '/utils/util-typography',
                '/utils/util-color',
                '/utils/util-shadow',
                '/icons/tabler-icons',
                '/icons/material-icons',

                '/sample-page',
                '/pso-pages/projects-list',
                '/pso-pages/new-project',
                '/pso-pages/project/:projectId',
                '/pso-pages/employee-list',
                '/pso-pages/new-employee',
                '/pso-pages/equipment-list',
                '/pso-pages/new-equipment',
                '/pso-pages/skill-list',
                '/pso-pages/new-skill',
                '/pso-pages/skillPage',
                '/pso-pages/reports/:projectId'
            ]}
        >
            <MainLayout>
                <Switch location={location} key={location.pathname}>
                    <AuthGuard>
                        <Route path="/dashboard/default" component={DashboardDefault} />

                        <Route path="/utils/util-typography" component={UtilsTypography} />
                        <Route path="/utils/util-color" component={UtilsColor} />
                        <Route path="/utils/util-shadow" component={UtilsShadow} />
                        <Route path="/icons/tabler-icons" component={UtilsTablerIcons} />
                        <Route path="/icons/material-icons" component={UtilsMaterialIcons} />

                        <Route path="/sample-page" component={SamplePage} />
                        <Route path="/pso-pages/projects-list" component={ProjectsList} />
                        <Route path="/pso-pages/new-project" component={NewProject} />
                        <Route path="/pso-pages/project/:projectId" component={EditProject} />
                        <Route path="/pso-pages/employee-list" component={EmployeeList} />
                        <Route path="/pso-pages/new-employee" component={NewEmployee} />
                        <Route path="/pso-pages/equipment-list" component={EquipmentList} />
                        <Route path="/pso-pages/new-equipment" component={NewEquipment} />
                        <Route path="/pso-pages/skill-list" component={SkillList} />
                        <Route path="/pso-pages/new-skill" component={NewSkill} />
                        <Route path="/pso-pages/skillPage" component={SkillPage} />
                        <Route path="/pso-pages/reports/:projectId" component={ReportsPage} />
                    </AuthGuard>
                </Switch>
            </MainLayout>
        </Route>
    );
};

export default MainRoutes;
