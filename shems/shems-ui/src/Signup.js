// Signup.js
import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useHistory } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const Signup = () => {
  const history = useHistory();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });

  const steps = ['Account Information', 'Personal Information', 'Address Information'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isNextButtonEnabled = () => {
    // Check if required fields are not empty
    switch (activeStep) {
      case 0:
        return formData.username.trim() !== '' && formData.password.trim() !== '';
      case 1:
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.email.trim() !== '' &&
          isValidEmail(formData.email)
        );
      case 2:
        return (
          formData.address.trim() !== '' &&
          formData.city.trim() !== '' &&
          formData.state.trim() !== '' &&
          formData.zipcode.trim() !== ''
        );
      default:
        return true;
    }
  };

  const isValidEmail = (email) => {
    // Simple email validation (you can enhance this based on your requirements)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
        // Make a POST request to the signup API
        const response = await axios.post('http://localhost:8000/signup', formData);
  
        // Handle successful signup
        if (response.status === 201) {
          console.log('User created successfully:', response.data);
          // Redirect to login page after successful signup
          history.push('/login');
        }
      } catch (error) {
        // Handle errors, check for duplicate user (status code 409)
        if (error.response && error.response.status === 409) {
          console.error('Username or email already exists');
          // You can display a user-friendly error message to the user
          alert('Username or email already exists');
        } else {
          console.error('Error during signup:', error.message);
        }
      }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
        <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
          Sign Up for Shems
        </Typography>
        <Stepper activeStep={activeStep} style={{ width: '100%', marginBottom: '20px' }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <div>
            {/* Step 1: Account Information */}
            <AccountCircleIcon style={{ fontSize: 50, color: '#3f51b5', marginBottom: '20px',width:'100%',alignItems:'center' }} />
            <TextField
              label="Username"
              margin="normal"
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              type="password"
              margin="normal"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div>
            {/* Step 2: Personal Information */}
            <MailOutlineIcon style={{ fontSize: 50, color: '#3f51b5', marginBottom: '20px',width:'100%',alignItems:'center' }} />
            <TextField
              label="First Name"
              margin="normal"
              fullWidth
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              margin="normal"
              fullWidth
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField label="Email" margin="normal" fullWidth name="email" value={formData.email} onChange={handleChange} />
          </div>
        )}

        {activeStep === 2 && (
          <div>
            {/* Step 3: Address Information */}
            <LocationOnIcon style={{ fontSize: 50, color: '#3f51b5', marginBottom: '20px',width:'100%',alignItems:'center' }} />
            <TextField
              label="Address"
              margin="normal"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField label="City" margin="normal" fullWidth name="city" value={formData.city} onChange={handleChange} />
            <TextField label="State" margin="normal" fullWidth name="state" value={formData.state} onChange={handleChange} />
            <TextField
              label="Zipcode"
              margin="normal"
              fullWidth
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', width: '100%' }}>
          {activeStep !== 0 && (
            <Button variant="outlined" color="primary" onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep !== steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isNextButtonEnabled()}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!isNextButtonEnabled()}
            >
              Sign Up
            </Button>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default Signup;
