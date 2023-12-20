// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (accessToken) => {
      try {
        const response = await axios.get('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    const accessToken = localStorage.getItem("accessToken")
    fetchUserData(accessToken);
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Paper elevation={3}>
      <Card style={{padding:"5%", border:"3px dashed black", borderRadius:"10px"}}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <PersonIcon style={{ fontSize: 50, color: '#3f51b5' }} />
            </Grid>
            <Grid item>
              <Typography variant="h5" gutterBottom>
                User Profile
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Username:</strong> {userData.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Email:</strong> {userData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>First Name:</strong> {userData.first_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Last Name:</strong> {userData.last_name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Address:</strong> {userData.address}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>City:</strong> {userData.city}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>State:</strong> {userData.state}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Zipcode:</strong> {userData.zipcode}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Paper>
  );
};

export default Profile;
