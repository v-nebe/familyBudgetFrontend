import React, { useEffect, useState } from "react";
import { categoryService } from "../../services/categoryService.ts";
import { Button, Table } from 'antd';
import Header from "../header/header.tsx";
import "./categoryList.css";
import { useNavigate } from 'react-router-dom';


const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<categoryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const columns = [
    {
      key: "categoryname",
      title: "Название категории",
      dataIndex: "categoryname",
    },
    {
      key: "type",
      title: "Тип категории",
      dataIndex: "type"
    },
  ];

  const dataSource = categories.map((category: categoryData) => ({
    key: category.idcategory,
    idcategory: category.idcategory,
    categoryname: category.categoryname,
    type: category.type,
  }));

  return (
    <>
      <Header />
      <div>
        <div className="table_name">
          <h2>Категории трат</h2>
          <div>
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
                     navigate(`/transactions?category=${record.idcategory}&type=${record.type}`),
          })}
                 style={{ cursor: "pointer" }}/>
        )}
      </div>
    </>
  );
};

interface categoryData {
  key: number;
  idcategory: number;
  categoryname: string;
  type: string;
}

export default CategoryList;
