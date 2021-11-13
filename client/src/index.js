import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import Wave from './routes/wave';
import Login from './routes/login';

const rootElement = document.getElementById('root');
ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/wave" element={<Wave />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>,
    rootElement,
);
