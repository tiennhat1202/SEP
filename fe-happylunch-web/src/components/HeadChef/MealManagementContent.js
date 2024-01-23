import React, { useEffect, useState } from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import CreateButtonComponent from '../Commons/CreateMenuButton';
import DeleteBtn from '../Commons/DeleteBtn';
import EditBtn from '../Commons/EditButton';
import MealService from '../../services/MealService';
import MenuService from '../../services/MenuService';
import { toast, ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { Button, Modal, Pagination } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Spin, Tooltip } from 'antd';
function ListContent() {
  document.title = 'Manage Meal';
  const mealService = new MealService();
  const menuService = new MenuService();
  const [mealCate, setMealCate] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealList, setMealList] = useState([]);
  const [mealAll, setMealAll] = useState([]);
  const [menuCate, setMenuCate] = useState([]);
  const [selectMealCate, setSelectMealCate] = useState('');
  const [selectMenuCate, setSelectedMenuCate] = useState('');
  const [filterMealAll, setFilterMealAll] = useState(mealAll);
  const [filterMealList, setFilterMealList] = useState(mealList);
  const [selectTab, setSelectTab] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [mealId, setMealId] = useState('');
  const [mealName, setMealName] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const getTotalPages = (data) => Math.ceil(data.length / itemsPerPage);

  const updatePagination = (totalPages, page) => {
    setTotalPages(totalPages);
    setCurrentPage(page);
  };

  const onPageChange = (page) => {
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;

    if (selectMealCate !== '') {
      const slicedData = mealList.slice(startIdx, endIdx);
      setFilterMealList(slicedData);
      updatePagination(getTotalPages(mealList), page);
    } else {
      const slicedData = mealAll.slice(startIdx, endIdx);
      setFilterMealAll(slicedData);
      updatePagination(getTotalPages(mealAll), page);
    }
  };

  // Fetch Data

  const getListMealCate = async () => {
    try {
      const res = await mealService.getListMealCate();
      if (res.code === 200) {
        setMealCate(res.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getListCateMenu = async () => {
    try {
      const res = await menuService.viewListCateMenu();
      if (res.code === 200) {
        setMenuCate(res.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getListMealsFromMenuCateByMealCate = async () => {
    if (selectMealCate !== '') {
      try {
        setLoading(true);
        const response = await mealService.viewListMealsFromMenuCateByMealCate(
          selectMenuCate,
          selectMealCate
        );
        console.log(response);
        if (response.code === 200 && response.response.data) {
          setMealList(response.response.data);
        }
      } catch (error) {
        if (error.code === 400) {
          toast.error(error.code);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const getListAllMealByMenuCate = async () => {
    try {
      setLoading(true);
      const response = await mealService.viewListAllMealByMenuCate(
        selectMenuCate
      );
      if (response.code === 200) {
        setMealAll(response.response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      const res = await mealService.deleteMeal(mealId);
      if (res.code === 200) {
        toast.success('Menu delete was successful');
        setOpenModal(false);
        await getListAllMealByMenuCate();
        await getListMealsFromMenuCateByMealCate();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const searchData = () => {
    const query = removeAccents(searchQuery.toLowerCase().trim());

    if (query === '') {
      // If the search query is empty, reset to display all data
      setFilterMealAll(mealAll);
      setFilterMealList(mealList);
      updatePagination(getTotalPages(mealAll), 1);
      onPageChange(currentPage);
    } else {
      if (selectMealCate === '') {
        const filtered = mealAll.filter((item) =>
          removeAccents(item.mealName.toLowerCase()).includes(query)
        );
        setFilterMealAll(filtered);
        updatePagination(getTotalPages(filtered), 1);
      } else {
        const filtered = mealList.filter((item) =>
          removeAccents(item.mealName.toLowerCase()).includes(query)
        );
        setFilterMealList(filtered);
        updatePagination(getTotalPages(filtered), 1);
      }
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset current page to 1 when initiating a new search
  };

  const handleSelectMealChange = (event) => {
    const selectedMealCate = event.target.value;
    setSelectMealCate(selectedMealCate);
  };

  const handleSelectMenuCate = (menuCateId) => {
    setSelectedMenuCate(menuCateId);
    setSelectTab(menuCateId);
  };

  const handleDeleteMeal = (menuId) => {
    const mealData = {
      mealId: mealId,
    };

    if (mealData) {
      deleteMeal(mealData);
    }
  };

  useEffect(() => {
    getListMealCate();
    getListCateMenu();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (selectMealCate?.length > 0 || selectMenuCate?.length > 0) {
      getListAllMealByMenuCate();
      getListMealsFromMenuCateByMealCate();
    }
  }, [selectMealCate, selectMenuCate]);

  useEffect(() => {
    searchData();
  }, [searchQuery, mealAll, mealList]);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, selectMealCate, selectMenuCate, mealAll, mealList]);

  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCate(menuCate[0]?.menuCategoryId);
  }, [menuCate[0]?.menuCategoryId]);

  console.log('mealId: ', filterMealAll);
  console.log('mealName: ', filterMealList);
  return (
    <div>
      <div className='mb-2'>
        <div className='pb-4 flex'>
          <h2 className='font-bold text-2xl'>Manage Meal</h2>
          <div className='lg:text-end md:text-end sm:text-left grow'>
            <NavLink to={'/admin/menu_management/create_meal'}>
              <CreateButtonComponent
                linkName='Create Meal'
                linkUrl='/admin/meal_management/create_meal'
              ></CreateButtonComponent>
            </NavLink>
          </div>
        </div>
        <div className='text-sm w-fit font-medium text-center'>
          <ul
            className='flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row'
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
                  onClick={() => handleSelectMenuCate(item.menuCategoryId)}
                >
                  {item.menuCategoryName}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {mealAll.length > 0 ? (
          <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg'>
            <div className='mb-2 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center'>
              <div className=' sm:mr-0 w-80'>
                <SearchFieldComponent
                  onSearch={handleSearch}
                ></SearchFieldComponent>
              </div>
              <div className='mb-1'>
                <label htmlFor='underline_select' className='sr-only'>
                  Underline select
                </label>
                <select
                  id='underline_select'
                  className='block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                  value={selectMealCate}
                  onChange={handleSelectMealChange}
                >
                  <option hidden defaultValue=''>
                    Choose a meal category
                  </option>
                  <option value=''>All</option>
                  {mealCate.map((item, i) => (
                    <option key={i} value={item.mealCategoryId}>
                      {item.mealCategoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th scope='col' className='px-6 py-3'>
                      <span className='sr-only'></span>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      Meal name
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <div className='flex items-center'>Description</div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <div className='flex items-center'>Price</div>
                    </th>
                    <th scope='col' className='px-6 py-3'>
                      <div className='text-center'>Action</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan='5' className='text-center p-5'>
                        <Spin size='large' />
                      </td>
                    </tr>
                  ) : selectMealCate === '' ? (
                    filterMealAll.map((item) => (
                      <tr
                        key={item.id}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <td className='w-32 p-6'>
                          <img
                            className='w-20 ml-4'
                            src={item.image}
                            alt={item.mealName}
                          ></img>
                        </td>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white'
                        >
                          {item.mealName}
                        </th>
                        <td className='px-6 py-4 text-black'>
                          {item.mealDescribe}
                        </td>
                        <td className='px-6 py-4 text-black'>
                          {item.mealPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex justify-center gap-3'>
                            <EditBtn
                              edit_id={`/admin/meal_management/update_meal?meal_id=${item.mealId}`}
                            ></EditBtn>
                            <div>
                              <Tooltip title='Delete meal'>
                                <button
                                  onClick={() => {
                                    setOpenModal(true);
                                    setMealId(item.mealId);
                                    setMealName(item.mealName);
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-6 h-6 text-red-700'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    filterMealList.map((item) => (
                      <tr
                        key={item.id}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                      >
                        <td className='w-32 p-6'>
                          <img
                            className='w-20 ml-4'
                            src={item.image}
                            alt={item.mealName}
                          ></img>
                        </td>
                        <th
                          scope='row'
                          className='px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white'
                        >
                          {item.mealName}
                        </th>
                        <td className='px-6 py-4 text-black'>
                          {item.mealDescribe}
                        </td>
                        <td className='px-6 py-4 text-black'>
                          {item.mealPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex justify-center gap-3'>
                            <EditBtn
                              edit_id={`/admin/meal_management/update_meal?meal_id=${item.mealId}`}
                            ></EditBtn>
                            <div>
                              <Tooltip title='Delete menu'>
                                <button onClick={() => setOpenModal(true)}>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={1.5}
                                    stroke='currentColor'
                                    className='w-6 h-6 text-red-700'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                    />
                                  </svg>
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className='flex overflow-x-auto sm:justify-end mt-3'>
              <>
                <nav aria-label='Page navigation example'>
                  <ul className='inline-flex -space-x-px text-sm'>
                    <li>
                      <button
                        href='#'
                        className='flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <li key={index}>
                        <a
                          href='#'
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                            currentPage === index + 1
                              ? 'text-white bg-blue-600'
                              : 'bg-white'
                          }`}
                          onClick={() => {
                            setCurrentPage(index + 1);
                          }}
                        >
                          {index + 1}
                        </a>
                      </li>
                    ))}

                    <li>
                      <button
                        href='#'
                        className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
      <>
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
              <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete meal{' '}
                <p style={{ whiteSpace: 'pre-line' }}>
                  &quot;{mealName}&quot;?
                </p>
              </h3>
              <div className='flex justify-center gap-4'>
                <Button
                  color='failure'
                  onClick={() => handleDeleteMeal(mealId)}
                >
                  Yes, I&quot;m sure
                </Button>
                <Button color='gray' onClick={() => setOpenModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default ListContent;
