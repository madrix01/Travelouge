import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, RouteProps, Redirect} from 'react-router-dom'
// Routes 
import Login from './Pages/Auth/login';
import Home from './Pages/Home/home';
import Cookies from 'js-cookie';
import Profile from './Pages/Profile/profile';
import Register from './Pages/Auth/register';
import NewPost from './Pages/Post/post';
import mc from './Pages/Test/test'
import PostInfo from './Pages/Post/postInfo'

const SlashRoute = () => {
    return Cookies.get().verified === '1' ?  (<Redirect to="/home" />) : (<Redirect to="/login" />)
    // return (<Redirect to="/"/>)
}

function Routers() {
    return(
        <Router>
            <Switch>
                <Route path="/" exact component={SlashRoute}/>
                <Route path='/login' exact component={Login} /> 
                <ProtectedRoute path='/home' exact component={Home} />
                <Route path='/u/:username' component={Profile} />
                <Route path='/register' component={Register} />
                <Route path='/post/add' component={NewPost} />
                <Route path='/test' component={mc} />
                <Route path='/p/:username/:posttitle' component={PostInfo} />
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
        />
    )
}


export default Routers;