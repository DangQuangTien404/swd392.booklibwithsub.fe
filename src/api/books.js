
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
