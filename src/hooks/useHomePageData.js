import { useState, useEffect } from 'react';
import { getBooksSorted } from '../api/books';
import { fetchSubscriptionPlans } from '../api/subscriptionPlans';

const useHomePageData = () => {
  const [books, setBooks] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await getBooksSorted();
        setBooks(data.slice(0, 3)); 
      } catch (error) {
        console.error('Error loading books:', error);
      }
    };

    const loadPlans = async () => {
      try {
        const data = await fetchSubscriptionPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
      }
    };

    loadBooks();
    loadPlans();
  }, []);

  return { books, plans };
};

export default useHomePageData;
