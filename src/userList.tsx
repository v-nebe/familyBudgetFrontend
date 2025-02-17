import React, { useEffect, useState } from "react";
import { userService } from "./services/userService.ts";
import { Table } from "antd";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<userData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "key",
      title: 'ID',
      dataIndex: 'id',
    },
    {
      key: "key",
      title: 'Nickname',
      dataIndex: 'nickname',
    },
    {
      key: "key",
      title: 'Role',
      dataIndex: 'role',
    },
  ];

  const dataSource = users.map((user: userData) => ({
    key: user.iduser,
    id: user.iduser,
    nickname: user.nickname,
    role: user.role
    })
  );

  return (
    <div>
      <h2>Список пользователей</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
      <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Table dataSource={dataSource} columns={columns} />
      )}
    </div>
  );
};

interface userData {
  key: number;
  iduser: number;
  nickname: string;
  password: string;
  role: string;
}

export default UserList;
