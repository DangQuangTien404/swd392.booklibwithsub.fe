import axios from 'axios';
import appsettings from '../appsettings';

export async function borrowBook(subscriptionId, bookId) {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
      throw new Error('User is not authenticated.');
    }

    const response = await axios.post(
      `${appsettings.apiBaseUrl}/Loans`,
      {
        subscriptionId,
        bookIds: [bookId],
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to borrow the book. Please try again later.'
    );
  }
}

export async function addBooksToLoan(loanId, bookIds) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(
    `${appsettings.apiBaseUrl}/loans/${loanId}/items`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookIds }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to add books to loan.');
  }

  return await response.json();
}

export async function returnLoanedBook(loanItemId) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(
    `${appsettings.apiBaseUrl}/loans/items/${loanItemId}/return`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to return loaned book.');
  }
}

export async function getLoanHistory() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/loans/history`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch loan history.');
  }

  return await response.json();
}

export async function getActiveLoans() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(`${appsettings.apiBaseUrl}/loans/active`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch active loans.');
  }

  return await response.json();
}

export async function getLoanDetails(loanId) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const response = await fetch(
    `${appsettings.apiBaseUrl}/loans/${loanId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch loan details.');
  }

  return await response.json();
}
