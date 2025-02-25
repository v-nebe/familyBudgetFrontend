import React from 'react';
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("password");
    navigate("/");
  };

  const goToSettings = () => {
    navigate("/settings");
  };

  return (
    <header className="header">
      <nav className="navbar">
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
