import React, { useState } from 'react';
import { Card, List, Button, message } from 'antd';
import { addBooksToLoan } from '../api/loans';

function LoanBasket({ loanId }) {
  const [basket, setBasket] = useState([]);

  const handleRemoveBook = (bookId) => {
    setBasket(basket.filter((book) => book.id !== bookId));
  };

  const handleAddBooks = async () => {
    try {
      const bookIds = basket.map((book) => book.id);
      await addBooksToLoan(loanId, bookIds);
      message.success('Books added to loan successfully!');
      setBasket([]); 
    } catch (error) {
      message.error('Failed to add books to loan. Please try again.');
    }
  };

  return (
    <Card title="Loan Basket" style={{ marginTop: '20px' }}>
      <List
        dataSource={basket}
        renderItem={(book) => (
          <List.Item
            actions={[<Button onClick={() => handleRemoveBook(book.id)}>Remove</Button>]}
          >
            {book.title}
          </List.Item>
        )}
      />
      {basket.length > 0 && (
        <Button type="primary" onClick={handleAddBooks} style={{ marginTop: '10px' }}>
          Add to Loan
        </Button>
      )}
    </Card>
  );
}

export default LoanBasket;
