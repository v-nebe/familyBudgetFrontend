import React, { useEffect, useState } from "react";
import { Table, message, Button } from 'antd';
import { transactionService } from "../../services/transactionService.ts";
import Header from '../header/header.tsx';

const ResultTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      let data = response.data;
      data = data.filter((t: {user: { nickname: string }}) => t.user.nickname === sessionStorage.getItem('username'));
      data = data.filter((t: {date: string})=> t.date.includes((new Date().getMonth() + 1).toString()));

      setTransactions(data);
    } catch (error) {
      message.error("Ошибка при загрузке транзакций");
    } finally {
      setLoading(false);
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

  const loadFile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/word/download", {
          method: "GET",
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        if (!response.ok) {
          throw new Error("Ошибка при скачивании файла");
        }

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
}

export default ResultTransactionList;
