import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Input, Select } from 'antd';
import { categoryService } from "../../../../services/categoryService.ts";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

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
  const [categoryType, setCategoryType] = useState<string>("")
  const [categoryNewType, setCategoryNewType] = useState<string>("")

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

  const handleChange = (value: string) => {
    setCategoryType(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  const handleChangeForEdit = (value: string) => {
    setCategoryNewType(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  // Функция добавления категории
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      message.error("Название категории не может быть пустым!");
      return;
    }

    if (!categoryType) {
      message.error("Тип категории не может быть пустым!");
      return;
    }

    try {
      await categoryService.addCategory({ categoryname: categoryName, type: categoryType });
      message.success("Категория добавлена!");
      setCategoryName("");
      setCategoryType("");
      setIsAddModalOpen(false);
      await loadCategories();
    } catch (error) {
      message.error("Ошибка при добавлении категории!");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      message.success("Категория успешно удалена!");
      await loadCategories();
    } catch (error) {
      message.error("Ошибка при удалении категории!");
    }
  };

  // Открытие модального окна для редактирования категории
  const showEditModal = (record: categoryData) => {
    setEditedCategory(record);
    setNewCategoryName(record.categoryname);
    setCategoryNewType(record.type);
    setIsEditModalOpen(true);
  };

  // Сохранение отредактированной категории
  const handleEditCategory = async () => {
    if (!editedCategory) return;

    if (!newCategoryName.trim()) {
      message.error("Название категории не может быть пустым!");
      return;
    }

    if (!categoryNewType) {
      message.error("Тип категории не может быть пустым!");
      return;
    }

    try {
      await categoryService.updateCategory({
        idcategory: editedCategory.idcategory,
        categoryname: newCategoryName,
        type: categoryNewType,
      });

      message.success("Категория обновлена!");
      setIsEditModalOpen(false);
      await loadCategories();
    } catch (error) {
      message.error("Ошибка при обновлении категории!");
    }
  };


  const columns = [
    { title: 'ID', dataIndex: 'idcategory', key: 'idcategory' },
    { title: 'Название', dataIndex: 'categoryname', key: 'categoryname' },
    { title: 'Тип', dataIndex: 'type', key: 'type'},
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
        <Select style={{width:'100%', marginTop: '10px'}} onChange={handleChange} placeholder="Выберите тип категории">
          <Option value="Доход">Доход</Option>
          <Option value="Расход">Расход</Option>
        </Select>
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
        <Select value={categoryNewType} style={{width:'100%', marginTop: '10px'}} onChange={handleChangeForEdit}>
          <Option value="Доход">Доход</Option>
          <Option value="Расход">Расход</Option>
        </Select>
      </Modal>
    </>
  );
};

interface categoryData {
  idcategory: number;
  categoryname: string;
  type: string;
}

export default CategoryTab;