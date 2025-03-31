import React from 'react';
import { authService } from "./services/authService.ts";
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userService } from './services/userService.ts';

const Login: React.FC = () => {
  const navigate = useNavigate();

  type FieldType = {
    username: string;
    password: string;
  };

  // Обработчик успешной отправки формы
  const onFinish = async (values: FieldType) => {
    await authService.login({nickname: values.username, password: values.password}).then(async (response) => {
      sessionStorage.setItem("username", values.username);
      sessionStorage.setItem("password", values.password);
      message.success(response.data);
      await userService.getUser(undefined, values.username).then((response) => {
        sessionStorage.setItem("role", response.data.role);
      });
      navigate('/categorylist');
    })
      .catch((error) => {
      //message.error('Invalid username or password');
      message.error(error.message);
    })
  };

  // Обработчик ошибки валидации
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="loginForm"
      style={{ maxWidth: 400, margin: '0 auto', padding: '20px',
        border: '1px solid #ddd', borderRadius: '8px' }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
      autoComplete="off"
      requiredMark={false}
    >
      <h2 style={{ textAlign: 'center' }}>Авторизация</h2>

      <Form.Item<FieldType>
        label="Логин"
        name="username"
        rules={[{ required: true, message: 'Пожалуйста введите свой логин!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Пожалуйста введите свой пароль!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{width:'100%'}}>
          Войти
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={() => navigate('/register')} style={{width:'100%'}}>
          Зарегистрироваться
        </Button>
      </Form.Item>

    </Form>
  );
};

export default Login;
