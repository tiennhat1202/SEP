import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import MenuService from '../../services/MenuService';
import { useEffect } from 'react';
import DatePickerComponent from '../Commons/DatePicker';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import BackMenuComponent from '../Commons/BackMenu';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Empty, Tooltip } from 'antd';
function ToDoMenu() {
  const [todo_menu, setToDo_Menu] = useState([]);
  const [menuCate, setMenuCate] = useState([]);
  const [selectedMenuCate, setSelectedMenuCate] = useState([]);
  const [selectTab, setSelectTab] = useState(null);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState([]);
  const [selectedFirstDate, setSelectedFirstDate] = useState(null);
  const [selectedSecondDate, setSelectedSecondDate] = useState(null);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [deleteInfo, setDeleteInfo] = useState([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState([]);
  const [checkedAllChecked, setCheckedAllChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const menuService = new MenuService();

  const getListMenuCate = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      if (response.code === 200 && response.response.data) {
        setMenuCate(response.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getListMenusDoingByCategory = async () => {
    try {
      const res = await menuService.viewListMenusDoingByCategory(
        selectedMenuCate
      );
      setToDo_Menu(res.response.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getListMealsByMenu = (menuId) => {
    const selectedMenu = todo_menu.viewMenus.find(
      (item) => item.menuId === menuId
    );
    if (selectedMenu) {
      setSelectedMenuDetail(selectedMenu);
    }
  };

  const deleteMenu = async (deleteData) => {
    try {
      const res = await menuService.deleteMenu(deleteData);
      if (res.code === 200) {
        toast.success(res.response.data);
        await getListMenusDoingByCategory();
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendRequestMenuToPending = async (listMenuIds) => {
    try {
      const res = await menuService.sendRequestMenuToPending(listMenuIds);
      if (res.code === 200) {
        toast.success(res.response.data);
        await getListMenusDoingByCategory();
        setCheckedMenuIds([]);
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleConfirmDeleteMenu = (menuId) => {
    const deleteData = todo_menu.viewMenus.find(
      (menu) => menu.menuId === menuId
    );
    setDeleteInfo(deleteData);
  };

  const handleDeleteMenu = (menuId) => {
    const menuData = {
      menuId: menuId,
    };
    if (menuData) {
      deleteMenu(menuData);
    }
  };

  const handleSelectMenuCate = (menuCateId) => {
    setSelectedMenuCate(menuCateId);
    setSelectTab(menuCateId);
  };

  const handleSearchByFirstDate = (selectedFirstDate) => {
    setSelectedFirstDate(selectedFirstDate);
  };

  const handleSearchBySecondDate = (selectedSecondDate) => {
    setSelectedSecondDate(selectedSecondDate);
  };

  const handleCheckboxChange = (menuId) => {
    if (checkedMenuIds.includes(menuId)) {
      // Nếu menuId đã tồn tại trong mảng, loại bỏ nó
      setCheckedMenuIds(checkedMenuIds.filter((id) => id !== menuId));
    } else {
      // Nếu menuId chưa tồn tại trong mảng, thêm nó vào
      setCheckedMenuIds([...checkedMenuIds, menuId]);
    }
  };

  const handleCheckedAllChange = () => {
    if (checkedAllChecked) {
      // Nếu đang chọn tất cả, set selectedMenuIds thành mảng rỗng
      setCheckedMenuIds([]);
    } else {
      // Nếu đang không chọn tất cả, set selectedMenuIds thành mảng chứa tất cả menuId
      const allMenuIds = filteredMenus.map((item) => item.menuId);
      setCheckedMenuIds(allMenuIds);
    }
    // Toggle trạng thái của selectAllChecked
    setCheckedAllChecked(!checkedAllChecked);
  };

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  const handleSendRequest = () => {
    const menuIds = {
      listMenuIds: checkedMenuIds,
    };
    if (menuIds) {
      sendRequestMenuToPending(menuIds);
    }
  };

  useEffect(() => {
    const sortAndFilterMenus = () => {
      // Filter by date
      const newFilteredMenus =
        todo_menu &&
        todo_menu.viewMenus &&
        todo_menu.viewMenus.filter((item) => {
          const itemStartDate = new Date(item.startDate).getTime();
          const firstDateTimestamp =
            selectedFirstDate && new Date(selectedFirstDate).getTime();
          const secondDateTimestamp =
            selectedSecondDate && new Date(selectedSecondDate).getTime();

          return (
            (!firstDateTimestamp || itemStartDate >= firstDateTimestamp) &&
            (!secondDateTimestamp || itemStartDate <= secondDateTimestamp)
          );
        });

      // Update the state
      setFilteredMenus(newFilteredMenus);
    };

    // Call the sorting and filtering function
    sortAndFilterMenus();
  }, [todo_menu, selectedFirstDate, selectedSecondDate]);

  useEffect(() => {
    getListMenuCate();
    getListMenusDoingByCategory();
  }, [selectedMenuCate]);
  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCate(menuCate[0]?.menuCategoryId);
  }, [menuCate[0]?.menuCategoryId]);
  return (
    <div>
      <div className='mb-2'>
        <div className='pb-2'>
          <h2 className='font-bold text-2xl'>To Do Menu</h2>
        </div>
        <div className='grid gap-4 xl:grid-cols-2 2xl:grid-cols-2'>
          <div className='h-[600px] shadow-sm border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
            <div className='text-center mt-4'>
              <span className='font-bold text-md'>Menu To Do</span>
            </div>
            <div className='flex items-center'>
              <div className='text-sm ml-4 w-fit font-medium text-center'>
                <ul
                  className='flex mb-0 list-none flex-wrap flex-row'
                  role='tablist'
                >
                  {menuCate.map((item, i) => (
                    <li
                      key={i}
                      className='-mb-px mr-2 last:mr-0 flex-auto text-center'
                    >
                      <button
                        className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
                          selectTab === item.menuCategoryId
                            ? 'text-white bg-blue-600'
                            : 'text-blue-600 bg-white'
                        }`}
                        onClick={
                          () => {
                            handleSelectMenuCate(item.menuCategoryId);
                          } // Cập nhật giá trị của selectMenuCate khi người dùng thay đổi
                        }
                      >
                        {item.menuCategoryName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='relative mt-4'>
              <div className='flex items-center mb-2 mt-2'>
                <span className='mx-4 text-gray-500 text-base'>
                  Search date:
                </span>
                <DatePickerComponent
                  onSelectedDatePicker={handleSearchByFirstDate}
                ></DatePickerComponent>
                <span className='mx-4 text-gray-500 text-base'>to</span>
                <DatePickerComponent
                  onSelectedDatePicker={handleSearchBySecondDate}
                ></DatePickerComponent>
              </div>
              <div className='ml-4'>
                <button
                  onMouseEnter={handleHoverStart}
                  onMouseLeave={handleHoverEnd}
                  onClick={() => setOpenModal(true)}
                  type='button'
                  disabled={checkedMenuIds.length == 0 ? true : false}
                  className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
                >
                  <div className='flex'>
                    <svg
                      fill={isHovered ? '#1C64F2' : '#000000'}
                      width='25px'
                      height='25px'
                      viewBox='0 0 16 16'
                      id='request-send-16px'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                      <g
                        id='SVGRepo_tracerCarrier'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <g id='SVGRepo_iconCarrier'>
                        {' '}
                        <path
                          id='Path_44'
                          data-name='Path 44'
                          d='M-18,11a2,2,0,0,0,2-2,2,2,0,0,0-2-2,2,2,0,0,0-2,2A2,2,0,0,0-18,11Zm0-3a1,1,0,0,1,1,1,1,1,0,0,1-1,1,1,1,0,0,1-1-1A1,1,0,0,1-18,8Zm2.5,4h-5A2.5,2.5,0,0,0-23,14.5,1.5,1.5,0,0,0-21.5,16h7A1.5,1.5,0,0,0-13,14.5,2.5,2.5,0,0,0-15.5,12Zm1,3h-7a.5.5,0,0,1-.5-.5A1.5,1.5,0,0,1-20.5,13h5A1.5,1.5,0,0,1-14,14.5.5.5,0,0,1-14.5,15ZM-7,2.5v5A2.5,2.5,0,0,1-9.5,10h-2.793l-1.853,1.854A.5.5,0,0,1-14.5,12a.493.493,0,0,1-.191-.038A.5.5,0,0,1-15,11.5v-2a.5.5,0,0,1,.5-.5.5.5,0,0,1,.5.5v.793l1.146-1.147A.5.5,0,0,1-12.5,9h3A1.5,1.5,0,0,0-8,7.5v-5A1.5,1.5,0,0,0-9.5,1h-7A1.5,1.5,0,0,0-18,2.5v3a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5v-3A2.5,2.5,0,0,1-16.5,0h7A2.5,2.5,0,0,1-7,2.5Zm-7.854,3.646L-12.707,4H-14.5a.5.5,0,0,1-.5-.5.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.191.038.506.506,0,0,1,.271.271A.5.5,0,0,1-11,3.5v3a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5V4.707l-2.146,2.147A.5.5,0,0,1-14.5,7a.5.5,0,0,1-.354-.146A.5.5,0,0,1-14.854,6.146Z'
                          transform='translate(23)'
                        />{' '}
                      </g>
                    </svg>
                    <span className='align-middle mt-1 ml-1'>
                      Send {checkedMenuIds.length} Menus Request
                    </span>
                  </div>
                </button>
              </div>
              <table className='w-full overflow-x-auto text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='p-4'>
                      <div className='flex items-center'>
                        <input
                          checked={checkedAllChecked}
                          onChange={handleCheckedAllChange}
                          id='checkbox-all-search'
                          type='checkbox'
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        ></input>
                        <div className='ml-1'>
                          <span>All</span>
                        </div>
                      </div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Cate Name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      MenuName
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Description
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Start Date
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      End Date
                    </th>
                    <th scope='col' className='px-6 py-3 text-center'>
                      Action
                    </th>
                  </tr>
                </thead>
                {filteredMenus && filteredMenus.length > 0 ? (
                  <tbody>
                    {filteredMenus.map((item, i) => (
                      <tr
                        key={i}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <td className='w-4 p-4'>
                          <div className='flex items-center'>
                            <input
                              checked={checkedMenuIds.includes(item.menuId)}
                              onChange={() => handleCheckboxChange(item.menuId)}
                              id='checkbox-table-search-1'
                              type='checkbox'
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                            />
                            <label
                              htmlFor='checkbox-table-search-1'
                              className='sr-only'
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                        >
                          {item.menuCategoryName}
                        </th>
                        <td className='px-6 py-4'>{item.menuName}</td>
                        <td className='px-6 py-4'>{item.menuDescribe}</td>
                        <td className='px-6 py-4'>{item.startDate}</td>
                        <td className='px-6 py-4'>
                          {item.endDate === null ? 'unlimited' : item.endDate}
                        </td>
                        <td className='px-6 py-8 flex gap-2'>
                          <Tooltip title='Show meal'>
                            <button
                              onClick={() => getListMealsByMenu(item.menuId)}
                            >
                              <svg
                                cursor='pointer'
                                width='25px'
                                height='25px'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                                <g
                                  id='SVGRepo_tracerCarrier'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <g id='SVGRepo_iconCarrier'>
                                  {' '}
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12Z'
                                    fill='#ffb02e'
                                  />{' '}
                                  <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M21.83 11.2807C19.542 7.15186 15.8122 5 12 5C8.18777 5 4.45796 7.15186 2.17003 11.2807C1.94637 11.6844 1.94361 12.1821 2.16029 12.5876C4.41183 16.8013 8.1628 19 12 19C15.8372 19 19.5882 16.8013 21.8397 12.5876C22.0564 12.1821 22.0536 11.6844 21.83 11.2807ZM12 17C9.06097 17 6.04052 15.3724 4.09173 11.9487C6.06862 8.59614 9.07319 7 12 7C14.9268 7 17.9314 8.59614 19.9083 11.9487C17.9595 15.3724 14.939 17 12 17Z'
                                    fill='#ffb02e'
                                  />{' '}
                                </g>
                              </svg>
                            </button>
                          </Tooltip>
                          <Tooltip title='Update menu'>
                            <button>
                              <Link
                                to={`/admin/menu_management/update_menu?menu_id=${item.menuId}`}
                              >
                                <svg
                                  cursor='pointer'
                                  width='20px'
                                  height='20px'
                                  viewBox='0 0 24 24'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                                  <g
                                    id='SVGRepo_tracerCarrier'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />
                                  <g id='SVGRepo_iconCarrier'>
                                    {' '}
                                    <path
                                      d='M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z'
                                      stroke='#3276c3'
                                      strokeWidth='1.5'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />{' '}
                                    <path
                                      d='M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13'
                                      stroke='#3276c3'
                                      strokeWidth='1.5'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                    />{' '}
                                  </g>
                                </svg>
                              </Link>
                            </button>
                          </Tooltip>
                          <Tooltip title='Delete menu'>
                            <button
                              onClick={() => {
                                setOpenModal(true);
                                handleConfirmDeleteMenu(item.menuId);
                              }}
                            >
                              <svg
                                width='25px'
                                height='25px'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                                <g
                                  id='SVGRepo_tracerCarrier'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <g id='SVGRepo_iconCarrier'>
                                  {' '}
                                  <path
                                    d='M6 5H18M9 5V5C10.5769 3.16026 13.4231 3.16026 15 5V5M9 20H15C16.1046 20 17 19.1046 17 18V9C17 8.44772 16.5523 8 16 8H8C7.44772 8 7 8.44772 7 9V18C7 19.1046 7.89543 20 9 20Z'
                                    stroke='#ff0000'
                                    strokeWidth={2}
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                  />{' '}
                                </g>
                              </svg>
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <Empty
                    className='absolute left-80'
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </table>
            </div>
          </div>
          <div className='h-[600px] shadow-sm p-4  border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
            <div className='text-center'>
              {selectedMenuDetail.length === 0 ? (
                <span className='font-bold text-md'>Meal list</span>
              ) : (
                <span className='font-bold text-md'>
                  Meal list of menu &quot;{selectedMenuDetail.menuName}&quot;
                </span>
              )}
            </div>
            {Object.keys(selectedMenuDetail).length > 0 ? (
              <div className='relative overflow-x-auto mt-14'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                    <tr>
                      <th scope='col' className='px-16 py-3'>
                        <span className='sr-only'>Image</span>
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Meal Name
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Description
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenuDetail.listMeals.map((item, i) => (
                      <tr
                        key={i}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <td className='p-4'>
                          <img
                            src={item.image}
                            className='w-16 md:w-32 max-w-full max-h-full'
                            alt={item.mealName}
                          />
                        </td>
                        <td className='px-6 py-4 font-semibold text-gray-900 dark:text-white'>
                          {item.mealName}
                        </td>
                        <td className='px-6 py-4'>{item.mealDescribe}</td>
                        <td className='px-6 py-4'>
                          {item.mealPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className='flex'>
          <div className='flex-grow'>
            <BackMenuComponent linkUrl='/admin/menu_management'></BackMenuComponent>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200' />
            {deleteInfo.menuId ? (
              <>
                <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                  {`Are you sure you want to delete menu "${deleteInfo.menuName}"?`}
                </h3>
                <div className='flex justify-center gap-4'>
                  <Button
                    color='failure'
                    onClick={() => {
                      handleDeleteMenu(deleteInfo.menuId);
                    }}
                  >
                    Yes, I&apos;m sure
                  </Button>
                  <Button
                    color='gray'
                    onClick={() => {
                      setOpenModal(false);
                      setDeleteInfo([]);
                    }}
                  >
                    No, cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                  {`Do you want to request ${checkedMenuIds.length} send menus?`}
                </h3>
                <div className='flex justify-center gap-4'>
                  <Button
                    color='failure'
                    onClick={() => {
                      handleSendRequest();
                    }}
                  >
                    Yes, I&apos;m sure
                  </Button>
                  <Button
                    color='gray'
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    No, cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ToDoMenu;
