import React, { useEffect, useState } from 'react';
// import DatePickerComponent from '../Commons/DatePicker';
import CreateButtonComponent from '../Commons/CreateMenuButton';
import MenuService from '../../services/MenuService';
import { toast, ToastContainer } from 'react-toastify';
import '../../index.css';
import useModal from '../Commons/UseModal';
import Modal from '../Commons/ModalMenu';
import { format } from 'date-fns';
// import { Datepicker } from 'flowbite-react';
import { Spin, DatePicker, Space } from 'antd';
import { NavLink } from 'react-router-dom';
function ListContent() {
  document.title = 'Manage Menu';
  const menuService = new MenuService();
  const [menuCate, setMenuCate] = useState([]);
  const [viewPendingMenus, setPendingMenus] = useState([]);
  const [listMenuApproved, setListMenuApproved] = useState([]);
  const [listMenuReject, setListMenuReject] = useState([]);
  const { isShowing, toggle } = useModal();
  const [selectTab, setSelectTab] = useState(null);
  const [selectedMenuCate, setSelectedMenuCate] = useState([]);
  const [mealsData, setMealsData] = useState([]);
  const [menuName, setMenuName] = useState('');
  const [showingHistoryApplication, setShowingHistoryApplication] =
    useState(false);
  const [visibleApproveHistoryMenu, setVisibleApproveHistoryMenu] =
    useState(null);
  const [
    showingPendingHistoryApplication,
    setShowingPendingHistoryApplication,
  ] = useState(false);
  const [visiblePendingHistoryMenu, setVisiblePendingHistoryMenu] =
    useState(null);
  const [showingRejectHistoryApplication, setShowingRejectHistoryApplication] =
    useState(false);
  const [visibleRejectHistoryMenu, setVisibleRejectHistoryMenu] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleApproveHistory, setVisibleApproveHistory] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [visiblePendingHistory, setVisiblePendingHistory] = useState(false);
  const [currentPendingMenuId, setCurrentPendingMenuId] = useState(null);
  const [visibleRejectHistory, setVisibleRejectHistory] = useState(false);
  const [currentRejectMenuId, setCurrentRejectMenuId] = useState(null);

  const getListMenuCate = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      if (response.code === 200) {
        setMenuCate(response.response.data);
      }
    } catch (error) {
      toast.error('No fetching menu cate data: ', error);
    }
  };

  const getListMenusPendingByCate = async () => {
    try {
      setLoading(true);
      const response = await menuService.viewListMenusPendingByCategory(
        selectedMenuCate
      );
      if (response.code === 200) {
        setPendingMenus(response.response.data);
      }
    } catch (error) {
      console.error('No fetching menu cate data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const getListMenuApprovedByCategory = async (menuCategoryId) => {
    try {
      setLoading(true);
      const response = await menuService.viewListMenuApprovedByCategory(
        menuCategoryId
      );
      if (response.code === 200) {
        setListMenuApproved(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getListMenuRejectByCategory = async (menuCategoryId) => {
    try {
      setLoading(true);
      const response = await menuService.viewListMenuRejectByCategory(
        menuCategoryId
      );
      if (response.code === 200) {
        setListMenuReject(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getListHistoryApplication = async (menuId) => {
    try {
      const res = await menuService.viewListMenuHistoryById(menuId);
      if (res.code === 200) {
        return res.response.data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSelectMenuCate = (menuCateId) => {
    setSelectedMenuCate(menuCateId);
    setSelectTab(menuCateId);
  };

  const handleShowMeals = (mealsData, menuName) => {
    setMealsData(mealsData);
    setMenuName(menuName);
  };

  const formatSafeDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy (HH:mm)');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleApproveHistoryApplication = async (menuId) => {
    try {
      if (menuId !== currentMenuId) {
        setCurrentMenuId(menuId);
        const historyData = await getListHistoryApplication(menuId);
        if (historyData && historyData.viewDateApplications) {
          setShowingHistoryApplication(historyData.viewDateApplications);
          setVisibleApproveHistory(true);
        } else {
          setShowingHistoryApplication(null);
          setVisibleApproveHistory(false);
        }
      } else {
        setVisibleApproveHistory(!visibleApproveHistory);
      }

      setVisibleApproveHistoryMenu(menuId);
    } catch (error) {
      console.error('Error in handleApproveHistoryApplication:', error);
      // Handle the error as needed
    }
  };

  const handlePendingHistoryApplication = async (menuId) => {
    try {
      if (menuId !== currentPendingMenuId) {
        setCurrentPendingMenuId(menuId);
        const historyData = await getListHistoryApplication(menuId);
        if (historyData && historyData.viewDateApplications) {
          setShowingPendingHistoryApplication(historyData.viewDateApplications);
          setVisiblePendingHistory(true)
        } else {
          setShowingPendingHistoryApplication(null);
          setVisiblePendingHistory(false)
        }
      } else {
        setVisiblePendingHistory(!visiblePendingHistory)
      }
      setVisiblePendingHistoryMenu(menuId);
    } catch (error) {
      console.error('Error in handleApproveHistoryApplication:', error);
      // Handle the error as needed
    }
  };

  const handleRejectHistoryApplication = async (menuId) => {
    try {
      if (menuId !== currentRejectMenuId) {
        setCurrentRejectMenuId(menuId)
        const historyData = await getListHistoryApplication(menuId);
        if (historyData && historyData.viewDateApplications) {
          setShowingRejectHistoryApplication(historyData.viewDateApplications);
          setVisibleRejectHistory(true)
        } else {
          setShowingRejectHistoryApplication(null);
          setVisibleRejectHistory(false)
        }
      } else {
        setVisibleRejectHistory(!visibleRejectHistory)
      }
      setVisibleRejectHistoryMenu(menuId);
    } catch (error) {
      console.error('Error in handleApproveHistoryApplication:', error);
      // Handle the error as needed
    }
  };

  /* const handleSearchDate = async (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    if (formattedDate) {
      await getListMenusAvailableSelectedByCategory(
        selectedMenuCate,
        formattedDate
      );
    }
  }; */
  const onChange = async (date, dateString) => {
    console.log(date, dateString);
    if (dateString) {
      await getListMenusAvailableSelectedByCategory(
        selectedMenuCate,
        dateString
      );
    } else {
      await getListMenuApprovedByCategory(selectedMenuCate);
    }
  };

  const getListMenusAvailableSelectedByCategory = async (
    menuCategoryId,
    dateTime
  ) => {
    try {
      const res = await menuService.viewListMenusAvailableSelectedByCategory(
        menuCategoryId,
        dateTime
      );
      console.log(res.response.data);
      if (res.code === 200) {
        setListMenuApproved(res.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getListMenuCate();
    getListMenusPendingByCate();
    getListMenuApprovedByCategory(selectedMenuCate);
    getListMenuRejectByCategory(selectedMenuCate);
  }, [selectedMenuCate]);

  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCate(menuCate[0]?.menuCategoryId);
  }, [menuCate[0]?.menuCategoryId]);
  return (
    <div>
      <div className='flex items-center justify-between pb-4'>
        <h2 className='font-bold text-2xl'>Manage Menu (HeadChef)</h2>
        <div className='flex items-center space-x-4'>
          <CreateButtonComponent
            linkName='Create Menu'
            linkUrl='/admin/menu_management/create_menu'
          ></CreateButtonComponent>
          <div>
            <NavLink to='/admin/menu_management/todo_menu'>
              <button
                type='button'
                className='whitespace-nowrap text-sm max-sm:px-10  px-10 py-2.5 max-sm:py-2 text-center text-white bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300  shadow-md shadow-yellow-300/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg'
              >
                <div className='lg:flex md:flex sm:flex max-sm:flex justify-center text-sm'>
                  <div></div>
                  <p className='align-middle mt-0.5'>Draft Menus</p>
                </div>
              </button>
            </NavLink>
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <div className='text-sm w-fit font-medium text-center'>
          <ul className='flex mb-0 list-none flex-wrap flex-row' role='tablist'>
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
      <div className='pb-4 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center'>
        {/* <div className="md:text-end lg:text-left max-sm:mt-3 sm:w-60">
              <DatePickerComponent onSelectedDatePicker={handleDatePicker} onClear={handleClearDate}></DatePickerComponent>
              </div> */}
        <div className='lg:text-end md:text-end sm:text-left grow'></div>
      </div>
      {/* Approved */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='h-[650px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
          <h3 className='mb-5 text-lg font-bold text-green-600 dark:text-gray-400 text-center'>
            Available Menus List
          </h3>
          <div className='xl:flex lg:block items-center mb-3'>
            <span className='align-middle text-gray-500'>Search menu date: </span>
            <div className='xl:w-1/2 lg:w-fit xl:px-2 lg:px-0'>
              <DatePicker onChange={onChange} />
            </div>
          </div>
          {loading ? (
            <div colSpan='5' className='text-center p-5'>
              <Spin size='large' />
            </div>
          ) : (
            listMenuApproved &&
            listMenuApproved.viewMenus &&
            listMenuApproved.viewMenus.map((item, i) => (
              <ul
                key={i}
                className='bg-white border border-green-600 w-full mb-2 shadow overflow-hidden sm:rounded-md'
              >
                <li className='relative'>
                  <div className='px-4 w-full py-5 sm:px-6'>
                    <div className='items-center flex justify-between'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        {item.menuName}
                      </h3>
                    </div>
                    <p className='max-w-2xl mb-2 text-sm text-gray-500'>
                      Description : {item.menuDescribe}
                    </p>
                    <div className='flex gap-4'>
                      <div>
                        <label className='text-sm text-gray-500'>
                          Start Date:{' '}
                          <span className='lg:inline'>
                            {item.startDate === null
                              ? ''
                              : formatSafeDate(item.startDate)}
                          </span>{' '}
                        </label>
                      </div>
                      <div>
                        <label className='text-sm text-gray-500'>
                          End Date:{' '}
                          <span>
                            {item.endDate === null
                              ? 'Invalid'
                              : formatSafeDate(item.endDate)}
                          </span>{' '}
                        </label>
                      </div>
                    </div>
                    <div className='mt-2 gap-3 flex items-center justify-end'>
                      {/* <p className='text-sm font-medium text-gray-500'>
                          Status:{''}
                          <span className='text-green-600'> Approved</span>
                        </p> */}
                      <div>
                        <button
                          onClick={() => {
                            toggle();
                            handleShowMeals(item.listMeals, item.menuName);
                          }}
                          className='text-end mr-2 font-medium text-blue-600 hover:text-indigo-500'
                        >
                          Show Meals
                        </button>
                        <span className='xl:inline lg:hidden'>|</span>
                        <button
                          onClick={() => {
                            handleApproveHistoryApplication(item.menuId);
                          }}
                          className='text-end xl:ml-2 lg:ml-0 font-medium text-blue-600 hover:text-indigo-500'
                        >
                          History application
                        </button>
                      </div>
                    </div>
                    {visibleApproveHistoryMenu === item.menuId && visibleApproveHistory && (
                      <div className='flex mt-2 justify-around gap-2'>
                        <div>
                          <label className='text-sm text-gray-500'>
                            History Start Date{' '}
                            {showingHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.startDate === null
                                  ? ''
                                  : `${formatSafeDate(item.startDate)}`}
                              </span>
                            ))}
                          </label>
                        </div>
                        <div>
                          <label className='text-sm text-gray-500'>
                            History End Date{' '}
                            {showingHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.endDate === null
                                  ? 'Invalid end date'
                                  : formatSafeDate(item.endDate)}
                              </span>
                            ))}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            ))
          )}
        </div>
        {/* Pending */}
        <div className='h-[650px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
          <h3 className='mb-5 text-lg font-bold text-[#f1c232] dark:text-gray-400 text-center'>
            Pending Menus List
          </h3>
          {loading ? (
            <div colSpan='5' className='text-center p-5'>
              <Spin size='large' />
            </div>
          ) : (
            viewPendingMenus &&
            viewPendingMenus.viewMenus &&
            viewPendingMenus.viewMenus.map((item, i) => (
              <ul
                key={i}
                className='bg-white w-full mb-2 border border-[#f1c232] shadow overflow-hidden sm:rounded-md'
              >
                <li>
                  <div className='px-4 w-full py-5 sm:px-6'>
                    <div className='items-center flex justify-between'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        {item.menuName}
                      </h3>
                    </div>
                    <p className='max-w-2xl mb-2 text-sm text-gray-500'>
                      Description : {item.menuDescribe}
                    </p>
                    <div className='flex gap-4'>
                      <div>
                        <label className='text-sm text-gray-500'>
                          Start Date:{' '}
                          <span>
                            {item.startDate === null
                              ? ''
                              : formatSafeDate(item.startDate)}
                          </span>{' '}
                        </label>
                      </div>
                      <label className='text-sm text-gray-500'>
                        End Date:{' '}
                        <span>
                          {item.endDate === null
                            ? 'Unlimited end date'
                            : formatSafeDate(item.endDate)}
                        </span>{' '}
                      </label>
                    </div>
                    <div className='mt-2 gap-3 flex items-center justify-end'>
                      <div>
                        <button
                          onClick={() => {
                            toggle();
                            handleShowMeals(item.listMeals, item.menuName);
                          }}
                          className='text-end mr-2 font-medium text-blue-600 hover:text-indigo-500'
                        >
                          Show Meals
                        </button>
                        <span className='xl:inline lg:hidden'>|</span>
                        <button
                          onClick={() => {
                            handlePendingHistoryApplication(item.menuId);
                          }}
                          className='text-end font-medium xl:ml-2 lg:ml-0 text-blue-600 hover:text-indigo-500'
                        >
                          History application
                        </button>
                      </div>
                    </div>
                    {visiblePendingHistoryMenu === item.menuId && visiblePendingHistory && (
                      <div className='flex mt-2 justify-around gap-2'>
                        <div className='mb-2'>
                          <label className='text-sm text-gray-500'>
                            History Start Date{' '}
                            {showingPendingHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.startDate === null
                                  ? ''
                                  : `${formatSafeDate(item.startDate)}`}
                              </span>
                            ))}
                          </label>
                        </div>
                        <div>
                          <label className='text-sm text-gray-500'>
                            History End Date{' '}
                            {showingPendingHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.endDate === null
                                  ? 'Unlimited end date'
                                  : formatSafeDate(item.endDate)}
                              </span>
                            ))}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            ))
          )}

          <Modal
            isShowing={isShowing}
            hide={toggle}
            mealsData={mealsData}
            menuName={menuName}
          />
        </div>
        {/* Reject */}
        <div className='h-[650px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
          <h3 className='mb-5 text-lg font-bold text-[#cc0000] dark:text-gray-400 text-center'>
            Unavailable Menus List
          </h3>
          {loading ? (
            <div colSpan='5' className='text-center p-5'>
              <Spin size='large' />
            </div>
          ) : (
            listMenuReject &&
            listMenuReject.viewMenus &&
            listMenuReject.viewMenus.map((item, i) => (
              <ul
                key={i}
                className='bg-white w-full mb-2 border border-[#cc0000] shadow overflow-hidden sm:rounded-md'
              >
                <li>
                  <div className='px-4 w-full py-5 sm:px-6'>
                    <div className='items-center justify-between'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        {item.menuName}
                      </h3>
                      <p className='max-w-2xl mb-2 text-sm text-gray-500'>
                        Description : {item.menuDescribe}
                      </p>
                      <div className='flex gap-4'>
                        <div>
                          <label className='text-sm text-gray-500'>
                            Start Date:{' '}
                            <span>
                              {item.startDate === null
                                ? ''
                                : formatSafeDate(item.startDate)}
                            </span>{' '}
                          </label>
                        </div>
                        <div>
                          <label className='text-sm text-gray-500'>
                            End Date:{' '}
                            <span>
                              {item.endDate === null
                                ? 'Invalid'
                                : formatSafeDate(item.endDate)}
                            </span>{' '}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='mt-4 gap-3 flex items-center justify-end'>
                      <div>
                        <button
                          onClick={() => {
                            toggle();
                            handleShowMeals(item.listMeals, item.menuName);
                          }}
                          className='text-end mr-2 font-medium text-blue-600 hover:text-indigo-500'
                        >
                          Show Meals
                        </button>
                        <span className='xl:inline lg:hidden'>|</span>
                        <button
                          onClick={() => {
                            handleRejectHistoryApplication(item.menuId);
                          }}
                          className='text-end font-medium xl:ml-2 lg:ml-0 text-blue-600 hover:text-indigo-500'
                        >
                          History application
                        </button>
                      </div>
                    </div>
                    {visibleRejectHistoryMenu === item.menuId && visibleRejectHistory && (
                      <div className='flex mt-2 justify-around gap-2'>
                        <div>
                          <label className='text-sm text-gray-500'>
                            History Start Date{' '}
                            {showingRejectHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.startDate === null
                                  ? ''
                                  : `${formatSafeDate(item.startDate)}`}
                              </span>
                            ))}
                          </label>
                        </div>
                        <div>
                          <label className='text-sm text-gray-500'>
                            History End Date{' '}
                            {showingRejectHistoryApplication.map((item, i) => (
                              <span key={i} className='flex'>
                                {item && item.endDate === null
                                  ? 'Unlimited end date'
                                  : formatSafeDate(item.endDate)}
                              </span>
                            ))}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            ))
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default ListContent;
