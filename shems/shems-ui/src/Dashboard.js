// Dashboard.js
import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import AddServiceLocationForm from './AddServiceLocationForm';
import { useHistory } from 'react-router-dom';


import {
  Container, Paper, Typography, Button, Grid, Card,Link,CircularProgress
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart, 
  Scatter,
  LabelList
} from "recharts";
import { Link as RouterLink } from "react-router-dom";



const EnergyConsumptionChart = () => {
  
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  
  const fetchConsumptionData = async (accessToken) => {
    try {
      const serviceLocsResponse = await fetch(
        "http://localhost:8000/monthly_energy_consumption_trend",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await serviceLocsResponse.json();
      setData(data);
      setIsLoading(false); // Set loading state to false when data is fetched

    } catch (error) {
      console.error("Error fetching service locations:", error);
      setIsLoading(false); // Set loading state to false on error

    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchConsumptionData(accessToken);
    }
  }, []);
  
  
  const formatXAxisLabel = (value,index) => {
    const monthYear = data[index] ? `${data[index].Month}/${data[index].Year}` : "";
    return monthYear;
  };

  
  return (
    <Paper style={{ padding: "20px", marginBottom: "10px",width:"50%" }}>
      <Typography variant="h6" gutterBottom>
        Energy Consumption Chart
      </Typography>
      {isLoading ? ( // Conditional rendering based on loading state
        <CircularProgress /> // Display loading spinner
      ) : (
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey={(value, index) => index} // Use index as data key
            tickFormatter={formatXAxisLabel} // Format X-axis label
          />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="MonthlyEnergyConsumption"
            fill="#8884d8"
            name="Monthly Energy Consumption"
          />
        </BarChart>
      )}
    </Paper>
  );
};

const EnergyConsumptionVsSQFT = ()=>{
  const [data,setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  
  const fetchConsumptionData = async (accessToken) => {
    try {
      const serviceLocsResponse = await fetch(
        "http://localhost:8000/energy_consumption_vs_sqft",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await serviceLocsResponse.json();
      setData(data);
      setIsLoading(false); // Set loading state to false when data is fetched

    } catch (error) {
      console.error("Error fetching service locations:", error);
      setIsLoading(false); // Set loading state to false on error

    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchConsumptionData(accessToken);
    }
  }, []);
  
  return (
    <Paper style={{ padding: "20px", marginBottom: "10px",width:"50%" }}>
      <Typography variant="h6" gutterBottom>
        Energy Consumption vs. Square Footage
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <ScatterChart
          width={500}
          height={300}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid />
          <XAxis dataKey="SquareFootage" type="number" name="Square Footage" unit=" sqft" />
          <YAxis dataKey="TotalEnergyConsumption" type="number" name="Total Energy Consumption" unit=" kWh" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="Data" data={data} fill="#8884d8" />
        </ScatterChart>
      )}
    </Paper>
  );

}

const PeakEnergyUsageChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageData = async (accessToken) => {
    try {
      const response = await fetch("http://localhost:8000/peak_energy_usage_hours", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching peak energy usage data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUsageData(accessToken);
    }
  }, []);

  return (
    <Paper style={{ padding: "20px", marginBottom: "10px", width: "50%" }}>
      <Typography variant="h6" gutterBottom>
        Peak Energy Usage Chart
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="HourOfDay" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="HourlyEnergyConsumption"
            fill="#8884d8"
            name="Hourly Energy Consumption"
          />
        </BarChart>
      )}
    </Paper>
  );
};

const AvgDailyEnergyConsumptionChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageData = async (accessToken) => {
    try {
      const response = await fetch(
        "http://localhost:8000/avg_daily_energy_consumption_per_location",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching average daily energy consumption data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUsageData(accessToken);
    }
  }, []);

  return (
    <Paper style={{ padding: "20px", marginBottom: "10px", width: "50%" }}>
      <Typography variant="h6" gutterBottom>
        Average Daily Energy Consumption Chart
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <XAxis type="number" />
          <YAxis dataKey="Location" type="category" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="AverageDailyEnergyConsumption"
            fill="#8884d8"
            name="Avg Daily Energy Consumption"
          >
            <LabelList
              dataKey="AverageDailyEnergyConsumption"
              position="right"
              fill="#8884d8"
            />
          </Bar>
        </BarChart>
      )}
    </Paper>
  );
};


const ServiceLocationCard = ({ location, onDelete, onEdit }) => {
  return (
    <Paper
      style={{
        padding: "10px",
        textDecoration: "none",
        color: "inherit",
        marginBottom: "20px",
        width: "30%",
        margin: "10px",
        display: "flex", // Use flex display for horizontal arrangement
        justifyContent: "space-between", // Add space between the two divs
        alignItems: "center", // Center vertically
      }}
    >
      {/* Div for location details as a link */}
      <div>
        <Link
          component={RouterLink}
          to={`/service-location/${location.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="subtitle1">{location.address}</Typography>
          <Typography variant="body2">{`${location.bedrooms} bedrooms, ${location.occupants} occupants`}</Typography>
          <Typography variant="body2">{`${location.squarefoot} sqft`}</Typography>
          <Typography variant="body2">{`${location.city}, ${location.state} ${location.zipcode}`}</Typography>
        </Link>
      </div>

      {/* Div for delete button */}
      <div>
        <IconButton color="secondary" onClick={() => onDelete(location.id)}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Paper>
  );
};




const ServiceLocations = ({
  locations,
  showAllLocations,
  setShowAllLocations,
  onDeleteLocation,
  onAddLocation,
  
}) => {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const openAddForm = () => {
    setIsAddFormOpen(true);
  };

  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };
  const handleAddLocation = () => {
    openAddForm();
  };

  return (
    <Paper style={{ padding: "20px", marginBottom: "20px" }}>
      <Container style={{        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
}}>
      <EnergyConsumptionChart/>
      <EnergyConsumptionVsSQFT/>
      <PeakEnergyUsageChart/> 
      <AvgDailyEnergyConsumptionChart/>
      </Container>
      <Typography variant="h6" gutterBottom>
        Service Locations
      </Typography>

      <Grid container spacing={2}>
        {locations
          .slice(0, showAllLocations ? locations.length : 3)
          .map((location) => (
            <ServiceLocationCard
              key={location.id}
              location={location}
              onDelete={onDeleteLocation}
              
            />
          ))}
      </Grid>
      
      {!showAllLocations && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowAllLocations(true)}
        >
          View More
        </Button>
      )}
     <Button variant="outlined" style={{  margin: "20px" }} color="primary" onClick={handleAddLocation}>
        <AddIcon /> ADD Location
      </Button>

      {isAddFormOpen && (
        <AddServiceLocationForm
          onClose={closeAddForm}
          onAddLocation={onAddLocation} // Pass your actual function here
        />
      )}
    </Paper>
  );
};






const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [serviceLocations, setServiceLocations] = useState([]);
  const [showAllLocations, setShowAllLocations] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const history = useHistory();
  const openAddForm = () => {
    setIsAddFormOpen(true);
  };
  
  const closeAddForm = () => {
    setIsAddFormOpen(false);
  };
  const handleAddLocation = () => {
    // Close the modal
    closeAddForm();

    // Refetch service locations
    fetchServiceLocations(localStorage.getItem("accessToken"));
  };
  


  const fetchServiceLocations = async (accessToken) => {
    try {
      const serviceLocsResponse = await fetch(
        "http://localhost:8000/service_locations",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const serviceLocsData = await serviceLocsResponse.json();
      setServiceLocations(serviceLocsData);
      setIsAddFormOpen(false);
    } catch (error) {
      console.error("Error fetching service locations:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchServiceLocations(accessToken);
    }
  }, []);

  const handleDeleteLocation = async (locationId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch(
        `http://localhost:8000/service_locations/${locationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        
        console.log(`Location ${locationId} deleted successfully`);
        setServiceLocations((prevLocations) =>
          prevLocations.filter((loc) => loc.id !== locationId)
        );
        //history.push("/dashboard");
      } else {
        console.error(
          `Error deleting location ${locationId}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };





  return (
    <Container>
      <Typography variant="h4" style={{ margin: "20px 0" }}>
        Dashboard
      </Typography>

      {/* Your existing chart component */}
      {/* <EnergyConsumptionChart chartData={chartData} /> */}

      {/* Updated ServiceLocations component with onDeleteLocation, onEditLocation, and onAddLocation props */}
      <ServiceLocations
        locations={serviceLocations}
        showAllLocations={showAllLocations}
        setShowAllLocations={setShowAllLocations}
        onDeleteLocation={handleDeleteLocation}
        onAddLocation={handleAddLocation}
        
        
      />

    

    
    </Container>
  );
};

export default Dashboard;
