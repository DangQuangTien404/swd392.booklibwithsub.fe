import http from './http';

export async function borrowBook(subscriptionId, bookIds) {
  const res = await http.post('/loans', { subscriptionId, bookIds });
  return res.data;
}

export async function addBooksToLoan(loanId, bookIds) {
  const res = await http.post(`/loans/${loanId}/items`, { bookIds });
  return res.data;
}

export async function returnLoanedBook(loanItemId) {
  const res = await http.post(`/loans/items/${loanItemId}/return`);
  return res.data;
}

export async function getLoanHistory() {
  const res = await http.get('/loans/history');
  return res.data;
}

export async function getActiveLoans() {
  const res = await http.get('/loans/active');
  return res.data;
}

export async function getLoanDetails(loanId) {
  const res = await http.get(`/loans/${loanId}`);
  return res.data;
}

export async function extendLoan(loanId, { newDueDate, daysToExtend }) {
  const res = await http.put(`/loans/${loanId}/extend`, { newDueDate, daysToExtend });
  return res.data;
}
