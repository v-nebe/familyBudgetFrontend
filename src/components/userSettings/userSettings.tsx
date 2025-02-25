import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService.ts";
import { Button, Form, FormProps, Input } from 'antd';
import Header from '../header/header.tsx';
import { useNavigate } from 'react-router-dom';


const UserSettings: React.FC = () => {
  const [user, setUser] = useState<userData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await userService.getUserById(1);
      setUser(response.data);
      setOldPassword(response.data.password);
    } catch (err) {
      setError("Не удалось загрузить пользователя");
    } finally {
      setLoading(false);
    }
  };



  const onFinish: FormProps<FieldType>['onFinish'] = async ({ username, password2 }) => {
    try {
          await userService.updateUser({ 'iduser': user?.iduser, 'nickname' : username, 'password': password2, 'role': user?.role });
          sessionStorage.setItem("password", password2);
          navigate('/categorylist')// Обновляем список категорий
        } catch (error) {
          setError("Ошибка при обновлении пользователя");
        }
      };


  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // const handleSave = async () => {
  //   try {
  //     await userService.updateUser(user);
  //     message.success("Категория добавлена!");
  //     loadCategories(); // Обновляем список категорий
  //   } catch (error) {
  //     message.error("Ошибка при добавлении категории!");
  //   }
  // };


  return (
    <>
      <Header />
    <div>
      <div className='table_name'>
      <h2>Пользователь</h2>
  </div>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="username"
            initialValue={user?.nickname}
            rules={[{ required: true, message: 'Поле не может быть пустым' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Old password"
            name="password"
            rules={[{ required: true, message: 'Поле не может быть пустым' },
              () => ({
                validator(_, value) {
                  if (!value || oldPassword === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Неверный пароль'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="New password" name="password2" rules={[{ required: true, message: 'Поле не может быть пустым' }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="password3"
            dependencies={['password2']}
            rules={[
              {
                required: true, message: 'Поле не может быть пустым'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password2') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароль не совпадает'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
  </div>
  </>
);
};

interface FieldType {
  username: string;
  password: string;
  password2: string;
  password3: string;
}

interface userData {
  key: number;
  iduser: number;
  nickname: string;
  password: string;
  role: string;
}

export default UserSettings;
