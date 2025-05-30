import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Button,
  DatePicker,
  Checkbox,
  Select, DatePickerProps
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
  const [fileType, setFileType] = useState<string>("application/pdf");

  useEffect(() => {
    loadTransactions();
  }, [dateString]);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      let data = response.data;
      const username = sessionStorage.getItem('username');
      data = data.filter((t: { user: { nickname: string } }) => t.user.nickname === username);

      data = data.filter((t: { date: string }) => t.date.includes(dateString));
      setTransactions(data);
    } catch (error) {
      message.error("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
    }
  };

  const onChange: DatePickerProps['onChange'] = (
    _date: any,
    dateString: string,
  ) => {
    setDateString(dateString);
  };

  const onChangeCheckbox = (e: any) => {
    setChecked(e.target.checked);
  };

  const onChangeSelect = (value: string) => {
    setCurrency(value);
  };

  const onChangeSelectFileType = (value: string) => {
    setFileType(value);
  };

  const loadFile = async () => {
    const nickname = sessionStorage.getItem('username');

    const extensionMap: { [key: string]: string } = {
      "application/pdf": "pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx"
    };

    const fileExtension = extensionMap[fileType] || "pdf";

    try {
      const response = await fetch(`http://localhost:8080/api/report/download?nickname=${nickname}&date=${dateString}&currency=${currency || ''}`, {
        method: "GET",
        headers: {
          'Accept': fileType,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка скачивания:", error);
      message.error("Не удалось скачать файл");
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
      render: (category: categoryData) => category?.categoryname || 'Не указано',
    },
    { title: 'Сумма', dataIndex: 'amount', key: 'amount' },
    { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
    { title: 'Дата', dataIndex: 'date', key: 'date' },
  ];

  return (
    <>
      <Header />
      <h2>Результирующая таблица</h2>
      <DatePicker
        onChange={onChange}
        picker="month"
        defaultValue={dayjs(new Date())}
        allowClear={false}
      />
      <Select onChange={onChangeSelectFileType} value={fileType} style={{ marginLeft: 10, width: 150 }}>
        <Option value="application/pdf">PDF</Option>
        <Option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</Option>
        <Option value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">XLSX</Option>
      </Select>
      <Checkbox style={{ marginLeft: '10px' }} onChange={onChangeCheckbox}>Конвертировать</Checkbox>
      {checked && (
        <Select onChange={onChangeSelect} value={currency} placeholder="Выберите валюту" style={{ marginLeft: 10, width: 120 }}>
          <Option value="BYN">BYN</Option>
          <Option value="USD">USD</Option>
          <Option value="EUR">EUR</Option>
        </Select>
      )}
      <Button
        onClick={loadFile}
        style={{ padding: '5px', marginBottom: '10px', marginLeft: 'auto', display: 'block' }}
      >
        Скачать файл
      </Button>
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