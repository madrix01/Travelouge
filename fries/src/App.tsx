import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import AppBarStyled from './Components/AppBarStyled'
import Routers from './Routers';

function App() {
  return (
    <div className="AppMain">
      <Router>
        <div className="App">
          <AppBarStyled/>
          <Routers />
        </div>
      </Router>
    </div>
  );
}

export default App;
