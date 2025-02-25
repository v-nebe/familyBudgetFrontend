import React, { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService.ts";
import { Button, Input, message, Modal, Table } from 'antd';
import Header from '../header/header.tsx';
import './categoryList.css'
import { PlusOutlined } from '@ant-design/icons';


const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");

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

  const handleSave = async () => {
    if (!categoryName.trim()) {
      message.error("Название категории не может быть пустым!");
      return;
    }

    try {
      await categoryService.addCategory({ 'categoryname': categoryName });
      message.success("Категория добавлена!");
      setCategoryName(""); // Очистка инпута
      setIsModalOpen(false); // Закрываем модалку
      loadCategories(); // Обновляем список категорий
    } catch (error) {
      message.error("Ошибка при добавлении категории!");
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
      title: 'Category',
      dataIndex: 'categoryname',
    },
  ];

  const dataSource = categories.map((category: categoryData) => ({
    key: category.idcategory,
    id: category.idcategory,
    categoryname: category.categoryname,
    })
  );

  return (
    <>
      <Header />
      <div>
        <div className='table_name'>
          <h2>Категории трат</h2>
          <Button
            className="add_button"
            onClick={() => setIsModalOpen(true)}
            icon={<PlusOutlined />}
          >
            Добавить категорию
          </Button>

          <Modal
            title="Добавить категорию"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>,
              <Button key="save" type="primary" onClick={handleSave}>
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

        </div>
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <Table dataSource={dataSource} columns={columns} />
        )}
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
