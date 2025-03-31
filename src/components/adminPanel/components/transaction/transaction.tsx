import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Form, Input, Select, DatePicker } from "antd";
import { transactionService } from "../../../../services/transactionService.ts";
import { userService } from "../../../../services/userService.ts";
import { categoryService } from "../../../../services/categoryService.ts";
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const TransactionTab: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<userData[]>([]);
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadTransactions();
    loadUsers();
    loadCategories();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке пользователей");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке категорий");
    }
  };

  const handleAddTransaction = async (values: any) => {
    try {
      const transactionData = {
        user: { iduser: values.iduser },
        category: { idcategory: values.idcategory },
        currency: values.currency,
        amount: values.amount,
        date: values.date.format("YYYY-MM-DD"),
      };

      await transactionService.addTransaction(transactionData);
      message.success("Транзакция добавлена!");
      setIsModalOpen(false);
      form.resetFields();
      loadTransactions();
    } catch (error) {
      message.error("Ошибка при добавлении транзакции");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "idtransaction", key: "idtransaction" },
    {
      title: "Пользователь",
      dataIndex: "user",
      key: "user",
      render: (user: userData) => user?.nickname || "Неизвестно",
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      render: (category: categoryData) => category?.categoryname || "Не указано",
    },
    { title: "Сумма", dataIndex: "amount", key: "amount" },
    { title: "Валюта", dataIndex: "currency", key: "currency" },
    { title: "Дата", dataIndex: "date", key: "date" },
  ];

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        icon={<PlusOutlined style={{marginRight: '8px'}}/>} style={{padding: '5px', marginBottom: '10px', marginLeft: 'auto', display: 'block'}}
      >
        Добавить транзакцию
      </Button>

      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="idtransaction"
      />

      {/* Модальное окно для добавления транзакции */}
      <Modal
        title="Добавить транзакцию"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTransaction}>
          <Form.Item
            label="Сумма"
            name="amount"
            rules={[{ required: true, message: "Введите сумму" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Валюта"
            name="currency"
            rules={[{ required: true, message: "Выберите валюту" }]}
          >
            <Select>
              <Option value="BYN">BYN</Option>
              <Option value="USD">USD</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Пользователь"
            name="iduser"
            rules={[{ required: true, message: "Выберите пользователя" }]}
          >
            <Select>
              {users.map((user) => (
                <Option key={user.iduser} value={user.iduser}>
                  {user.nickname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Категория"
            name="idcategory"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
            <Select>
              {categories.map((category) => (
                <Option key={category.idcategory} value={category.idcategory}>
                  {category.categoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: "Выберите дату" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

interface userData {
  iduser: number;
  nickname: string;
}

interface categoryData {
  idcategory: number;
  categoryname: string;
}

export default TransactionTab;
