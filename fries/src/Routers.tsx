import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, RouteProps, Redirect} from 'react-router-dom'
import Cookie from 'js-cookie';
// Routes 
import Login from './Pages/Auth/login';
import Home from './Pages/Home/home';
import Cookies from 'js-cookie';
import Profile from './Pages/Profile/profile';


function Routers() {
    return(
        <Router>
            <Switch>
                <Route path='/login' exact component={Login} /> 
                <ProtectedRoute path='/home' exact component={Home} />
                <ProtectedRoute path='/u/:username' component={Profile} />
            </Switch>
        </Router>
    )
}

interface Props extends RouteProps {
    component : React.ComponentType;
}

const ProtectedRoute = ({component : Component, ...rest} : Props) => {
    return(
        <Route
            {...rest}
            render={props => 
                Cookies.get().verified === '1' ? (<Component />)
                    : (<Redirect to='/login'/>)
            }
        / >
    )
}

export default Routers;