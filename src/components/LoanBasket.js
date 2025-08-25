import React, { useContext } from 'react';
import { Card, List, Button, Modal } from 'antd';
import { DeleteOutline } from '@mui/icons-material';
import { addBooksToLoan, borrowBook } from '../api/loans';
import { UserContext } from '../context/UserContext';
import '../styles/LoanBasket.css';

function LoanBasket({ loanId }) {
  const { basket, setBasket } = useContext(UserContext);

  const handleRemoveBook = (bookId) => {
    setBasket(basket.filter((book) => book.id !== bookId));
  };

  const handleAddBooks = async () => {
    try {
      const bookIds = basket.map((book) => book.id);
      await borrowBook(loanId, bookIds);
      setBasket([]);
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: 'Failed to add books to loan. Please try again.',
      });
    }
  };

  return (
    <Card
      title={<span className="loan-basket-title">Loan Basket</span>}
      className="loan-basket-card"
      bodyStyle={{ padding: '0.5rem 1rem 1rem 1rem' }}
    >
      {basket.length === 0 ? (
        <div className="loan-basket-empty">
          <span className="loan-basket-empty-icon" role="img" aria-label="empty">📭</span>
          No books in basket
        </div>
      ) : (
        <>
          <List
            className="loan-basket-list"
            dataSource={basket}
            renderItem={(book) => (
              <List.Item
                actions={[
                  <Button
                    key={book.id}
                    className="loan-basket-remove-btn"
                    onClick={() => handleRemoveBook(book.id)}
                    icon={<DeleteOutline />}
                    size="small"
                  />
                ]}
              >
                <span role="img" aria-label="book" style={{ marginRight: 6 }}>📚</span>
                {book.title}
              </List.Item>
            )}
          />
          <Button
            type="primary"
            className="loan-basket-add-btn"
            onClick={handleAddBooks}
          >
            Add to Loan
          </Button>
        </>
      )}
    </Card>
  );
}

export default LoanBasket;