import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Root from './Root';
import * as layoutConstants from '../constants/layout';

// All layouts/containers
import DefaultLayout from '../layouts/Default';
import DetachedLayout from '../layouts/Detached';
// import AnalysisCategory from '../pages/dashboard/Admin/Settings/AnalysisCategory';

// lazy load all the views

// auth
const Login = React.lazy(() => import('../pages/account/Login'));
const Logout = React.lazy(() => import('../pages/account/Logout'));
const Register = React.lazy(() => import('../pages/account/Register'));
const Confirm = React.lazy(() => import('../pages/account/Confirm'));
const ForgetPassword = React.lazy(() => import('../pages/account/ForgetPassword'));
const LockScreen = React.lazy(() => import('../pages/account/LockScreen'));

// dashboard
const AnalyticsDashboard = React.lazy(() => import('../pages/dashboard/Analytics'));
const EcommerceDashboard = React.lazy(() => import('../pages/dashboard/Ecommerce'));
const ProjectDashboard = React.lazy(() => import('../pages/dashboard/Project'));
const EWalletDashboard = React.lazy(() => import('../pages/dashboard/E-Wallet'));

const AdminDashboard = React.lazy(() => import('../pages/dashboard/Admin'));

// apps
const CalendarApp = React.lazy(() => import('../pages/apps/Calendar'));
const Projects = React.lazy(() => import('../pages/apps/Projects'));
const ProjectDetail = React.lazy(() => import('../pages/apps/Projects/Detail'));
const ProjectGannt = React.lazy(() => import('../pages/apps/Projects/Gantt'));
const ProjectForm = React.lazy(() => import('../pages/apps/Projects/ProjectForm'));

// - chat
const ChatApp = React.lazy(() => import('../pages/apps/Chat'));

// -crm
const CRMDashboard = React.lazy(() => import('../pages/apps/CRM/Dashboard'));
const CRMProjects = React.lazy(() => import('../pages/apps/CRM/Projects'));
const CRMManagement = React.lazy(() => import('../pages/apps/CRM/Management'));
const CRMClients = React.lazy(() => import('../pages/apps/CRM/Clients'));
const CRMOrderList = React.lazy(() => import('../pages/apps/CRM/OrderList'));

// - ecommece pages
const EcommerceProducts = React.lazy(() => import('../pages/apps/Ecommerce/Products'));
const ProductDetails = React.lazy(() => import('../pages/apps/Ecommerce/ProductDetails'));
const Orders = React.lazy(() => import('../pages/apps/Ecommerce/Orders'));
const OrderDetails = React.lazy(() => import('../pages/apps/Ecommerce/OrderDetails'));
const Customers = React.lazy(() => import('../pages/apps/Ecommerce/Customers'));
const Cart = React.lazy(() => import('../pages/apps/Ecommerce/Cart'));
const Checkout = React.lazy(() => import('../pages/apps/Ecommerce/Checkout'));
const Sellers = React.lazy(() => import('../pages/apps/Ecommerce/Sellers'));

// - email
const Inbox = React.lazy(() => import('../pages/apps/Email/Inbox'));
const EmailDetail = React.lazy(() => import('../pages/apps/Email/Detail'));

// - social
const SocialFeed = React.lazy(() => import('../pages/apps/SocialFeed'));

// - tasks
const TaskList = React.lazy(() => import('../pages/apps/Tasks/List'));
const TaskDetails = React.lazy(() => import('../pages/apps/Tasks/Details'));
const Kanban = React.lazy(() => import('../pages/apps/Tasks/Board'));
// - file
const FileManager = React.lazy(() => import('../pages/apps/FileManager'));

// pages
const Profile = React.lazy(() => import('../pages/profile'));
const Profile2 = React.lazy(() => import('../pages/profile2'));
const ErrorPageNotFound = React.lazy(() => import('../pages/error/PageNotFound'));
const ErrorPageNotFoundAlt = React.lazy(() => import('../pages/error/PageNotFoundAlt'));
const ServerError = React.lazy(() => import('../pages/error/ServerError'));

// - other
const Invoice = React.lazy(() => import('../pages/other/Invoice'));
const FAQ = React.lazy(() => import('../pages/other/FAQ'));
const Pricing = React.lazy(() => import('../pages/other/Pricing'));
const Maintenance = React.lazy(() => import('../pages/other/Maintenance'));
const Starter = React.lazy(() => import('../pages/other/Starter'));
const PreLoader = React.lazy(() => import('../pages/other/PreLoader'));
const Timeline = React.lazy(() => import('../pages/other/Timeline'));

const Landing = React.lazy(() => import('../pages/landing'));

// uikit
const Accordions = React.lazy(() => import('../pages/uikit/Accordions'));
const Alerts = React.lazy(() => import('../pages/uikit/Alerts'));
const Avatars = React.lazy(() => import('../pages/uikit/Avatars'));
const Badges = React.lazy(() => import('../pages/uikit/Badges'));
const Breadcrumbs = React.lazy(() => import('../pages/uikit/Breadcrumb'));
const Buttons = React.lazy(() => import('../pages/uikit/Buttons'));
const Cards = React.lazy(() => import('../pages/uikit/Cards'));
const Carousels = React.lazy(() => import('../pages/uikit/Carousel'));
const Dropdowns = React.lazy(() => import('../pages/uikit/Dropdowns'));
const EmbedVideo = React.lazy(() => import('../pages/uikit/EmbedVideo'));
const Grid = React.lazy(() => import('../pages/uikit/Grid'));
const ListGroups = React.lazy(() => import('../pages/uikit/ListGroups'));
const Modals = React.lazy(() => import('../pages/uikit/Modals'));
const Notifications = React.lazy(() => import('../pages/uikit/Notifications'));
const Offcanvases = React.lazy(() => import('../pages/uikit/Offcanvas'));
const Paginations = React.lazy(() => import('../pages/uikit/Paginations'));
const Popovers = React.lazy(() => import('../pages/uikit/Popovers'));
const Progress = React.lazy(() => import('../pages/uikit/Progress'));
const Ribbons = React.lazy(() => import('../pages/uikit/Ribbons'));
const Spinners = React.lazy(() => import('../pages/uikit/Spinners'));
const Tabs = React.lazy(() => import('../pages/uikit/Tabs'));
const Tooltips = React.lazy(() => import('../pages/uikit/Tooltips'));
const Typography = React.lazy(() => import('../pages/uikit/Typography'));
const DragDrop = React.lazy(() => import('../pages/uikit/DragDrop'));
const RangeSliders = React.lazy(() => import('../pages/uikit/RangeSliders'));
const Ratings = React.lazy(() => import('../pages/uikit/Ratings'));

// icons
const Dripicons = React.lazy(() => import('../pages/icons/Dripicons'));
const MDIIcons = React.lazy(() => import('../pages/icons/MDIIcons'));
const Unicons = React.lazy(() => import('../pages/icons/Unicons'));

// forms
const BasicForms = React.lazy(() => import('../pages/forms/Basic'));
const FormAdvanced = React.lazy(() => import('../pages/forms/Advanced'));
const FormValidation = React.lazy(() => import('../pages/forms/Validation'));
const FormWizard = React.lazy(() => import('../pages/forms/Wizard'));
const FileUpload = React.lazy(() => import('../pages/forms/FileUpload'));
const Editors = React.lazy(() => import('../pages/forms/Editors'));

// charts
const ApexChart = React.lazy(() => import('../pages/charts/Apex'));
const BriteChart = React.lazy(() => import('../pages/charts/Brite'));
const ChartJs = React.lazy(() => import('../pages/charts/ChartJs'));

// tables
const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

// widgets
const Widgets = React.lazy(() => import('../pages/uikit/Widgets'));

// maps
const GoogleMaps = React.lazy(() => import('../pages/maps/GoogleMaps'));
const VectorMaps = React.lazy(() => import('../pages/maps/VectorMaps'));

const LabContact = React.lazy(() => import('../pages/dashboard/Admin/Settings/LabContact/LabContact'));
const LabDepartments = React.lazy(() => import('../pages/dashboard/Admin/Settings/LabDepartment/LabDepartments'));
const Sample = React.lazy(() => import('../pages/dashboard/Admin/Settings/Sample/Sample'));
const Enquiry = React.lazy(() => import('../pages/dashboard/Admin/Settings/Enquiry'));
const AddEnquiry = React.lazy(() => import('../pages/dashboard/Admin/Settings/Enquiry/Add'));
const Order = React.lazy(() => import('../pages/dashboard/Admin/Settings/Order'));
const AddOrder = React.lazy(() => import('../pages/dashboard/Admin/Settings/Order/Add'));
const User = React.lazy(() => import('../pages/dashboard/Admin/Settings/User'));
const AddUser = React.lazy(() => import('../pages/dashboard/Admin/Settings/User/Add'));
const AnalysisCategory = React.lazy(() => import('../pages/dashboard/Admin/Settings/AnalysisCategory'));
const AnalysisService = React.lazy(() => import('../pages/dashboard/Admin/Settings/AnalysisService'));
const Clients = React.lazy(() => import('../pages/dashboard/Admin/Settings/Clients'));
const AddAnalysisCategory = React.lazy(() => import('../pages/dashboard/Admin/Settings/AnalysisCategory/Add'));
const AddAnalysisService = React.lazy(() => import('../pages/dashboard/Admin/Settings/AnalysisService/Add'));
const AddClients = React.lazy(() => import('../pages/dashboard/Admin/Settings/Clients/Add'));

const loading = () => <div className=""></div>;

const LoadComponent = ({ component: Component }) => (
    <Suspense fallback={loading()}>
        <Component />
    </Suspense>
);

const AllRoutes = () => {
    const { auth } = useSelector((state) => ({
        auth: state.Auth,
    }));

    console.log(auth, 'auth 123');
    let authCred = '';
    authCred = auth && auth.user && auth.user.role;

    const getLayout = () => {
        let layoutCls = DetachedLayout;
        return layoutCls;
    };
    let Layout = getLayout();

    return useRoutes([
        { path: '/', element: <Root /> },
        {
            // public routes
            path: '/',
            element: <DefaultLayout />,
            children: [
                {
                    path: 'account',
                    children: [
                        { path: 'login', element: <LoadComponent component={Login} /> },
                        { path: 'register', element: <LoadComponent component={Register} /> },
                        { path: 'confirm', element: <LoadComponent component={Confirm} /> },
                        { path: 'forget-password', element: <LoadComponent component={ForgetPassword} /> },
                        { path: 'lock-screen', element: <LoadComponent component={LockScreen} /> },
                        { path: 'logout', element: <LoadComponent component={Logout} /> },
                    ],
                },
                {
                    path: 'error-404',
                    element: <LoadComponent component={ErrorPageNotFound} />,
                },
                {
                    path: 'error-500',
                    element: <LoadComponent component={ServerError} />,
                },
                {
                    path: 'maintenance',
                    element: <LoadComponent component={Maintenance} />,
                },
                {
                    path: 'landing',
                    element: <LoadComponent component={Landing} />,
                },
            ],
        },
        {
            // auth protected routes
            path: '/',
            element: <PrivateRoute roles={auth && auth.user && auth.user.role} component={Layout} />,
            children: [
                {
                    path: 'lims',
                    children: [
                        {
                            path: 'dashboard',
                            element:
                                authCred == 'Admin' ? (
                                    <LoadComponent component={AdminDashboard} />
                                ) : authCred == 'Customer' ? (
                                    <LoadComponent component={EcommerceDashboard} />
                                ) : (
                                    ''
                                ),
                        },
                        // {
                        //     path: 'analytics',
                        //     element: <LoadComponent component={AnalyticsDashboard} />,
                        // },
                        // {
                        //     path: 'ecommerce',
                        //     element: <LoadComponent component={EcommerceDashboard} />,
                        // },
                        // {
                        //     path: 'project',
                        //     element: <LoadComponent component={ProjectDashboard} />,
                        // },
                        // {
                        //     path: 'e-wallet',
                        //     element: <LoadComponent component={EWalletDashboard} />,
                        // },
                        // {
                        //     path: 'calendar',
                        //     element: <LoadComponent component={CalendarApp} />,
                        // },
                    ],
                },
                {
                    path: 'apps',
                    children: [
                        {
                            path: 'settings',
                            children: [
                                {
                                    path: 'labcontact',
                                    element: <LoadComponent component={LabContact} />,
                                },
                                {
                                    path: 'labdepartments',
                                    element: <LoadComponent component={LabDepartments} />,
                                },
                                {
                                    path: 'analysisCategory',
                                    element: <LoadComponent component={AnalysisCategory} />,
                                },
                                {
                                    path: 'addAnalysisCategory',
                                    element: <LoadComponent component={AddAnalysisCategory} />,
                                },
                                {
                                    path: 'analysisService',
                                    element: <LoadComponent component={AnalysisService} />,
                                },
                                {
                                    path: 'addAnalysisService',
                                    element: <LoadComponent component={AddAnalysisService} />,
                                },
                                {
                                    path: 'clients',
                                    element: <LoadComponent component={Clients} />,
                                },
                                {
                                    path: 'addClients',
                                    element: <LoadComponent component={AddClients} />,
                                },
                                {
                                    path: 'Sample',
                                    element: <LoadComponent component={Sample} />,
                                },
                                {
                                    path: 'enquiry',
                                    element: <LoadComponent component={Enquiry} />,
                                },
                                {
                                    path: 'addEnquiry',
                                    element: <LoadComponent component={AddEnquiry} />,
                                },
                                {
                                    path: 'orders',
                                    element: <LoadComponent component={Order} />,
                                },
                                {
                                    path: 'addOrders',
                                    element: <LoadComponent component={AddOrder} />,
                                },
                                {
                                    path: 'users',
                                    element: <LoadComponent component={User} />,
                                },
                                {
                                    path: 'addUsers',
                                    element: <LoadComponent component={AddUser} />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ]);
};

export { AllRoutes };
