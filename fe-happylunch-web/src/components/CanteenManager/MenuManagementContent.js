import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import MenuService from '../../services/MenuService';

import { format } from 'date-fns';
import useModal from '../Commons/UseModal';
// import MenuModal from '../Commons/ModalMenu';
import { Button, Modal, Datepicker } from 'flowbite-react';
import { HiCheckCircle, HiOutlineExclamationCircle } from 'react-icons/hi';
import DatePickerComponent from '../Commons/DatePicker';
import DateEndPicker from '../Commons/DateEndPicker';
import ReactDOM from 'react-dom';
import { Spin, DatePicker, Button as btnAffix, Affix } from 'antd';
function MenuManagementContent() {
  const [menuCate, setMenuCate] = useState([]);
  const [selectTab, setSelectTab] = useState(null);
  const [selectedMenuCate, setSelectedMenuCate] = useState([]);
  const [checkedMenus, setCheckedMenus] = useState([]);
  const [checkApproveMenus, setCheckApproveMenus] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { isShowing, toggle } = useModal();
  const [mealsData, setMealsData] = useState([]);
  const menuService = new MenuService();
  const [openModal, setOpenModal] = useState(false);
  const [viewPendingMenus, setPendingMenus] = useState([]);
  const [listMenuApproved, setListMenuApproved] = useState([]);
  const [listMenuReject, setListMenuReject] = useState([]);
  const [showCount, setShowCount] = useState('');
  const [comment, setComment] = useState('');
  const [menuName, setMenuName] = useState('');
  const [showingHistoryApplication, setShowingHistoryApplication] =
    useState(false);
  const [
    showingPendingHistoryApplication,
    setShowingPendingHistoryApplication,
  ] = useState(false);
  const [showingRejectHistoryApplication, setShowingRejectHistoryApplication] =
    useState(false);
  const [visibleApproveHistoryMenu, setVisibleApproveHistoryMenu] =
    useState(null);
  const [visibleRejectHistoryMenu, setVisibleRejectHistoryMenu] =
    useState(null);
  const [visiblePendingHistoryMenu, setVisiblePendingHistoryMenu] =
    useState(null);
  const [startDateRestore, setStartDateRestore] = useState('');
  const [endDateRestore, setEndDateRestore] = useState('');
  const [menuIdRestore, setMenuIdRestore] = useState('');
  const [menuNameRestore, setMenuNameRestore] = useState('');
  const [validateMessage, setValidateMessage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuIdShowMeals, setMenuIdShowMeals] = useState('');
  const [checkRejectMenuAvai, setCheckRejectMenuAvai] = useState('');
  const [visibleApproveHistory, setVisibleApproveHistory] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [visiblePendingHistory, setVisiblePendingHistory] = useState(false);
  const [currentPendingMenuId, setCurrentPendingMenuId] = useState(null);
  const [visibleRejectHistory, setVisibleRejectHistory] = useState(false);
  const [currentRejectMenuId, setCurrentRejectMenuId] = useState(null);
  const [container, setContainer] = React.useState(null);
  const [containerPending, setContainerPending] = React.useState(null);
  const handleSelectMenuCate = (menuCateId) => {
    setSelectedMenuCate(menuCateId);
    setSelectTab(menuCateId);
    setCheckedMenus([]);
    setSelectAll(false);
    setCheckApproveMenus([]);
  };

  const handleCheckboxPendingChange = (menuId) => {
    if (checkedMenus.includes(menuId)) {
      setCheckedMenus(checkedMenus.filter((id) => id !== menuId));
    } else {
      setCheckedMenus([...checkedMenus, menuId]);
    }
  };

  const handleCheckboxApproveChange = (menuId) => {
    if (checkApproveMenus.includes(menuId)) {
      setCheckApproveMenus(checkApproveMenus.filter((id) => id !== menuId));
    } else {
      setCheckApproveMenus([...checkApproveMenus, menuId]);
    }
  };

  const handleStartDatePicker = (selectedStartDate) => {
    setStartDateRestore(selectedStartDate);
  };

  const handleEndDatePicker = (selectedEndDate) => {
    setEndDateRestore(selectedEndDate);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      // Nếu là lần chọn, thêm tất cả menuId vào mảng
      const allMenuIds =
        viewPendingMenus?.viewMenus?.map((item) => item.menuId) || [];
      setCheckedMenus(allMenuIds);
    } else {
      // Nếu là lần bỏ chọn, xóa hết menuId khỏi mảng
      setCheckedMenus([]);
    }
  };
  const handleShowMeals = (mealsData, menuName, menuId) => {
    setMealsData(mealsData);
    setMenuName(menuName);
    setMenuIdShowMeals(menuId);
  };

  const formatSafeDate = (date) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy (HH:mm)');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleApproveCheckedMenu = () => {
    const menuId = {
      listMenuIds: [menuIdShowMeals],
    };
    console.log('listMenuIds: ', menuId);
    if (menuId) {
      approveMenu(menuId);
    }
  };

  const handleRejectMenu = () => {
    const listMenuIds = {
      listMenuIds: checkedMenus.length > 0 ? checkedMenus : checkApproveMenus,
      comments: comment,
    };

    if (listMenuIds) {
      rejectMenu(listMenuIds);
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
          setVisiblePendingHistory(true);
        } else {
          setShowingPendingHistoryApplication(null);
          setVisiblePendingHistory(false);
        }
      } else {
        setVisiblePendingHistory(!visiblePendingHistory);
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
        setCurrentRejectMenuId(menuId);
        const historyData = await getListHistoryApplication(menuId);
        if (historyData && historyData.viewDateApplications) {
          setShowingRejectHistoryApplication(historyData.viewDateApplications);
          setVisibleRejectHistory(true);
        } else {
          setShowingRejectHistoryApplication(null);
          setVisibleRejectHistory(false);
        }
      } else {
        setVisibleRejectHistory(!visibleRejectHistory);
      }
      setVisibleRejectHistoryMenu(menuId);
    } catch (error) {
      console.error('Error in handleApproveHistoryApplication:', error);
      // Handle the error as needed
    }
  };

  const handleRestoreMenu = (menuId) => {
    const currentDate = new Date();
    if (
      startDateRestore === null ||
      startDateRestore === '' ||
      ((startDateRestore === null || startDateRestore === '') && endDateRestore)
    ) {
      return setValidateMessage(1);
    } else if (
      startDateRestore &&
      endDateRestore &&
      endDateRestore < startDateRestore
    ) {
      return setValidateMessage(2);
    } else if (
      startDateRestore &&
      (endDateRestore !== null || endDateRestore === null) &&
      new Date(startDateRestore) < currentDate
    ) {
      return setValidateMessage(3);
    } else {
      setValidateMessage(0);
      const restoreData = {
        menuId: menuId,
        startDate: startDateRestore,
        endDate: endDateRestore === '' ? null : endDateRestore,
      };
      if (restoreData) {
        sentRequestMenuUnavailableToPending(restoreData);
      }
    }
  };

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
  const getListMenusPendingByCate = async (menuCategoryId) => {
    try {
      setLoading(true);
      const response = await menuService.viewListMenusPendingByCategory(
        menuCategoryId
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

  const approveMenu = async (listMenuIds) => {
    try {
      const response = await menuService.approveMenu(listMenuIds);
      if (response.code === 200) {
        toast.success(response.response.data);
        await getListMenuApprovedByCategory(selectedMenuCate);
        await getListMenusPendingByCate(selectedMenuCate);
        await getListMenuRejectByCategory(selectedMenuCate);
        setCheckedMenus([]);
        setCheckApproveMenus([]);
        setSelectAll(false);
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const rejectMenu = async (rejectData) => {
    try {
      const response = await menuService.rejectMenu(rejectData);
      if (response.code === 200) {
        toast.success(response.response.data);
        await getListMenuRejectByCategory(selectedMenuCate);
        await getListMenusPendingByCate(selectedMenuCate);
        await getListMenuApprovedByCategory(selectedMenuCate);
        setCheckedMenus([]);
        setCheckApproveMenus([]);
        setSelectAll(false);
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error.message);
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

  const sentRequestMenuUnavailableToPending = async (restoreData) => {
    try {
      const res = await menuService.sentRequestMenuUnavailableToPending(
        restoreData
      );
      if (res.code === 200) {
        toast.success(res.response.data);
        await getListMenuRejectByCategory(selectedMenuCate);
        getListMenusPendingByCate(selectedMenuCate);
        setOpenModal(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getListMenuCate();
  }, []);

  useEffect(() => {
    if (selectedMenuCate) {
      getListMenusPendingByCate(selectedMenuCate);
      getListMenuApprovedByCategory(selectedMenuCate);
      getListMenuRejectByCategory(selectedMenuCate);
    }
  }, [selectedMenuCate]);

  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCate(menuCate[0]?.menuCategoryId);
  }, [menuCate[0]?.menuCategoryId]);

  return (
    <div>
      <div className='flex items-center justify-between pb-4'>
        <h2 className='font-bold text-2xl'>Manage Menu (Canteen Manager)</h2>
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
        <div className='lg:text-end md:text-end sm:text-left grow'></div>
      </div>
      {/* Approved */}
      <div className=' grid grid-cols-3 gap-4 max-h-96'>
        <div
          ref={setContainer}
          className=' h-[600px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'
        >
          <h3 className='mb-5 text-lg font-bold text-green-600 dark:text-gray-400 text-center'>
            Available Menus List
          </h3>
          <div className='xl:flex lg:block items-center mb-3'>
            <span className='align-middle text-gray-500'>
              Search menu date:{' '}
            </span>
            <div className='xl:w-1/2 lg:w-fit xl:px-2 lg:px-0'>
              <DatePicker onChange={onChange} />
            </div>
          </div>
          {checkApproveMenus.length > 0 && (
            <Affix target={() => container}>
              <div className='mb-5 mt-2'>
                <button
                  onClick={() => {
                    setOpenModal(true);
                    setShowCount('RejectCheckbox');
                  }}
                  className=' text-white border border-red-700 bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                >
                  Reject {checkApproveMenus.length} Menus
                </button>
              </div>
            </Affix>
          )}
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
                      <div className='flex items-center '>
                        <input
                          checked={checkApproveMenus.includes(item.menuId)}
                          onChange={() =>
                            handleCheckboxApproveChange(item.menuId)
                          }
                          id={`checkbox-${i}`}
                          type='checkbox'
                          defaultValue=''
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label
                          htmlFor='default-checkbox'
                          className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                        ></label>
                      </div>
                    </div>
                    <p className='max-w-2xl text-sm text-gray-500 mb-2'>
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
                            setCheckRejectMenuAvai('trueApprove');
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
                    {visibleApproveHistoryMenu === item.menuId &&
                      visibleApproveHistory && (
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
        <div ref={setContainerPending} className='h-[600px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
          <h3 className='mb-5 text-lg font-bold text-[#f1c232] dark:text-gray-400 text-center'>
            Pending Menus List
          </h3>
          {checkedMenus && checkedMenus.length > 0 && (
            <Affix target={() => containerPending}>
              <div className='flex items-center gap-2 mb-2 mt-2'>
                <button
                  onClick={() => {
                    setOpenModal(true);
                    setShowCount('ApproveCheckbox');
                  }}
                  type='button'
                  className='text-white border border-green-700 bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center  dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800'
                >
                  Approve {checkedMenus.length} Menus
                </button>
                <button
                  onClick={() => {
                    setOpenModal(true);
                    setShowCount('RejectCheckbox');
                  }}
                  type='button'
                  className='text-white border border-red-700 bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center  dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                >
                  Reject {checkedMenus.length} Menus
                </button>
              </div>
            </Affix>
          )}
          {selectedMenuCate?.length > 0 ? (
            <div className='flex items-end justify-end mb-2'>
              <label
                htmlFor='default-checkbox'
                className='ms-2 text-sm font-medium mr-2 text-gray-900 dark:text-gray-300'
              >
                Check All
              </label>
              <input
                checked={selectAll}
                onChange={handleSelectAllChange}
                id='default-checkbox'
                type='checkbox'
                defaultValue=''
                className='w-4 h-4 mb-0.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
              />
            </div>
          ) : (
            ''
          )}
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
                className='bg-white border border-[#f1c232] w-full mb-2 shadow overflow-hidden sm:rounded-md'
              >
                <li className='relative'>
                  <div className='px-4 w-full py-5 pb-2 sm:px-6'>
                    <div className='items-center flex justify-between'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        {item.menuName}
                      </h3>
                      <div className='flex items-center'>
                        <input
                          checked={checkedMenus.includes(item.menuId)}
                          onChange={() =>
                            handleCheckboxPendingChange(item.menuId)
                          }
                          id={`checkbox-${i}`}
                          type='checkbox'
                          defaultValue=''
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                        />
                        <label
                          htmlFor='default-checkbox'
                          className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                        ></label>
                      </div>
                    </div>
                    <p className='max-w-2xl text-sm text-gray-500 mb-2'>
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
                              ? 'Unlimited end date'
                              : formatSafeDate(item.endDate)}
                          </span>{' '}
                        </label>
                      </div>
                    </div>
                    <div className='mt-2 gap-3 flex items-center justify-between xl:justify-end'>
                      <div>
                        <button
                          onClick={() => {
                            toggle();
                            handleShowMeals(
                              item.listMeals,
                              item.menuName,
                              item.menuId
                            );
                            setCheckRejectMenuAvai('truePending');
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
                    {visiblePendingHistoryMenu === item.menuId &&
                      visiblePendingHistory && (
                        <div className='flex mt-2 justify-around gap-2'>
                          <div>
                            <label className='text-sm text-gray-500'>
                              History Start Date{' '}
                              {showingPendingHistoryApplication.map(
                                (item, i) => (
                                  <span key={i} className='flex'>
                                    {item && item.startDate === null
                                      ? ''
                                      : `${formatSafeDate(item.startDate)}`}
                                  </span>
                                )
                              )}
                            </label>
                          </div>
                          <div>
                            <label className='text-sm text-gray-500'>
                              History End Date{' '}
                              {showingPendingHistoryApplication.map(
                                (item, i) => (
                                  <span key={i} className='flex'>
                                    {item && item.endDate === null
                                      ? 'Invalid end date'
                                      : formatSafeDate(item.endDate)}
                                  </span>
                                )
                              )}
                            </label>
                          </div>
                        </div>
                      )}
                  </div>
                </li>
              </ul>
            ))
          )}
          {isShowing
            ? ReactDOM.createPortal(
                <React.Fragment>
                  <div className='modal-overlay ' />
                  <div
                    className='modal-wrapper'
                    aria-modal
                    aria-hidden
                    tabIndex={-1}
                    role='dialog'
                  >
                    <div className='modal m-auto mt-64 max-h-[670px] max-w-[1000px]'>
                      <div className='modal-header flex justify-between items-center'>
                        <div className='text-center text-2xl font-bold flex-grow'>
                          Meal list of &quot;{menuName}&quot;
                        </div>
                        <button
                          type='button'
                          className='modal-close-button'
                          data-dismiss='modal'
                          aria-label='Close'
                          onClick={() => {
                            toggle();
                          }}
                        >
                          <span aria-hidden='true'>x</span>
                        </button>
                      </div>
                      {checkRejectMenuAvai === 'trueRestore' ? (
                        <button
                          onClick={() => {
                            setOpenModal(true);
                            setShowCount('Restore');
                            toggle();
                          }}
                          className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                        >
                          Restore
                        </button>
                      ) : (
                        <div>
                          <button
                            onClick={() => {
                              setOpenModal(true);
                              setShowCount('Approved');
                              toggle();
                            }}
                            type='button'
                            className={`${
                              checkRejectMenuAvai === 'trueApprove'
                                ? 'hidden'
                                : 'inline'
                            } text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800`}
                          >
                            Approve Menus
                          </button>
                          <button
                            onClick={() => {
                              setOpenModal(true);
                              setShowCount('Reject');
                              toggle();
                            }}
                            type='button'
                            className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                          >
                            Reject Menus
                          </button>
                        </div>
                      )}
                      <div className='flex flex-col'>
                        <div className='py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
                          <div className='max-h-[400px] overflow-y-auto inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg'>
                            <table className='min-w-full'>
                              <thead>
                                <tr>
                                  <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                                    Meal Name
                                  </th>
                                  <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                                    Meal Price
                                  </th>
                                  <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                                    Description
                                  </th>
                                  <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                                    IsDelete
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='bg-white'>
                                {mealsData?.map((item, i) => (
                                  <tr key={i}>
                                    <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                      <div className='flex items-center'>
                                        <div className='flex-shrink-0 w-10 h-10'>
                                          <img
                                            className='w-10 h-10 rounded-full'
                                            src={item.image}
                                            alt={item.mealName}
                                          />
                                        </div>
                                        <div className='ml-4'>
                                          <div className='text-sm font-medium leading-5 text-gray-900'>
                                            {item.mealName}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                      <div className='text-sm leading-5 text-gray-500'>
                                        {item.mealPrice.toLocaleString(
                                          'vi-VN',
                                          {
                                            style: 'currency',
                                            currency: 'VND',
                                          }
                                        )}
                                      </div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                      <span className='text-sm leading-5 text-gray-500'>
                                        {item.mealDescribe}
                                      </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                                      <span className='text-sm leading-5 text-gray-500'>
                                        {item.mealIsDelete}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>,
                document.body
              )
            : null}
        </div>
        {/* Reject */}
        <div className='h-[600px] shadow-sm p-4  border-2 border-gray-600 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto'>
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
                className='bg-white border border-[#cc0000] mb-2 w-full shadow overflow-hidden sm:rounded-md'
              >
                <li>
                  <div className='px-4 w-full py-5 sm:px-6'>
                    <div className='items-center justify-between'>
                      <h3 className='text-lg leading-6 font-medium text-gray-900'>
                        {item.menuName}
                      </h3>
                      <p className='max-w-2xl text-sm text-gray-500 mb-2'>
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
                    <div className='mt-4 gap-3   flex items-center justify-between xl:justify-end'>
                      <div>
                        <button
                          onClick={() => {
                            toggle();
                            handleShowMeals(item.listMeals, item.menuName);
                            setCheckRejectMenuAvai('trueRestore');
                            setMenuIdRestore(item.menuId);
                            setMenuNameRestore(item.menuName);
                          }}
                          className='text-end mr-1 font-medium text-blue-600 hover:text-indigo-500'
                        >
                          Show Meals
                        </button>
                        <span className='xl:inline lg:hidden'>|</span>
                        <button
                          onClick={() => {
                            handleRejectHistoryApplication(item.menuId);
                          }}
                          className='text-end font-medium xl:ml-1 xl:mr-1 lg:ml-0 lg:mr-0  text-blue-600 hover:text-indigo-500'
                        >
                          History application
                        </button>
                        <span className='xl:inline lg:hidden'>|</span>
                        <button
                          onClick={() => {
                            setOpenModal(true);
                            setShowCount('Restore');
                            setMenuIdRestore(item.menuId);
                            setMenuNameRestore(item.menuName);
                          }}
                          className='text-end xl:ml-1 lg:ml-0 font-medium text-red-600 hover:text-red-700'
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                    {visibleRejectHistoryMenu === item.menuId &&
                      visibleRejectHistory && (
                        <div className='flex mt-2 justify-around'>
                          <div>
                            <label className='text-sm text-gray-500'>
                              History Start Date:
                              {showingRejectHistoryApplication.length === 0 && (
                                <span> No start date</span>
                              )}
                            </label>
                          </div>
                          <div>
                            <label className='text-sm text-gray-500'>
                              History Start Date:
                              {showingRejectHistoryApplication.length === 0 && (
                                <span> No end date</span>
                              )}
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
              {showCount === 'Restore' ? (
                <div className='space-y-6'>
                  <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
                    Restore Menu Form
                    <p style={{ whiteSpace: 'pre-line' }}>
                      &quot;{menuNameRestore}&quot;
                    </p>
                  </h3>
                  <div>
                    <div>
                      <label
                        htmlFor='base-input'
                        className='block text-sm font-medium text-left text-gray-900 dark:text-white'
                      >
                        Start Date Restore
                      </label>
                      <DatePickerComponent
                        onSelectedDatePicker={handleStartDatePicker}
                      ></DatePickerComponent>
                    </div>
                    <div>
                      <label
                        htmlFor='base-input'
                        className='block text-sm font-medium text-left mt-4 text-gray-900 dark:text-white'
                      >
                        End Date Restore
                      </label>
                      <DateEndPicker
                        onSelectedEndDatePicker={handleEndDatePicker}
                      ></DateEndPicker>
                    </div>
                  </div>
                  <div className='text-red-700 text-sm underline text-left '>
                    {validateMessage === 1 ? 'StartDate must required!' : ''}
                  </div>
                  <div className='text-red-700 text-sm underline text-left'>
                    {validateMessage === 2
                      ? 'EndDate not before StartDate!'
                      : ''}
                  </div>
                  <div className='text-red-700 text-sm underline text-left'>
                    {validateMessage === 3
                      ? 'StartDate must after current date!'
                      : ''}
                  </div>
                  <div className='ml-[90px] justify-center text-center'>
                    <Button
                      onClick={() => handleRestoreMenu(menuIdRestore)}
                      color='yellow'
                    >
                      Restore to Pending Menu
                    </Button>
                  </div>
                </div>
              ) : (
                ''
              )}
              {showCount === 'Approved' ? (
                <>
                  <HiCheckCircle className='mx-auto mb-4 h-14 w-14 text-green-600 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                    Are you sure you want to approve menu?
                  </h3>
                  <div className='flex justify-center gap-4'>
                    <Button
                      color='success'
                      onClick={() => {
                        handleApproveCheckedMenu();
                      }}
                    >
                      Yes, I&apos;m sure
                    </Button>
                    <Button
                      color='gray'
                      onClick={() => {
                        setOpenModal(false);
                        toggle();
                      }}
                    >
                      No, cancel
                    </Button>
                  </div>
                </>
              ) : (
                ''
              )}
              {showCount === 'Reject' ? (
                <>
                  <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                    Write some reason to reject menu?
                  </h3>
                  <>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                      id='message'
                      rows={4}
                      className='block p-2.5 mb-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='Write some reason...'
                      defaultValue={''}
                    />
                  </>
                  <div>
                    <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                      Do you want to reject menu?
                    </h3>
                    <div className='flex justify-center gap-4'>
                      <Button
                        color='failure'
                        onClick={() => {
                          handleRejectMenu();
                        }}
                      >
                        Yes, I&apos;m sure
                      </Button>
                      <Button
                        color='gray'
                        onClick={() => {
                          setOpenModal(false);
                          toggle();
                        }}
                      >
                        No, cancel
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
              {showCount === 'ApproveCheckbox' ? (
                <>
                  <HiCheckCircle className='mx-auto mb-4 h-14 w-14 text-green-600 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                    Are you sure you want to approve checked menu?
                  </h3>
                  <div className='flex justify-center gap-4'>
                    <Button
                      color='success'
                      onClick={() => {
                        handleApproveCheckedMenu();
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
              ) : (
                ''
              )}
              {showCount === 'RejectCheckbox' ? (
                <>
                  <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-red-600 dark:text-gray-200' />
                  <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                    Write some reason to reject checked menu?
                  </h3>
                  <>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                      id='message'
                      rows={4}
                      className='block p-2.5 mb-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                      placeholder='Write some reason...'
                      defaultValue={''}
                    />
                  </>
                  <div>
                    <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                      Do you want to reject menu?
                    </h3>
                    <div className='flex justify-center gap-4'>
                      <Button
                        color='failure'
                        onClick={() => {
                          handleRejectMenu();
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
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default MenuManagementContent;
