import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Select } from 'antd';
import { userService } from "../../../../services/userService.ts";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const UsersTab: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editedUser, setEditedUser] = useState<userData | null>(null);
  const [newUserRole, setNewUserRole] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке пользователей");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await userService.deleteUser(id);
      message.success("Пользователь успешно удален!");
      loadUsers();
    } catch (error) {
      message.error("Ошибка при удалении пользователя!");
    }
  };

  const showEditModal = (record: userData) => {
    setEditedUser(record);
    setNewUserRole(record.role);
    setIsEditModalOpen(true);
  };

  const handleEditUser = async () => {
    if (!editedUser) return;

    try {
      await userService.updateUser(editedUser.nickname, {
        nickname: editedUser.nickname,
        password: editedUser.password,
        role: newUserRole,
      });

      message.success("Роль пользователя обновлена!");
      setIsEditModalOpen(false);
      loadUsers();
    } catch (error) {
      message.error("Ошибка при обновлении роли пользователя!");
    }
  };

  const options = [
    {
      value: 'ROLE_ADMIN',
      label: 'Администратор',
    },
    {
      value: 'ROLE_USER',
      label: 'Пользователь',
    },
  ]


  const columns = [
    { title: 'ID', dataIndex: 'iduser', key: 'iduser' },
    { title: 'Имя', dataIndex: 'nickname', key: 'nickname' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    {
      title: 'Действия',
      key: 'action',
      render: (_: any, record: userData) => (
        <>
          <Button
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            <EditOutlined />
          </Button>
          <Button onClick={() => deleteUser(record.iduser)} danger>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="iduser"
      />
      <Modal
        title="Редактирование роли пользователя"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={handleEditUser}>
            Сохранить
          </Button>,
        ]}
      >
       <Select defaultValue={newUserRole} options={options} onChange={(e) => setNewUserRole(e)} style={{width:'100%'}} />
      </Modal>
    </>
  );
};

interface userData{
  iduser: number;
  nickname: string;
  password: string;
  role: string;
}

export default UsersTab;