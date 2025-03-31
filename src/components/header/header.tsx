import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Header.css";
import {
  DollarOutlined,
  EuroOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Carousel, message } from 'antd';
import { transactionService } from '../../services/transactionService.ts';

const Header = () => {
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [eurRate, setEurRate] = useState<number | null>(null);

  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("role");

  useEffect(() => {
    getCurrency();
  }, []);

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

  const getCurrency = async () => {
    try {
      const response = await transactionService.getCurrency();
      let data = response.data;
      setEurRate(data.EUR);
      setUsdRate(data.USD);
    } catch (error) {
      message.error("Ошибка при загрузке курса валют");
    }
  }

  return (
    <header className="header">
      <nav className="navbar">
        <Button onClick={goToMainpage} className='home-button'>
          <HomeOutlined style={{ fontSize: '30px', color: '#8c', verticalAlign: 'middle' }} />
          <span>Главная</span>
        </Button>
        <Carousel autoplay dots={false} className='currency-info'>
          <div className="currency">
            <DollarOutlined /> {usdRate ? `${usdRate} BYN` : "—"}
          </div>
          <div className="currency">
            <EuroOutlined /> {eurRate ? `${eurRate} BYN` : "—"}
          </div>
        </Carousel>
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
