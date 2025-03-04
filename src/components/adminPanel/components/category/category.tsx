import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Input } from 'antd';
import { categoryService } from "../../../../services/categoryService.ts";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const CategoryTab: React.FC = () => {
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Состояние для модального окна добавления категории
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

  // Состояние для модального окна редактирования
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editedCategory, setEditedCategory] = useState<categoryData | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      message.error("Ошибка при загрузке категорий");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      message.error("Название категории не может быть пустым!");
      return;
    }

    try {
      await categoryService.addCategory({ categoryname: categoryName });
      message.success("Категория добавлена!");
      setCategoryName("");
      setIsAddModalOpen(false);
      loadCategories();
    } catch (error) {
      message.error("Ошибка при добавлении категории!");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      message.success("Категория успешно удалена!");
      loadCategories();
    } catch (error) {
      message.error("Ошибка при удалении категории!");
    }
  };

  // Открытие модального окна для редактирования категории
  const showEditModal = (record: categoryData) => {
    setEditedCategory(record);
    setNewCategoryName(record.categoryname);
    setIsEditModalOpen(true);
  };

  const handleEditCategory = async () => {
    if (!editedCategory) return;

    if (!newCategoryName.trim()) {
      message.error("Название категории не может быть пустым!");
      return;
    }

    try {
      await categoryService.updateCategory({
        idcategory: editedCategory.idcategory,
        categoryname: newCategoryName
      });

      message.success("Категория обновлена!");
      setIsEditModalOpen(false);
      loadCategories();
    } catch (error) {
      message.error("Ошибка при обновлении категории!");
    }
  };


  const columns = [
    { title: 'ID', dataIndex: 'idcategory', key: 'idcategory' },
    { title: 'Название', dataIndex: 'categoryname', key: 'categoryname' },
    {
      title: 'Действия',
      key: 'action',
      render: (_: any, record: categoryData) => (
        <>
          <Button
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            <EditOutlined />
          </Button>
          <Button onClick={() => deleteCategory(record.idcategory)} danger>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Button className="add_button" onClick={() => setIsAddModalOpen(true)}
              icon={<PlusOutlined style={{marginRight: '8px'}}/>} style={{padding: '5px', marginBottom: '10px', marginLeft: 'auto', display: 'block'}}>
        Добавить категорию
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="idcategory"
      />
      <Modal
        title="Добавить категорию"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsAddModalOpen(false)}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={handleAddCategory}>
            Сохранить
          </Button>,
        ]}
      >
        <Input
          placeholder="Введите название категории"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>
      <Modal
        title="Редактирование категории"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditModalOpen(false)}>
            Отмена
          </Button>,
          <Button key="save" type="primary" onClick={handleEditCategory}>
            Сохранить
          </Button>,
        ]}
      >
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </Modal>
    </>
  );
};

interface categoryData {
  idcategory: number;
  categoryname: string;
}

export default CategoryTab;