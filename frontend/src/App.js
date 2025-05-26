import React from 'react';

import { RouterProvider } from 'react-router-dom';

import browserRouter from './browser-router.js';
import { ContextProvider } from './conetext/Context.js';

const App = () => {
return (
    <ContextProvider>
       <RouterProvider router={browserRouter} /> 
    </ContextProvider>
);};

export default App;
