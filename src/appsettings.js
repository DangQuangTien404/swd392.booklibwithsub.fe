// src/appsettings.js
// Centralized app settings for API base URL

const appsettings = {
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8080/api" 
    : "hhttps://swd392booklibwithsubbe-production-1bea.up.railway.app/api"
};

export default appsettings;
