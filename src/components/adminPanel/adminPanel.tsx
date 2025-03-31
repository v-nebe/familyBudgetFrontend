import React, { useState } from "react";
import { Tabs } from "antd";
import UsersTab from "./components/user/user.tsx";
import CategoryTab from "./components/category/category.tsx";
import TransactionTab from "./components/transaction/transaction.tsx";
import Header from '../header/header.tsx';
import './adminPanel.css'


const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("users");

  const tabItems = [
    {
      key: "users",
      label: "Пользователи",
      children: <UsersTab />,
    },
    {
      key: "categories",
      label: "Категории",
      children: <CategoryTab />,
    },
    {
      key: "transactions",
      label: "Транзакции",
      children: <TransactionTab />,
    },
  ];

  return(
    <>
      <Header />
      <h2>Административная панель</h2>
      <Tabs tabPosition='left' activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </>
  )

};


export default AdminPanel;