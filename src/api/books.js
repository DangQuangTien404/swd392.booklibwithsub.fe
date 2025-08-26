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

const BASE = `${appsettings.apiBaseUrl}/books`;

function normalizeBookPayload(data = {}) {
  return {
    title: data.title?.trim() ?? '',
    authorName: data.authorName?.trim() ?? '',
    isbn: data.isbn?.trim() ?? '',
    publisher: data.publisher?.trim() || null,
    publishedYear: Number(data.publishedYear),           // BE expects number
    totalCopies: Number(data.totalCopies),               // BE expects number
    availableCopies: Number(data.availableCopies),       // BE expects number
    coverImageUrl: data.coverImageUrl?.trim() || null
  };
}

export async function getBooksSorted(order = 'desc') {
  const res = await axios.get(`${BASE}/sorted?order=${order}`);
  return res.data; // [{ id, title, authorName, ... }]
}

export async function getBookById(id) {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
}

export async function addBook(data) {
  const payload = normalizeBookPayload(data);
  const res = await axios.post(BASE, payload, { headers: authHeaders() });
  return res.data; // created, shaped by BE
}

export async function updateBook(id, data) {
  const payload = normalizeBookPayload(data);
  try {
    const res = await axios.put(`${BASE}/${id}`, payload, { headers: authHeaders() });
    return res.data;
  } catch (err) {
    // Surface BE message (e.g., ISBN conflict) for the UI
    console.error('Update book failed:', err.response?.status, err.response?.data);
    throw err;
  }
}

export async function deleteBook(id) {
  const res = await axios.delete(`${BASE}/${id}`, { headers: authHeaders() });
  return res.data;
}
