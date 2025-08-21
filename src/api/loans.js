
import axios from 'axios';
import appsettings from '../appsettings';

export async function borrowBook(subscriptionId, bookId) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const response = await axios.post(
    `${appsettings.apiBaseUrl}/Loans`,
    {
      subscriptionId,
      bookIds: [bookId],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
