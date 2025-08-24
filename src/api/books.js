import axios from 'axios';
import appsettings from '../appsettings';

export async function fetchBooks() {
  try {
    const response = await axios.get(`${appsettings.apiBaseUrl}/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

export async function addBook(bookData) {
  try {
    const response = await axios.post(`${appsettings.apiBaseUrl}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
}

export async function updateBook(bookId, bookData) {
  try {
    const response = await axios.put(`${appsettings.apiBaseUrl}/books/${bookId}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
}

export async function getBookById(bookId) {
  try {
    const response = await axios.get(`${appsettings.apiBaseUrl}/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    throw error;
  }
}

export async function getBooksSorted(order = 'desc') {
  try {
    const response = await axios.get(`${appsettings.apiBaseUrl}/books/sorted?order=${order}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sorted books:', error);
    throw error;
  }
}

export async function deleteBook(bookId) {
  try {
    const response = await axios.delete(`${appsettings.apiBaseUrl}/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
}
