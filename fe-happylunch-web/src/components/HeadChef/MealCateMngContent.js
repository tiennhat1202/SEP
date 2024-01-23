import React, { useEffect, useState } from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import { NavLink } from 'react-router-dom';
import CreateButtonComponent from '../Commons/CreateMenuButton';
import BtnDetail from '../Commons/BtnDetail';
import MealService from '../../services/MealService';
import { toast } from 'react-toastify';
import { Table } from 'antd';

function MealCateMngContent() {
  document.title = 'Manage Meal Category';
  const [mealCateData, setMealCateData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(mealCateData);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const getMealCate = async () => {
    const mealService = new MealService();
    try {
      const res = await mealService.getListMealCate();
      if (res.code === 200) {
        setLoading(false);
        setMealCateData(res.response.data);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.response.data.length,
          },
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const columns = [
    {
      title: 'Meal Category Name',
      dataIndex: 'mealCategoryName',
      sorter: true,
      render: (name) => `${name}`,
      width: '20%',
    },
    {
      title: 'Description',
      dataIndex: 'describe',
      width: '20%',
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setFilteredData([]);
    }
  };

  useEffect(() => {
    const searchData = () => {
      const query = removeAccents(searchQuery.toLowerCase().trim()); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi tìm kiếm
      const filtered = mealCateData.filter((item) =>
        removeAccents(item.mealCategoryName.toLowerCase()).includes(query)
      );
      setFilteredData(filtered);
    };
    searchData();
  }, [searchQuery, mealCateData]);

  useEffect(() => {
    setLoading(true);
    getMealCate();
  }, []);
  return (
    <div>
      <div className=''>
        <div className='mb-1'>
          <h2 className='font-bold text-2xl'>Manage Meal Category</h2>
        </div>
        <div className='pb-4 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center'>
          <div className=' sm:mr-0 w-80 mt-2'>
            <SearchFieldComponent
              onSearch={handleSearch}
            ></SearchFieldComponent>
          </div>
          <div className='lg:text-end md:text-end sm:text-left grow'>
            <CreateButtonComponent
              linkName='Create Meal Category'
              linkUrl='/admin/mealCate_management/create_meal_category'
            ></CreateButtonComponent>
          </div>
        </div>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <Table
              columns={columns}
              rowKey={(record) => record.mealCategoryId}
              dataSource={filteredData}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
          </div>
      </div>
    </div>
  );
}

export default MealCateMngContent;
