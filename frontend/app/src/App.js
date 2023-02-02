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

export default App;