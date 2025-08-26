import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Layout, Row, Col, Pagination, Modal, Button, Form, Input, InputNumber, Space } from 'antd';
import { Link } from 'react-router-dom';
import { getBooksSorted, addBook, updateBook, deleteBook } from '../api/books';
import '../styles/AllBooksPage.css';

const { Content, Footer } = Layout;

function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Feedback/info modal
  const [modalInfo, setModalInfo] = useState({ visible: false, title: '', content: '' });
  const handleInfoClose = () => setModalInfo({ visible: false, title: '', content: '' });

  // Add
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm] = Form.useForm();

  // Edit
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [editingBook, setEditingBook] = useState(null);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState({ visible: false, book: null });
  const [deleting, setDeleting] = useState(false);

  async function refreshData() {
    try {
      const booksData = await getBooksSorted();
      setBooks(booksData);
    } catch {
      setBooks([]);
    }
  }

  useEffect(() => {
    refreshData();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Add
  const openAddModal = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const submitAddBook = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        title: values.title?.trim(),
        authorName: values.authorName?.trim(),
        isbn: values.isbn?.trim(),
        publishedYear: values.publishedYear,
        description: values.description?.trim(),
        coverImageUrl: values.coverImageUrl?.trim()
      };
      setAdding(true);
      await addBook(payload);
      setAddModalVisible(false);
      setModalInfo({ visible: true, title: 'Book Added', content: 'The book has been added successfully.' });
      await refreshData();
    } catch (err) {
      // antd form validation errors won’t be axios errors—ignore those
      if (err?.isAxiosError) {
        setModalInfo({
          visible: true,
          title: 'Add Book Failed',
          content: err?.response?.data?.message || 'There was a problem adding the book.'
        });
      }
    } finally {
      setAdding(false);
    }
  };

  // Edit
  const openEditModal = (book) => {
    setEditingBook(book);
    editForm.setFieldsValue({
      title: book.title,
      authorName: book.authorName,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      coverImageUrl: book.coverImageUrl,
      description: book.description
    });
    setEditModalVisible(true);
  };

  const submitEditBook = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        title: values.title?.trim(),
        authorName: values.authorName?.trim(),
        isbn: values.isbn?.trim(),
        publishedYear: values.publishedYear,
        description: values.description?.trim(),
        coverImageUrl: values.coverImageUrl?.trim()
      };
      setEditing(true);
      await updateBook(editingBook.id, payload);
      setEditModalVisible(false);
      setModalInfo({ visible: true, title: 'Book Updated', content: 'The book has been updated successfully.' });
      await refreshData();
    } catch (err) {
      if (err?.isAxiosError) {
        setModalInfo({
          visible: true,
          title: 'Update Failed',
          content: err?.response?.data?.message || 'There was a problem updating the book.'
        });
      }
    } finally {
      setEditing(false);
    }
  };

  // Delete
  const openDeleteConfirm = (book) => setDeleteConfirm({ visible: true, book });

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteBook(deleteConfirm.book.id);
      setDeleteConfirm({ visible: false, book: null });
      setModalInfo({ visible: true, title: 'Book Removed', content: 'The book has been deleted.' });
      await refreshData();
    } catch (err) {
      setModalInfo({
        visible: true,
        title: 'Delete Failed',
        content: err?.response?.data?.message || 'There was a problem deleting the book.'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout className="AllBooksPage">
      <Header />
      <Content style={{ padding: '2rem' }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <h1 className="page-title" style={{ margin: 0 }}>All Books</h1>
          <Button type="primary" onClick={openAddModal}>+ Add Book</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row gutter={[24, 24]} className="AllBooksPage-row" justify="center">
            {paginatedBooks.map((book) => (
              <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <div className="book-card">
                  <Link to={`/books/${book.id}`} className="book-card-link">
                    {book.coverImageUrl ? (
                      <img src={book.coverImageUrl} alt={book.title} className="img-center" />
                    ) : (
                      <div className="img-not-found">Image not found</div>
                    )}
                    <h3>{book.title}</h3>
                    <p><strong>Author:</strong> {book.authorName}</p>
                    <p><strong>Published Year:</strong> {book.publishedYear}</p>
                  </Link>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Space>
                      <Button size="small" onClick={() => openEditModal(book)}>
                        Edit
                      </Button>
                      <Button size="small" danger onClick={() => openDeleteConfirm(book)}>
                        Delete
                      </Button>
                    </Space>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={books.length}
            onChange={handlePageChange}
            style={{ marginTop: '1rem' }}
          />
        </div>

        {/* Info modal */}
        <Modal
          open={modalInfo.visible}
          title={modalInfo.title}
          onOk={handleInfoClose}
          onCancel={handleInfoClose}
          footer={[
            <Button key="ok" type="primary" onClick={handleInfoClose}>
              OK
            </Button>,
          ]}
        >
          {modalInfo.content}
        </Modal>

        {/* Add Book */}
        <Modal
          open={addModalVisible}
          title="Add New Book"
          onOk={submitAddBook}
          confirmLoading={adding}
          onCancel={() => setAddModalVisible(false)}
          okText="Add Book"
        >
          <Form
            form={addForm}
            layout="vertical"
            name="addBookForm"
            initialValues={{ publishedYear: new Date().getFullYear() }}
          >
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input placeholder="e.g. Clean Code" />
            </Form.Item>
            <Form.Item label="Author" name="authorName" rules={[{ required: true, message: 'Please enter the author' }]}>
              <Input placeholder="e.g. Robert C. Martin" />
            </Form.Item>
            <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: 'Please enter ISBN' }]}>
              <Input placeholder="e.g. 978-0132350884" />
            </Form.Item>
            <Form.Item
              label="Published Year"
              name="publishedYear"
              rules={[{ required: true, message: 'Please enter published year' }]}
            >
              <InputNumber min={0} max={9999} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Cover Image URL" name="coverImageUrl">
              <Input placeholder="https://..." />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} placeholder="Short description (optional)" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Book */}
        <Modal
          open={editModalVisible}
          title={`Edit Book${editingBook ? `: ${editingBook.title}` : ''}`}
          onOk={submitEditBook}
          confirmLoading={editing}
          onCancel={() => setEditModalVisible(false)}
          okText="Save Changes"
        >
          <Form form={editForm} layout="vertical" name="editBookForm">
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Author" name="authorName" rules={[{ required: true, message: 'Please enter the author' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="ISBN" name="isbn" rules={[{ required: true, message: 'Please enter ISBN' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Published Year"
              name="publishedYear"
              rules={[{ required: true, message: 'Please enter published year' }]}
            >
              <InputNumber min={0} max={9999} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Cover Image URL" name="coverImageUrl">
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Delete confirm */}
        <Modal
          open={deleteConfirm.visible}
          title="Delete Book"
          onOk={confirmDelete}
          okButtonProps={{ danger: true, loading: deleting }}
          onCancel={() => setDeleteConfirm({ visible: false, book: null })}
          okText="Delete"
          cancelText="Cancel"
        >
          {deleteConfirm.book
            ? <>Are you sure you want to delete <strong>{deleteConfirm.book.title}</strong>?</>
            : 'Are you sure you want to delete this book?'}
        </Modal>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AllBooksPage;
