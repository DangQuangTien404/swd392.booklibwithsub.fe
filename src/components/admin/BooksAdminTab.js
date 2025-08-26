import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import {
  getBooksSorted,
  addBook,
  updateBook,
  deleteBook,
} from '../../api/books';

function BooksAdminTab() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();


  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getBooksSorted();
      setBooks(data);
    } catch (err) {
      message.error('Failed to load books.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };


  const openModal = (book = null) => {
    setEditingBook(book);
    setModalVisible(true);
    if (book) {
      form.setFieldsValue(book);
    } else {
      form.resetFields();
    }
  };


  const closeModal = () => {
    setModalVisible(false);
    setEditingBook(null);
    form.resetFields();
  };


  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBook) {
        await updateBook(editingBook.id, values);
        message.success('Book updated successfully!');
      } else {
        await addBook(values);
        message.success('Book added successfully!');
      }
      closeModal();
      loadBooks();
    } catch (err) {
      message.error('Failed to save book. Check your input and try again.');
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      message.success('Book deleted.');
      loadBooks();
    } catch (err) {
      message.error('Failed to delete book.');
    }
  };


  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'authorName', key: 'authorName' },
    { title: 'Published Year', dataIndex: 'publishedYear', key: 'publishedYear' },
    { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
    { title: 'Available Copies', dataIndex: 'availableCopies', key: 'availableCopies' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(record)} type="link">Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this book?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Books Management</h2>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add New Book
      </Button>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        open={modalVisible}
        title={editingBook ? 'Edit Book' : 'Add Book'}
        onCancel={closeModal}
        onOk={handleFormSubmit}
        okText={editingBook ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter the title.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Author"
            name="authorName"
            rules={[{ required: true, message: 'Please enter the author.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Published Year"
            name="publishedYear"
            rules={[{ required: true, message: 'Please enter the published year.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ISBN"
            name="isbn"
            rules={[{ required: true, message: 'Please enter the ISBN.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Available Copies"
            name="availableCopies"
            rules={[{ required: true, message: 'Please enter the number of copies.' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            label="Cover Image URL"
            name="coverImageUrl"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BooksAdminTab;