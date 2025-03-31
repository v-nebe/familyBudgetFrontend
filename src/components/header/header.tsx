import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { HomeOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const Header = () => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    sessionStorage.removeItem("role");
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  const goToMainpage = () => {
    navigate("/categorylist");
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Button onClick={goToMainpage} className='home-button'>
          <HomeOutlined style={{ fontSize: '30px', color: '#8c', verticalAlign: 'middle' }} />
          <span>Главная</span>
        </Button>
        {userRole === "ROLE_ADMIN" && ( // Проверяем роль перед рендером кнопки
          <Button onClick={goToAdmin} className="admin-button">
            <span>Администратор</span>
            <UserOutlined style={{ fontSize: '30px', color: '#8c', verticalAlign: 'middle' }} />
          </Button>
        )}
        <Button onClick={goToSettings} className="settings-button">
          <span>Настройки</span>
          <SettingOutlined  style={{ fontSize: '30px', color: '#8c', verticalAlign: 'middle' }} />
        </Button>
        <Button onClick={handleLogout} className="logout-button">
          <span>Выход</span>
          <LogoutOutlined style={{ fontSize: '30px', color: '#8c', verticalAlign: 'middle' }} />
        </Button>
      </nav>
    </header>
  );
};

export default Header;
