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

export async function fetchBooks() {
  const response = await axios.get(`${appsettings.apiBaseUrl}/books`);
  return response.data;
}

export async function addBook(bookData) {
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/books`,
    bookData,
    { headers: authHeaders() }
  );
  return response.data;
}

export async function updateBook(bookId, bookData) {
  console.log(bookData);
  const response = await axios.put(
    `${appsettings.apiBaseUrl}/books/${bookId}`,
    bookData,
    { headers: authHeaders() }
  );
  return response.data;
}

export async function getBookById(bookId) {
  const response = await axios.get(`${appsettings.apiBaseUrl}/books/${bookId}`);
  return response.data;
}

export async function getBooksSorted(order = 'desc') {
  const response = await axios.get(`${appsettings.apiBaseUrl}/books/sorted?order=${order}`);
  return response.data;
}

export async function deleteBook(bookId) {
  const response = await axios.delete(
    `${appsettings.apiBaseUrl}/books/${bookId}`,
    { headers: authHeaders() }
  );
  return response.data;
}
