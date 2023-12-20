// ServiceLocation.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddDeviceForm from './AddDeviceForm';
import Button from "@mui/material/Button"; 







import {
  Container,
  Paper,
  Typography,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DeviceCard = ({ device,onDelete }) => {
  const [deviceUsage, setDeviceUsage] = useState([]);
  const [viewLogs, setViewLogs] = useState(false);
  const [viewGraph, setViewGraph] = useState(false);

  const handleViewLogs = async (deviceId) => {
    if (viewLogs) {
      // Clear logs data when switching to graph
      setViewLogs(false);
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Fetch device usage data
      const usageResponse = await fetch(
        `http://localhost:8000/service_locations/${device.location_id}/devices/${deviceId}/usage`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const usageData = await usageResponse.json();
      setDeviceUsage(usageData);

      setViewLogs(true);
      setViewGraph(false);
    } catch (error) {
      console.error("Error fetching device usage:", error);
    }
  };

  const handleViewGraph = async (deviceId) => {
    if (viewGraph) {
      // Clear logs data when switching to graph
      setViewGraph(false);
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Fetch device usage data
      const usageResponse = await fetch(
        `http://localhost:8000/service_locations/${device.location_id}/devices/${deviceId}/usage`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const usageData = await usageResponse.json();
      setDeviceUsage(usageData);

      // Handle view graph action
      console.log(`View Graph for ${deviceId}`);
      setViewLogs(false);
      setViewGraph(true);
    } catch (error) {
      console.error("Error fetching device usage:", error);
    }
  };
  const handleDelete = async (deviceId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      const response = await fetch(
        `http://localhost:8000/service_locations/${device.location_id}/device/${deviceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (response.ok) {
        console.log(`Device ${deviceId} deleted successfully`);
       onDelete(deviceId);
       
      } else {
        console.error(`Error deleting device ${deviceId}:`, response.statusText);
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };
  

  return (
    <Paper
      style={{
        position: "relative",
        padding: "10px",
        marginBottom: "10px",
      }}
    >
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <IconButton color="primary" onClick={() => handleViewLogs(device.id)}>
          <ListAltIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => handleViewGraph(device.id)}>
          <BarChartIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => handleDelete(device.id)}>
          <DeleteIcon />
        </IconButton>
      </div>
      <Typography variant="subtitle1">{device.device_name}</Typography>
      <Typography variant="body2">{`Type: ${device.device_type_name}`}</Typography>
      <Typography variant="body2">{`Model: ${device.model}`}</Typography>
      <Typography variant="body2">{`Model Number: ${device.model_number}`}</Typography>
      {viewLogs && (
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Device Usage Logs for {device.device_name}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Energy Label</TableCell>
                  <TableCell>Energy Usage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deviceUsage.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.time_stamp}</TableCell>
                    <TableCell>{log.energy_label}</TableCell>
                    <TableCell>{log.energy_usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {viewGraph && (
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Energy Usage Graph for {device.device_name}
          </Typography>
          {/* Render Recharts LineChart */}
          <LineChart
            width={500}
            height={300}
            data={deviceUsage}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="time_stamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="energy_usage" stroke="#8884d8" />
          </LineChart>
        </Paper>
      )}
    </Paper>
  );
};

const Devices = ({ locationId }) => {

  const [devices, setDevices] = useState([]);
  const onDelete=(deviceID)=>{
    setDevices((prevDevices) =>
    prevDevices.filter((device) => device.id !== deviceID)
  );
  }
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const devicesResponse = await fetch(
          `http://localhost:8000/service_locations/${locationId}/devices`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const devicesData = await devicesResponse.json();
        setDevices(devicesData);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, [locationId]);

  return (
    <Container style={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Devices Connected to this Location
      </Typography>
      {/* <Button variant="outlined" style={{  margin: "20px" }} color="primary" onClick={handleAddLocation}>
        <AddIcon /> ADD Location
      </Button> */}


      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} onDelete={onDelete} />
      ))}
    </Container>
  );
};

const ServiceLocation = () => {
  const { id } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [devices, setDevices] = useState([]);
 
  

  useEffect(() => {
    const fetchServiceLocation = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        // Fetch service location details
        const locationResponse = await fetch(
          `http://localhost:8000/service_locations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const locationData = await locationResponse.json();
        setLocationData(locationData);
      } catch (error) {
        console.error("Error fetching service location:", error);
      }
    };

    fetchServiceLocation();
  }, [id]);
  const handleAddDeviceClick = () => {
    setShowAddDeviceForm(true);
  };

  const handleAddDeviceClose = () => {
    setShowAddDeviceForm(false);
  };
  const handleAddDevice = async () => {
    try {
      // Refetch the list of devices after adding a device
      const accessToken = localStorage.getItem("accessToken");
      const devicesResponse = await fetch(
        `http://localhost:8000/service_locations/${id}/devices`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const devicesData = await devicesResponse.json();
      setDevices(devicesData);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };
  return (
    
    <Container>
       
      {locationData ? (
        <Paper style={{ padding: "10px", margin: "20px" }}>
      
          <Typography variant="h5" gutterBottom>
            Service Location Details
          </Typography>
      
          <Typography variant="subtitle1">{locationData.address}</Typography>
          <Typography variant="body2">{`${locationData.bedrooms} bedrooms, ${locationData.occupants} occupants`}</Typography>
          <Typography variant="body2">{`${locationData.squarefoot} sqft`}</Typography>
          <Typography variant="body2">{`${locationData.city}, ${locationData.state} ${locationData.zipcode}`}</Typography>
          {/* Add more details as needed */}
        </Paper>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
        <Button variant="outlined" style={{ margin: "20px" }} color="primary" onClick={handleAddDeviceClick}>
        Add Device
      </Button>
 
      {locationData && <Devices locationId={id} onAddDevice={handleAddDevice}/>}
      {showAddDeviceForm && (
        <AddDeviceForm
          serviceLocationId={id}
          onClose={handleAddDeviceClose}
          onAddDevice={handleAddDevice}
        />
      )}
        {/* AddServiceLocationForm */}
    
    </Container>
  );
};

export default ServiceLocation;

