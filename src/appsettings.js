// src/appsettings.js
const appsettings = {
  apiBaseUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api'
    : 'https://swd392booklibwithsub-be-production-1bea.up.railway.app/api'
};
export default appsettings;

