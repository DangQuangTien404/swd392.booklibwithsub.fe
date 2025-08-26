
import http from './http';

export async function fetchBooks() {
  const res = await http.get('/books');
  return res.data;
}

export async function addBook(bookData) {
  const res = await http.post('/books', bookData);
  return res.data;
}

export async function updateBook(bookId, bookData) {
  const res = await http.put(`/books/${bookId}`, bookData);
  return res.data;
}

export async function getBookById(bookId) {
  const res = await http.get(`/books/${bookId}`);
  return res.data;
}

export async function getBooksSorted(order = 'desc') {
  const res = await http.get(`/books/sorted`, { params: { order } });
  return res.data;
}

export async function deleteBook(bookId) {
  const res = await http.delete(`/books/${bookId}`);
  return res.data;
}
