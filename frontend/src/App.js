import React from "react";

import { RouterProvider } from "react-router-dom";

import browserRouter from "./browser-router.js";

const App = () => {
  return (
    <RouterProvider router={browserRouter} />
  );
}

export default App;

