import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService.ts';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { nickname: string; password: string }) => {
      await authService.register(values.nickname, values.password).then((result) => {
        message.success(result.data);
        navigate('/'); // Перенаправление на страницу логина
      }).catch((error) => {
        //message.error('Ошибка регистрации. Попробуйте снова.');
        message.error(error.message);
      })
  };

  return (
    <Form
      name="register"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: '0 auto', padding: '20px',
        border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <h2 style={{ textAlign: 'center' }}>Регистрация</h2>

      <Form.Item
        label="Никнейм"
        name="nickname"
        rules={[{ required: true, message: 'Введите никнейм!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Подтвердите пароль"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Подтвердите пароль!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;