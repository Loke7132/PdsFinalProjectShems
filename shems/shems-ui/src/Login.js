// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Button, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory } from 'react-router-dom'; // Import useHistory

const Login = ({setIsAuthenticated}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); // Get the history object

  const isLoginButtonEnabled = () => {
    return username.trim() !== '' && password.trim() !== '';
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/login', { username, password });
      if (response.data.access_token) {
        // Store the access token in localStorage
        localStorage.setItem('accessToken', response.data.access_token);

        
        setIsAuthenticated(true);

        // Log the success message
        console.log('Login successful:', response.data.message);

        // Redirect to another page or perform other actions after successful login
        history.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      alert("Invalid credentials")
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100vh',
        width: '40%',
      }}
    >
      <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AccountCircleIcon style={{ fontSize: 80, color: '#3f51b5', marginBottom: '20px', width: '100%', alignItems: 'center' }} />
        <TextField
          label="Username"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin} disabled={!isLoginButtonEnabled()}>
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
