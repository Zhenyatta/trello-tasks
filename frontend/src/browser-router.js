import { createBrowserRouter } from "react-router-dom";

import TextField from '@mui/material/TextField';

const browserRouter = createBrowserRouter([
    {
        path: "/documents/new",
        element: <div>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </div>,
    },
]);

export default browserRouter;
