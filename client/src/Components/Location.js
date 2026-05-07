import React, { useState, useEffect } from "react";
import axios from "axios";

const Location = () => {
  const [locationData, setLocationData] = useState(null); // State to hold location data

  // Fetch IP and location in one request using ip-api.com (free, no API key required)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await axios.get("http://ip-api.com/json/");
          setLocationData(response.data);
          
      } catch (error) {
        console.error("Error fetching location data:", error.message);
      }
    };
    fetchLocation();
  }, []);

  return (
    <div className="location">
      <br />
      {locationData ? (
        <div>
          <span>IP: {locationData.query}</span>
          <br />
          <span>City: {locationData.city}</span>
          <br />
          <span>Country: {locationData.country}</span>
        </div>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default Location;
