import React, { useEffect, useState } from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import { NavLink } from 'react-router-dom';
import CreateButtonComponent from '../Commons/CreateMenuButton';
import MenuService from '../../services/MenuService';
import { toast } from 'react-toastify';
import { Table } from 'antd';

function MenuCateMngContent() {
  document.tite = 'Manage Menu Category';
  const [menuCateData, setMenuCateData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(menuCateData);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const columns = [
    {
      title: 'Menu Category Name',
      dataIndex: 'menuCategoryName',
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
  const getMenuCate = async () => {
    const menuService = new MenuService();
    try {
      const res = await menuService.viewListCateMenu();
      if (res) {
        setLoading(false);
        setMenuCateData(res.response.data);
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

  useEffect(() => {
    document.title = 'Manage Menu Category';
    const searchData = () => {
      const query = removeAccents(searchQuery.toLowerCase().trim()); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi tìm kiếm
      const filtered = menuCateData.filter((item) =>
        removeAccents(item.menuCategoryName.toLowerCase()).includes(query)
      );
      setFilteredData(filtered);
    };
    searchData();
  }, [searchQuery, menuCateData]);

  useEffect(() => {
    setLoading(true);
    getMenuCate();
  }, []);

  return (
    <div>
      <div className='mb-2'>
        <h2 className='font-bold text-2xl'>Manage Menu Category </h2>
        <div className='pb-4 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center'>
          <div className=' sm:mr-0 w-80 mt-2'>
            <SearchFieldComponent
              onSearch={handleSearch}
            ></SearchFieldComponent>
          </div>
          <div className='lg:text-end md:text-end sm:text-left grow'>
            <NavLink to={'/admin/menu_management/create_meal'}>
              <CreateButtonComponent
                linkName='Create Menu Category'
                linkUrl='/admin/menu_category/create_menu_category'
              ></CreateButtonComponent>
            </NavLink>
          </div>
        </div>
        <div className='py-4 border-1 border-gray-600 rounded-lg'>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <Table
              columns={columns}
              rowKey={(record) => record.menuCategoryId}
              dataSource={filteredData}
              pagination={tableParams.pagination}
              loading={loading}
              onChange={handleTableChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuCateMngContent;
