// Home.js
import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';

const Home = () => {
  return (
    <Container component="main" maxWidth="md" style={{ marginTop: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Shems - Your Smart Home Companion
      </Typography>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          What is Shems?
        </Typography>
        <Typography paragraph>
          Shems is a platform designed to help you manage and optimize your smart home and IoT devices. Whether you're
          looking to reduce energy consumption, enhance security, or create a more comfortable living space, Shems has
          you covered.
        </Typography>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Benefits of Using Smart IoT Devices
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Energy Efficiency</Typography>
            <Typography>
              Monitor and optimize energy consumption to reduce your environmental impact and save on utility bills.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Security and Safety</Typography>
            <Typography>
              Enhance the security of your home with smart cameras, doorbell cameras, and motion detectors.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Convenience</Typography>
            <Typography>
              Enjoy the convenience of controlling your devices remotely, creating schedules, and automating tasks.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Getting Started with Shems
        </Typography>
        <Typography paragraph>
          Ready to transform your home into a smart and efficient space? Follow these simple steps to get started with
          Shems:
        </Typography>
        <ol>
          <li>Create a Shems account or log in if you already have one.</li>
          <li>Add your smart devices to the platform and configure their settings.</li>
          <li>Explore the dashboard to monitor energy consumption, security alerts, and device status.</li>
          <li>Take advantage of automation features to simplify your daily routines.</li>
        </ol>
      </Paper>
    </Container>
  );
};

export default Home;
