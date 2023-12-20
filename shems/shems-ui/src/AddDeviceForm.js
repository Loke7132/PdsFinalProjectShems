import React, { useState } from 'react';

import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';

const AddDeviceForm = ({ onClose, onAddDevice,serviceLocationId }) => {
  const [deviceType, setDeviceType] = useState('');
  const [modelName, setmodelName] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'deviceType') {
      setDeviceType(value);
    } else if (name === 'modelName') {
      setmodelName(value);
    }
  };

  const isSubmitButtonEnabled = () => {
    return deviceType.trim() !== '' && modelName.trim() !== '';
  };

  const handleFormSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
  
      const response = await axios.post(
        `http://localhost:8000/service_locations/${serviceLocationId}/device`,
        {
          device_type_id: deviceType,
          device_name: modelName, // Corrected from deviceName
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 201) {
        console.log('Device added:', response.data);
        onAddDevice();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle errors from the server
        setErrors(error.response.data);
      } else {
        console.error('Error adding device:', error.message);
      }
    }
  };
  
  
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Device</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Device Type"
              name="deviceType"
              value={deviceType}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.device_type_id)}
              helperText={errors.device_type_id}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Model Name"
              name="modelName"
              value={modelName}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.device_name)}
              helperText={errors.device_name}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleFormSubmit} disabled={!isSubmitButtonEnabled()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddDeviceForm;
