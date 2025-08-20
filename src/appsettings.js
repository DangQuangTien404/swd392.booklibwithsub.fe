// src/appsettings.js
// Centralized app settings for API base URL

const appsettings = {
  apiBaseUrl: process.env.NODE_ENV === 'development' 
    ? "http://localhost:8080/api" 
    : "https://booklibwithsubapi.azurewebsites.net/api"
};

export default appsettings;
