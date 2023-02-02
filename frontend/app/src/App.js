import React from "react";

import TextField from '@mui/material/TextField';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Input = createBrowserRouter([
  {
    path: "/documents/new",
    element: <div>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>,
  },
]);

function App() {
  return (
    <RouterProvider router={Input} />
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 2b78ac7c0bb786e3f6061abf814264e7f68bb371
