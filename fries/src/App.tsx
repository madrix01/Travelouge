import React from 'react';
import './App.css';
import {BrowserRouter as Router,} from 'react-router-dom';
import AppBarStyled from './Components/AppBarStyled'
import Routers from './Routers';
import LoadingBar from 'react-top-loading-bar'


function App() {
  return (
    <div className="AppMain">
      <Router>
        <LoadingBar color="red" />
        <div className="App">
          <Routers />
        </div>
      </Router>
    </div>
  );
}

export default App;
