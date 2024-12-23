import { createBrowserRouter } from 'react-router-dom';
import SendForm from './pages/SendForm.js';
import Start from './pages/Start.js';
import Registration from './pages/Registeration.js';
import Login from './pages/Login.js';
import Account from './pages/Account.js';

const browserRouter = createBrowserRouter([
    {
        path: '/',
        element: <Start />,
    },
    {
        path: '/dashboard',
        element: <Start />,
    },
    {
        path: '/register',
        element: <Registration />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/account',
        element: <Account />,
    },
]);

export default browserRouter;
