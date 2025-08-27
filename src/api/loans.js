import axios from 'axios';
import appsettings from '../appsettings';

function getToken() {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token;
}

function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

export async function borrowBook(subscriptionId, bookIds) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/loans`,
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
    null,
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getLoanHistory() {
  const response = await axios.get(
    `${appsettings.apiBaseUrl}/loans/history`,
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getActiveLoans() {
  const response = await axios.get(
    `${appsettings.apiBaseUrl}/loans/active`,
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getLoanDetails(loanId) {
  const response = await axios.get(
    `${appsettings.apiBaseUrl}/loans/${loanId}`,
    { headers: authHeaders() }
  );
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

export async function fetchAllLoans(status) {
  let url = `${appsettings.apiBaseUrl}/loans/all`;
  if (status) url += `?status=${encodeURIComponent(status)}`;
  const response = await axios.get(url, { headers: authHeaders() });
  return response.data;
}