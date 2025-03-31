import React, { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService.ts";
import { Button, Input, message, Modal, Table } from "antd";
import Header from "../header/header.tsx";
import "./categoryList.css";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для модального окна добавления категории
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

  // Состояние для модального окна редактирования
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editedCategory, setEditedCategory] = useState<categoryData | null>(null);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      setError("Не удалось загрузить категории");
    } finally {
      setLoading(false);
    }
  };

  // Функция добавления категории
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

  // Функция удаления категории
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

  // Сохранение отредактированной категории
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
    {
      key: "categoryname",
      title: "Название категории",
      dataIndex: "categoryname",
    },
    {
      title: "Действия",
      key: "action",
      render: (_: any, record: categoryData) => (
        <>
          <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }}>
            <EditOutlined />
          </Button>
          <Button onClick={() => deleteCategory(record.idcategory)} danger>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const dataSource = categories.map((category: categoryData) => ({
    key: category.idcategory,
    idcategory: category.idcategory,
    categoryname: category.categoryname,
  }));

  return (
    <>
      <Header />
      <div>
        <div className="table_name">
          <h2>Категории трат</h2>
          <div>
            <Button className="add_button" onClick={() => setIsAddModalOpen(true)} icon={<PlusOutlined />} style={{padding: '5px', marginRight: '10px'}}>
              Добавить категорию
            </Button>
            <Button className="add_button" onClick={() => navigate('/result')} style={{padding: '5px'}}>
              Таблица трат
            </Button>
          </div>

        </div>

        {/* Таблица с категориями */}
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <Table dataSource={dataSource} columns={columns}
                 onRow={(record) => ({ onClick: () =>
                     navigate(`/transactions?category=${record.idcategory}`),
          })}
                 style={{ cursor: "pointer" }}/>
        )}

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
      </div>
    </>
  );
};

interface categoryData {
  key: number;
  idcategory: number;
  categoryname: string;
}

export default CategoryList;
