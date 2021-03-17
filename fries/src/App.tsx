import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppBarStyled from './Components/AppBarStyled'
import Login from './Pages/Auth/login';
import Cookies from 'js-cookie';
import Routers from './Routers';
import Home from './Pages/Home/home';

function App() {
  return (
      <div className="App">
        <AppBarStyled/>
        <Routers />
      </div>
  );
}

export default App;
