import axios from 'axios';
import React, { useState } from 'react';
import {geocode,RequestType,} from "react-geocode";

function WeatherApp() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);


  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    } else {
      console.log("Geolocation not supported");
    }
  }
  

  const  success = async(position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude ;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    console.log(`More or less ${position.coords.accuracy} meters.`);

    // Make API call to OpenWeatherMap
    const {data}  = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=+${longitude}&localityLanguage=en`);
    console.log(data.city);

  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <div>
     <button onClick={handleLocationClick}>Get Location</button>
      <h1>{weather?.city}</h1>
    </div>
  );
}

export default WeatherApp;