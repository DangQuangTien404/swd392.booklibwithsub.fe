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

  // Info modal
  const [info, setInfo] = useState({ visible: false, title: '', content: '' });
  const closeInfo = () => setInfo({ visible: false, title: '', content: '' });

  // Add
  const [addVisible, setAddVisible] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addForm] = Form.useForm();

  // Edit
  const [editVisible, setEditVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm] = Form.useForm();
  const [editingBook, setEditingBook] = useState(null);

  // Delete
  const [del, setDel] = useState({ visible: false, book: null });
  const [deleting, setDeleting] = useState(false);

  async function refresh() {
    try {
      const list = await getBooksSorted();
      setBooks(list);
    } catch {
      setBooks([]);
    }
  }
  useEffect(() => { refresh(); }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const paginated = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // ---------- Add ----------
  const openAdd = () => {
    addForm.resetFields();
    addForm.setFieldsValue({
      publishedYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1
    });
    setAddVisible(true);
  };

  const submitAdd = async () => {
    try {
      const values = await addForm.validateFields();
      await addBook(values);
      setAddVisible(false);
      setInfo({ visible: true, title: 'Book Added', content: 'The book has been added successfully.' });
      await refresh();
    } catch (err) {
      if (err?.isAxiosError) {
        const msg = err.response?.data?.message || 'There was a problem adding the book.';
        setInfo({ visible: true, title: 'Add Failed', content: msg });
      }
    } finally {
      setAdding(false);
    }
  };

  // Keep availableCopies ≤ totalCopies
  const addOnValuesChange = (_, all) => {
    const t = Number(all.totalCopies ?? 0);
    const a = Number(all.availableCopies ?? 0);
    if (!Number.isNaN(t) && !Number.isNaN(a) && a > t) {
      addForm.setFieldsValue({ availableCopies: t });
    }
  };

  // ---------- Edit ----------
  const openEdit = (book) => {
    setEditingBook(book);
    editForm.setFieldsValue({
      title: book.title,
      authorName: book.authorName,
      isbn: book.isbn,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      coverImageUrl: book.coverImageUrl,
    });
    setEditVisible(true);
  };

  const submitEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await updateBook(editingBook.id, values);
      setEditVisible(false);
      setInfo({ visible: true, title: 'Book Updated', content: 'The book has been updated successfully.' });
      await refresh();
    } catch (err) {
      if (err?.isAxiosError) {
        const status = err.response?.status;
        const msg = err.response?.data?.message;
        // BE returns 409 for ISBN conflict — show clearly
        setInfo({
          visible: true,
          title: status === 409 ? 'ISBN Conflict' : 'Update Failed',
          content: msg || 'There was a problem updating the book.'
        });
      }
    } finally {
      setEditing(false);
    }
  };

  const editOnValuesChange = (_, all) => {
    const t = Number(all.totalCopies ?? 0);
    const a = Number(all.availableCopies ?? 0);
    if (!Number.isNaN(t) && !Number.isNaN(a) && a > t) {
      editForm.setFieldsValue({ availableCopies: t });
    }
  };

  // ---------- Delete ----------
  const openDelete = (book) => setDel({ visible: true, book });
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteBook(del.book.id);
      setDel({ visible: false, book: null });
      setInfo({ visible: true, title: 'Book Removed', content: 'The book has been deleted.' });
      await refresh();
    } catch (err) {
      const msg = err?.response?.data?.message || 'There was a problem deleting the book.';
      setInfo({ visible: true, title: 'Delete Failed', content: msg });
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
          <Button type="primary" onClick={openAdd}>+ Add Book</Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row gutter={[24, 24]} className="AllBooksPage-row" justify="center">
            {paginated.map((b) => (
              <Col key={b.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <div className="book-card">
                  <Link to={`/books/${b.id}`} className="book-card-link">
                    {b.coverImageUrl ? (
                      <img src={b.coverImageUrl} alt={b.title} className="img-center" />
                    ) : (
                      <div className="img-not-found">Image not found</div>
                    )}
                    <h3>{b.title}</h3>
                    <p><strong>Author:</strong> {b.authorName}</p>
                    <p><strong>Publisher:</strong> {b.publisher || '-'}</p>
                    <p><strong>Published Year:</strong> {b.publishedYear}</p>
                    <p><strong>Copies:</strong> {b.availableCopies}/{b.totalCopies}</p>
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Space>
                      <Button size="small" onClick={() => openEdit(b)}>Edit</Button>
                      <Button size="small" danger onClick={() => openDelete(b)}>Delete</Button>
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

        {/* Info */}
        <Modal
          open={info.visible}
          title={info.title}
          onOk={closeInfo}
          onCancel={closeInfo}
          footer={[
            <Button key="ok" type="primary" onClick={closeInfo}>OK</Button>,
          ]}
        >
          {info.content}
        </Modal>

        {/* Add */}
        <Modal
          open={addVisible}
          title="Add New Book"
          onOk={submitAdd}
          confirmLoading={adding}
          onCancel={() => setAddVisible(false)}
          okText="Add Book"
        >
          <Form
            form={addForm}
            layout="vertical"
            name="addBookForm"
            onValuesChange={addOnValuesChange}
            initialValues={{
              publishedYear: new Date().getFullYear(),
              totalCopies: 1,
              availableCopies: 1
            }}
          >
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
              <Input placeholder="https://..." />
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit */}
        <Modal
          open={editVisible}
          title={`Edit Book${editingBook ? `: ${editingBook.title}` : ''}`}
          onOk={submitEdit}
          confirmLoading={editing}
          onCancel={() => setEditVisible(false)}
          okText="Save Changes"
        >
          <Form form={editForm} layout="vertical" name="editBookForm" onValuesChange={editOnValuesChange}>
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

        {/* Delete */}
        <Modal
          open={del.visible}
          title="Delete Book"
          onOk={confirmDelete}
          okButtonProps={{ danger: true, loading: deleting }}
          onCancel={() => setDel({ visible: false, book: null })}
          okText="Delete"
          cancelText="Cancel"
        >
          {del.book ? <>Are you sure you want to delete <strong>{del.book.title}</strong>?</> : 'Delete this book?'}
        </Modal>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#333', color: 'white' }}>
        &copy; 2025 BookLib. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AllBooksPage;
