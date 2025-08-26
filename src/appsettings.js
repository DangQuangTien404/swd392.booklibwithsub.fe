// src/appsettings.js
// Centralized app settings for API base URL

const appsettings = {
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? "https://swd392booklibwithsubbe-production-1bea.up.railway.app/api" 
    : "https://swd392booklibwithsubbe-production-1bea.up.railway.app/api"
};

export default appsettings;
