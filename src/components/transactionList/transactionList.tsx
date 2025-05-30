import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { transactionService } from '../../services/transactionService.ts';
import { userService } from '../../services/userService.ts';
import { categoryService } from '../../services/categoryService.ts';
import { Button, DatePicker, Form, Input, message, Modal, Select, Table } from 'antd';
import Header from '../header/header.tsx';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const categoryType = searchParams.get("type");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<userData | null>(null);
  const [category, setCategory] = useState<categoryData | null>(null);
  const [editUser, setEditUser] = useState<userData | null>(null);
  const [form] = Form.useForm();

  const [selectedTransaction, setSelectedTransaction] = useState<transactionData | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadTransactions();
  }, [categoryId, categoryType]);

  useEffect(() => {
    loadUser();
    loadCategory();
  }, [categoryId]);

  useEffect(() => {
    if (user && category) {
      form.setFieldsValue({
        iduser: user.iduser,
        idcategory: category.idcategory,
      });
    }
  }, [user, category, form]);


  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      let data = response.data;
      data = data.filter((t: {user: { nickname: string }}) => t.user.nickname === sessionStorage.getItem('username'));

      if (categoryId) {
        data = data.filter(
          (t: { category: { idcategory: number } }) =>
            t.category.idcategory.toString() === categoryId
        );
      }

      setTransactions(data);
    } catch (error) {
      message.error("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const username = sessionStorage.getItem("username");
      if (!username) return;

      const response = await userService.getUser(undefined, username);
      setUser(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке пользователя");
    }
  };

  const loadCategory = async () => {
    try {
      const response = await categoryService.getAllCategories();
      let data = response.data;
      if (categoryId) {
        data = data.filter((c: { idcategory: number }) => c.idcategory.toString() === categoryId);
      }

      setCategory(data.length ? data[0] : null);
    } catch (error) {
      message.error("Ошибка при загрузке категорий");
    }
  };

  const showEditModal = async (record: transactionData) => {
    setSelectedTransaction(record);
    setIsEditModalOpen(true);

    try {
      const response = await userService.getUser(record.user.iduser);
      setEditUser(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке данных пользователя");
    }
  };

  // Сохранение отредактированной категории
  const handleEditTransaction = async (values: any) => {
    try {
      const transactionData = {
        idtransaction: values.idtransaction,
        user: { iduser: editUser?.iduser },
        category: { idcategory: category?.idcategory },
        currency: values.currency,
        amount: Math.abs(values.amount).toString(),
        date: values.date.format("YYYY-MM-DD"),
      };

      await transactionService.updateTransaction(transactionData);
      message.success("Транзакция обновлена!");
      setIsEditModalOpen(false);
      form.resetFields();
      loadTransactions();
    } catch (error) {
      message.error("Ошибка при добавлении транзакции");
    }
  };

  const columns = [
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
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: transactionData) => (
        <>
          <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            <EditOutlined />
          </Button>
          {/*<Button onClick={() => deleteCategory(record.idcategory)} danger>*/}
          {/*  <DeleteOutlined />*/}
          {/*</Button>*/}
        </>
      ),
    },
  ];

  const handleAddTransaction = async (values: any) => {
    try {
      let transactionData;
      if (categoryType === "Расход") {
        transactionData = {
          user: { iduser: user?.iduser },
          category: { idcategory: category?.idcategory },
          currency: values.currency,
          amount: values.amount,
          date: values.date.format("YYYY-MM-DD"),
        }
      } else {
        transactionData = {
          user: { iduser: user?.iduser },
          category: { idcategory: category?.idcategory },
          currency: values.currency,
          amount: values.amount,
          date: values.date.format("YYYY-MM-DD"),
        };
      }

      await transactionService.addTransaction(transactionData);
      message.success("Транзакция добавлена!");
      setIsModalOpen(false);
      form.resetFields();
      loadTransactions();
    } catch (error) {
      message.error("Ошибка при добавлении транзакции");
    }
  };

  interface userData {
    iduser: number;
    nickname: string;
  }

  interface categoryData {
    idcategory: number;
    categoryname: string;
  }

  interface transactionData {
    idtransaction: number,
    user: userData,
    category: categoryData,
    currency: string,
    amount: string,
    date: string,
  }

  return (
    <>
      <Header />
      <div className="table_name">
        <h2>Список транзакций</h2>
        <Button
          className="add_button"
          onClick={() => setIsModalOpen(true)}
          icon={<PlusOutlined />}
          style={{ padding: '5px' }}
        >
          Добавить транзакцию
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="idtransaction"
      />

      <Modal
        title="Добавить транзакцию"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTransaction}
          requiredMark={false}
        >
          <Form.Item
            label="Сумма"
            name="amount"
            rules={[{ required: true, message: 'Введите сумму' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Валюта"
            name="currency"
            rules={[{ required: true, message: 'Выберите валюту' }]}
          >
            <Select>
              <Option value="BYN">BYN</Option>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Пользователь" name="iduser">
            <Select disabled>
              {user && (
                <Option key={user.iduser} value={user.iduser}>
                  {user.nickname}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Категория" name="idcategory">
            <Select disabled>
              {category && (
                <Option key={category.idcategory} value={category.idcategory}>
                  {category.categoryname}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              picker="date"
              defaultValue={dayjs(new Date())}
              allowClear={false}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => setIsModalOpen(false)}
            >
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Редактирование транзакции"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        afterOpenChange={(open: any) => {
          if (open && selectedTransaction) {
            form.setFieldsValue({
              idtransaction: selectedTransaction.idtransaction,
              amount: selectedTransaction.amount,
              currency: selectedTransaction.currency,
              iduser: selectedTransaction.user.iduser,
              idcategory: selectedTransaction.category.idcategory,
              date: selectedTransaction.date
                ? dayjs(selectedTransaction.date)
                : null,
            });
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditTransaction}
          requiredMark={false}
        >
          <Form.Item
            label="id"
            name="idtransaction"
            rules={[{ required: true }]}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="Сумма"
            name="amount"
            rules={[{ required: true, message: 'Введите сумму' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Валюта"
            name="currency"
            rules={[{ required: true, message: 'Выберите валюту' }]}
          >
            <Select>
              <Option value="BYN">BYN</Option>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Пользователь" name="iduser">
            <Select disabled>
              {editUser && (
                <Option key={editUser.iduser} value={editUser.iduser}>
                  {editUser.nickname}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Категория" name="idcategory">
            <Select disabled>
              {category && (
                <Option key={category.idcategory} value={category.idcategory}>
                  {category.categoryname}
                </Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            label="Дата"
            name="date"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
              picker="date"
              allowClear={false}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => setIsEditModalOpen(false)}
            >
              Отмена
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TransactionList;