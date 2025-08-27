import React, { useState, useEffect } from "react";
import { Table, Tag, Spin, message, Select, Modal, Button } from "antd";
import { fetchAllLoans } from "../../api/loans";

const { Option } = Select;

export default function LoansAdminTab() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalItems, setModalItems] = useState([]);
  const [modalLoanId, setModalLoanId] = useState(null);

  const loadLoans = async (statusFilter) => {
    setLoading(true);
    try {
      const data = await fetchAllLoans(statusFilter);
      setLoans(data);
    } catch (e) {
      message.error("Failed to load loans.");
      setLoans([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLoans(status);
  }, [status]);


  const itemColumns = [
    { title: "Title", dataIndex: "bookTitle", key: "bookTitle", render: (t, r) => <b>{t || r.bookId}</b> },
    { title: "Book ID", dataIndex: "bookId", key: "bookId" },
    { title: "Due", dataIndex: "dueDate", key: "dueDate", render: d => new Date(d).toLocaleDateString() },
    { title: "Returned", dataIndex: "returnedDate", key: "returnedDate", render: d => d ? new Date(d).toLocaleDateString() : '-' },
    { title: "Status", dataIndex: "status", key: "status", render: s => (
      <Tag color={s === "Returned" ? "green" : "orange"}>{s}</Tag>
    )},
  ];

  const columns = [
    { title: "Loan ID", dataIndex: "loanId", key: "loanId" },
    { title: "User", dataIndex: "displayName", key: "displayName" },
    { title: "Username", dataIndex: "userName", key: "userName" },
    { title: "Subscription ID", dataIndex: "subscriptionId", key: "subscriptionId" },
    { title: "Loan Date", dataIndex: "loanDate", key: "loanDate", render: d => new Date(d).toLocaleString() },
    { title: "Return Date", dataIndex: "returnDate", key: "returnDate", render: d => d ? new Date(d).toLocaleString() : "-" },
    { title: "Status", dataIndex: "status", key: "status", render: s => <Tag color={s === "Returned" ? "green" : s === "Borrowed" ? "orange" : "default"}>{s}</Tag> },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setModalItems(record.items);
            setModalLoanId(record.loanId);
            setModalVisible(true);
          }}
        >View Items</Button>
      )
    }
  ];

  return (
    <div>
      <h2>All Loans (Admin View)</h2>
      <div style={{ marginBottom: 16 }}>
        <span>Status Filter: </span>
        <Select
          style={{ width: 150 }}
          allowClear
          placeholder="All"
          value={status}
          onChange={setStatus}
        >
          <Option value="Borrowed">Borrowed</Option>
          <Option value="Returned">Returned</Option>
        </Select>
      </div>
      {loading
        ? <Spin tip="Loading loans..." />
        : <Table
            rowKey="loanId"
            columns={columns}
            dataSource={loans}
            bordered
            pagination={{ pageSize: 10 }}
          />
      }
      <Modal
        title={`Loan Items${modalLoanId ? ` (Loan ID: ${modalLoanId})` : ""}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Table
          columns={itemColumns}
          dataSource={modalItems}
          rowKey="loanItemId"
          pagination={false}
          bordered
          size="small"
        />
      </Modal>
    </div>
  );
}