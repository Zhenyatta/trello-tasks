import { createBrowserRouter } from 'react-router-dom';
import SendForm from './SendForm.js';

const browserRouter = createBrowserRouter([
    {
        path: '/documents/new',
        element: <SendForm />,
    },
]);

export default browserRouter;
