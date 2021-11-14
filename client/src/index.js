import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import './index.css';

import Wave from './routes/wave';
import Login from './routes/login';

const rootElement = document.getElementById('root');
const renderApp = () =>
    ReactDOM.render(
        <Provider store={store()}>
            <BrowserRouter>
                <Routes>
                    <Route path="/wave" element={<Wave />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </Provider>,
        rootElement,
    );

renderApp();
