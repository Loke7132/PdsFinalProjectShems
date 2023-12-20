// Navbar.js
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink,useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom'; // Import useHistory

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const history =useHistory();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout=()=>{
    onLogout()
    history.push("/")
  }
  const location = useLocation();

  useEffect(() => {
    // Close the menu when the authentication state changes
    handleMenuClose();
  }, [isAuthenticated]);

  return (
    <AppBar key={location.key} position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <RouterLink to={isAuthenticated ? "/dashboard" : "/"} style={{ color: 'inherit', textDecoration: 'none' }}>
            SHEMS
          </RouterLink>
        </Typography>

        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={handleMenuOpen}>
              <AccountCircleIcon style={{ fontSize: 50, color: '#3f51b5', width: '100%', alignItems: 'center' }} />
            </Button>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose} component={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/signup">
              Sign Up
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
