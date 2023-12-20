// App.js
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect,useLocation } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Dashboard from './Dashboard';
import Profile from './Profile';
import ServiceLocation from './ServiceLocation';
import AddServiceLocationForm from './AddServiceLocationForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <CssBaseline />
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={() => <Login setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/service-location/:id" component={ServiceLocation} />
       // <Route path="/AddServiceLocationForm" component={AddServiceLocationForm} />

        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
