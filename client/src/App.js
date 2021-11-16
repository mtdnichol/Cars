import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Alert from './components/layout/Alert'
import Register from './components/auth/Register'
import Login from './components/auth/Login'


import './App.css';
import setAuthToken from "./utils/setAuthToken";



const App = () => {
    useEffect(() => { // Empty brackets make useEffect only run once, brackets prevent from infinite loop
        if (localStorage.token)
            setAuthToken(localStorage.token)

        store.dispatch(loadUser())
    }, [])

    return (
    <Provider store={store}>
        <Router>
            <Fragment>
                <Navbar />
                <Alert />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Fragment>
        </Router>
    </Provider>
)}



export default App;
