import axios from 'axios';
import appsettings from '../appsettings';

function getToken() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function borrowBook(subscriptionId, bookIds) {
  console.log('API call - borrowBook with subscriptionId:', subscriptionId, 'bookIds:', bookIds);
  console.log(appsettings.apiBaseUrl);
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/Loans`,
    { subscriptionId, bookIds },
    { headers: authHeaders() }
  );
  return response.data;
}

export async function addBooksToLoan(loanId, bookIds) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/loans/${loanId}/items`,
    { bookIds },
    { headers: authHeaders() }
  );
  return response.data;
}

export async function returnLoanedBook(loanItemId) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/loans/items/${loanItemId}/return`,
    {},
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getLoanHistory() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/loans/history`, { headers: authHeaders() });
  return response.data;
}

export async function getActiveLoans() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/loans/active`, { headers: authHeaders() });
  return response.data;
}

export async function getLoanDetails(loanId) {
  const response = await axios.get(`${appsettings.apiBaseUrl}/loans/${loanId}`, { headers: authHeaders() });
  return response.data;
}

export async function extendLoan(loanId, { newDueDate, daysToExtend }) {
  const response = await axios.put(
    `${appsettings.apiBaseUrl}/loans/${loanId}/extend`,
    { newDueDate, daysToExtend },
    { headers: authHeaders() }
  );
  return response.data;
}