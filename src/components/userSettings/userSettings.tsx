import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService.ts";
import { Button, Form, FormProps, Input, message } from 'antd';
import Header from '../header/header.tsx';
import { useNavigate } from 'react-router-dom';


const UserSettings: React.FC = () => {
  const [user, setUser] = useState<userData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUser(sessionStorage.getItem("username") as string);
  }, []);

  const loadUser = async (nickname: string) => {
    try {
      const response = await userService.getUser(undefined, nickname);
      setUser(response.data);
      setOldPassword(response.data.password);

    } catch (err) {
      setError('Не удалось загрузить пользователя');
    } finally {
      setLoading(false);
    }
  };



  const onFinish: FormProps<FieldType>['onFinish'] = async ({ username, password2 }) => {
    try {
          await userService.updateUser(sessionStorage.getItem("username"), { 'nickname': username, 'password': password2, 'role': user?.role });
          message.success("Данные обновлены");
          sessionStorage.setItem("password", password2);
          sessionStorage.setItem("username", username);
          navigate("/categorylist");
        } catch (error) {
          message.error("Ошибка при обновлении пользователя");
        }
      };


  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <>
      <Header />
        <h2 style={{textAlign: 'center'}}>Пользователь</h2>
      <div>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          style={{ maxWidth: 400, margin: '0 auto', padding: '20px',
            border: '1px solid #ddd', borderRadius: '8px' }}
          requiredMark={false}
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

          <Form.Item label="New password" name="password2" rules={[{ required: true, message: 'Поле не может быть пустым'}]}>
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
            <Button onClick={() => navigate(-1)} color="danger" variant="outlined" style={{marginRight: '8px'}}>Отмена</Button>
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
