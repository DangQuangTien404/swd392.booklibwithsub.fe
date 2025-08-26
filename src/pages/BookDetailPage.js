import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Spin, Alert, Button, message, Modal, Form, Input, InputNumber, Space } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBookById, updateBook, deleteBook } from '../api/books';
import { borrowBook, getActiveLoans } from '../api/loans';
import { UserContext } from '../context/UserContext';
import '../styles/BookDetailPage.css';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, subscriptionStatus, basket, setBasket } = useContext(UserContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowedBookIds, setBorrowedBookIds] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  // Admin edit/delete state
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm] = Form.useForm();

  const [delConfirm, setDelConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.userRole?.toLowerCase?.() === 'admin';

  async function refresh() {
    setLoading(true);
    try {
      const [bookData, activeLoans] = await Promise.all([
        getBookById(id),
        user ? getActiveLoans() : Promise.resolve([])
      ]);
      setBook(bookData);
      setBorrowedBookIds(new Set(activeLoans.map(item => item.bookId)));
      setError('');
    } catch (err) {
      setError('Failed to fetch book details.');
      setBook(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const alreadyBorrowed = borrowedBookIds.has(Number(id));
  const inBasket = basket.some(b => b.id === Number(id));
  const noAvailable = (book?.availableCopies ?? 0) <= 0;

  // ---------- Borrow ----------
  const handleBorrow = async () => {
    if (!user || !subscriptionStatus?.subscriptionId) {
      message.warning('You need to be logged in and subscribed to borrow books.');
      return;
    }
    if (noAvailable) {
      message.info('No available copies at the moment.');
      return;
    }
    setActionLoading(true);
    try {
      // Use single ID for single borrow
      await borrowBook(subscriptionStatus.subscriptionId, Number(id));
      message.success(`You have borrowed "${book.title}"!`);
      const activeLoans = await getActiveLoans();
      setBorrowedBookIds(new Set(activeLoans.map(item => item.bookId)));
      // optimistically decrement available
      setBook(prev => prev ? { ...prev, availableCopies: Math.max(0, (prev.availableCopies ?? 0) - 1) } : prev);
    } catch {
      message.error('Borrow failed. Please try again.');
    }
    setActionLoading(false);
  };

  // ---------- Basket ----------
  const handleAddToBasket = () => {
    if (!user) {
      message.warning('You need to be logged in to add books to your basket.');
      return;
    }
    if (inBasket) {
      message.info('This book is already in your basket.');
      return;
    }
    setBasket([...basket, book]);
    message.success('Book added to basket!');
  };

  // ---------- Admin: Edit ----------
  const openEdit = () => {
    if (!book) return;
    editForm.setFieldsValue({
      title: book.title,
      authorName: book.authorName,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      coverImageUrl: book.coverImageUrl
    });
    setEditVisible(true);
  };

  const submitEdit = async () => {
    try {
      const values = await editForm.validateFields();
      setEditing(true);
      await updateBook(Number(id), values);
      setEditVisible(false);
      message.success('Book updated successfully.');
      await refresh();
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;
      message.error(status === 409 ? (msg || 'ISBN already exists.') : (msg || 'Update failed.'));
    } finally {
      setEditing(false);
    }
  };

  // ensure availableCopies ≤ totalCopies
  const onEditValuesChange = (_, all) => {
    const t = Number(all.totalCopies ?? 0);
    const a = Number(all.availableCopies ?? 0);
    if (!Number.isNaN(t) && !Number.isNaN(a) && a > t) {
      editForm.setFieldsValue({ availableCopies: t });
    }
  };

  // ---------- Admin: Delete ----------
  const openDelete = () => setDelConfirm(true);
  const confirmDelete = async () => {
    if (!book) return;
    try {
      setDeleting(true);
      await deleteBook(Number(id));
      message.success('Book deleted.');
      navigate('/all-books');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Delete failed.';
      message.error(msg);
    } finally {
      setDeleting(false);
      setDelConfirm(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="book-detail-content">
        {loading ? (
          <Spin tip="Loading book..." />
        ) : error ? (
          <Alert type="error" message={error} />
        ) : book ? (
          <div className="book-detail-card-wrapper">
            <Card className="book-detail-card" bodyStyle={{ padding: '2rem 2rem 1.5rem 2rem' }}>
              <div className="book-detail-image-wrapper">
                {book.coverImageUrl && (
                  <img alt={book.title} src={book.coverImageUrl} className="book-detail-image" />
                )}
              </div>
              <div className="book-detail-info">
                <h2 className="book-detail-title">{book.title}</h2>
                <ul className="book-detail-meta">
                  <li><span>Author:</span> {book.authorName}</li>
                  <li><span>ISBN:</span> {book.isbn}</li>
                  <li><span>Publisher:</span> {book.publisher || '-'}</li>
                  <li><span>Published Year:</span> {book.publishedYear}</li>
                  <li><span>Total Copies:</span> {book.totalCopies}</li>
                  <li><span>Available Copies:</span> {book.availableCopies}</li>
                </ul>

                <div className="book-detail-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button
                    type="primary"
                    onClick={handleBorrow}
                    disabled={!user || alreadyBorrowed || actionLoading || noAvailable}
                    loading={actionLoading}
                  >
                    {alreadyBorrowed ? 'Already Borrowed' : noAvailable ? 'Not Available' : 'Borrow'}
                  </Button>
                  <Button onClick={handleAddToBasket} disabled={!user || inBasket}>
                    {inBasket ? 'In Basket' : 'Add to Basket'}
                  </Button>

                  {isAdmin && (
                    <Space>
                      <Button onClick={openEdit}>Edit</Button>
                      <Button danger onClick={openDelete}>Delete</Button>
                    </Space>
                  )}
                </div>
              </div>
            </Card>

            <div className="book-detail-back">
              <Link to="/all-books">
                <Button type="primary">Back to all books</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {/* Admin: Edit Modal */}
      <Modal
        open={editVisible}
        title={`Edit Book${book ? `: ${book.title}` : ''}`}
        onOk={submitEdit}
        confirmLoading={editing}
        onCancel={() => setEditVisible(false)}
        okText="Save Changes"
      >
        <Form form={editForm} layout="vertical" name="editBookForm" onValuesChange={onEditValuesChange}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Author" name="authorName" rules={[{ required: true, message: 'Please enter the author' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: 'Please enter ISBN' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Publisher" name="publisher">
            <Input />
          </Form.Item>
          <Form.Item label="Published Year" name="publishedYear" rules={[{ required: true, message: 'Please enter published year' }]}>
            <InputNumber min={0} max={9999} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Total Copies" name="totalCopies" rules={[{ required: true, message: 'Please enter total copies' }]}>
            <InputNumber min={0} max={100000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Available Copies"
            name="availableCopies"
            rules={[
              { required: true, message: 'Please enter available copies' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const t = Number(getFieldValue('totalCopies') ?? 0);
                  if (value <= t) return Promise.resolve();
                  return Promise.reject(new Error('Available copies cannot exceed total copies.'));
                }
              })
            ]}
          >
            <InputNumber min={0} max={100000} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Cover Image URL" name="coverImageUrl">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Admin: Delete confirm */}
      <Modal
        open={delConfirm}
        title="Delete Book"
        onOk={confirmDelete}
        okButtonProps={{ danger: true, loading: deleting }}
        onCancel={() => setDelConfirm(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        {book ? <>Are you sure you want to delete <strong>{book.title}</strong>?</> : 'Delete this book?'}
      </Modal>

      <Footer />
    </div>
  );
}

export default BookDetailPage;
