import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  DatePickerProps,
  DatePicker,
  Checkbox,
  CheckboxProps,
  Select,
  SelectProps
} from 'antd';
import { transactionService } from "../../services/transactionService.ts";
import Header from '../header/header.tsx';
import dayjs from "dayjs";

const { Option } = Select;

const ResultTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateString, setDateString] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [checked, setChecked] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string | undefined>();

  useEffect(() => {
    loadTransactions();
  }, [dateString]);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      let data = response.data;
      data = data.filter((t: {user: { nickname: string }}) => t.user.nickname === sessionStorage.getItem('username'));
      if (typeof dateString === 'string') {
        data = data.filter((t: { date: string }) => t.date.includes(dateString));
      } else {
        data = data.filter((t: { date: string }) => t.date.includes((new Date().getMonth() + 1).toString()));
      }


      setTransactions(data);
    } catch (error) {
      message.error("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'idtransaction', key: 'idtransaction' },
    {
      title: 'Пользователь',
      dataIndex: 'user',
      key: 'user',
      render: (user: userData) => user?.nickname || 'Неизвестно',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      render: (category: categoryData) =>
        category?.categoryname || 'Не указано',
    },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount' },
    { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
  ];


  const onChange: DatePickerProps['onChange'] = (_date, dateString) => {
    setDateString(dateString as string);
  };

  const onChangeCheckbox: CheckboxProps['onChange'] = (e) => {
    setChecked(e.target.checked);
  }

  const onChangeSelect: SelectProps['onChange'] = (e: string) => {
    setCurrency(e);
  }

  console.log(currency);

  const loadFile = async () => {
      const nickname = sessionStorage.getItem('username');
      try {
        const response = await fetch(`http://localhost:8080/api/report/download?nickname=${nickname}&date=${dateString}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        const blob = await response.blob(); // Преобразуем тело ответа в Blob (файл)
        const url = window.URL.createObjectURL(blob); // Создаем URL для скачивания

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "transactions.docx"); // Имя файла
        document.body.appendChild(link);
        link.click(); // Автоматически запускаем скачивание
        document.body.removeChild(link);
      } catch (error) {
        console.error("Ошибка скачивания:", error);
      }
  };

  return (
    <>
      <Header />
      <h2>Результирующая таблица</h2>
      <DatePicker onChange={onChange} picker="month" defaultValue={dayjs(new Date())} allowClear={false} />
      <Checkbox style={{marginLeft: '10px'}} onChange={onChangeCheckbox}>Конвертировать</Checkbox>
      {checked && (
        <Select defaultValue={'BYN'} onChange={onChangeSelect}>
          <Option value="BYN">BYN</Option>
          <Option value="USD">USD</Option>
          <Option value="EUR">EUR</Option>
        </Select>
      )}
      <Button onClick={loadFile} style={{padding: '5px', marginBottom: '10px', marginLeft: 'auto', display: 'block'}}>Скачать файл</Button>
      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        rowKey="idtransaction"
      />
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
  type: string;
}

export default ResultTransactionList;
