import React, { useState } from "react";
import AddDeviceForm from './AddDeviceForm';
import ServiceLocation from './ServiceLocation';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
} from "@mui/material";

const AddServiceLocationForm = ({ onClose, onAddLocation }) => {
  const [open, setopen]=useState(true);
  const history = useHistory();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipcode: "",
    bedrooms: 0,
    takeover_date: "",
    squarefoot: 0,
    occupants: 0,
  });

  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const isSubmitButtonEnabled = () => {
    // Check if required fields are not empty
    return (
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.zipcode.trim() !== '' &&
      formData.bedrooms > 0 &&
      formData.takeover_date.trim() !== '' &&
      formData.squarefoot > 0 &&
      formData.occupants > 0
    );
  };


  
  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      const response = await axios.post(
        'http://localhost:8000/service_locations',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json', // Set the content type
          },
        }
      );

      if (response.status === 201) {
        console.log('Service location created:', response.data);
        // history.push("/dashboard");
        // console.log('Navigating to dashboard...');
        onAddLocation();
        onClose();
        
        // Handle success, e.g., redirect or show a success message
      }
    } catch (error) {
      // Handle errors
      console.error('Error creating service location:', error.message);
    }
  };
  

  
  





  return (
    <Dialog open={open} onClose={onClose}>

      <DialogTitle>Add Service Location</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.address)}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.city)}
              helperText={errors.city}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.state)}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.zipcode)}
              helperText={errors.zipcode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.bedrooms)}
              helperText={errors.bedrooms}
            />
          </Grid>
          { <Grid item xs={6}>
            <TextField
              label="0000-00-00"
              name="takeover_date"
              type="text"
              value={formData.takeover_date}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.takeover_date)}
              helperText={errors.takeover_date}
            />
          </Grid> }

          <Grid item xs={6}>
            <TextField
              label="Squarefoot"
              name="squarefoot"
              type="number"
              value={formData.squarefoot}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.squarefoot)}
              helperText={errors.squarefoot}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Occupants"
              name="occupants"
              type="number"
              value={formData.occupants}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.occupants)}
              helperText={errors.occupants}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!isSubmitButtonEnabled()}>
          Submit
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default AddServiceLocationForm;
