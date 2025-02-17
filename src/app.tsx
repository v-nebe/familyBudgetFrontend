
import { Route, Routes } from "react-router-dom";
import Register from "./register.tsx";
import Login from './login.tsx';
import React from 'react';
import UserList from './userList.tsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/userlist" element={<UserList />} />
      </Routes>
    </div>
  );
}

export default App;
