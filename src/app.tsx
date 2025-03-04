
import { Route, Routes } from "react-router-dom";
import Register from "./register.tsx";
import Login from './login.tsx';
import React from 'react';
import CategoryList from './components/categoryList/categoryList.tsx';
import UserSettings from './components/userSettings/userSettings.tsx';
import AdminPanel from './components/adminPanel/adminPanel.tsx';
import TransactionList from './components/transactionList/transactionList.tsx';
import ResultTransactionList from './components/resultTransactions/resultTransactions.tsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/categorylist" element={<CategoryList />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/result" element={<ResultTransactionList />} />
      </Routes>
    </div>
  );
}

export default App;
