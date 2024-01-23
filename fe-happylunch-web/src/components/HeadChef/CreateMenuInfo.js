import React from 'react';
import BtnCreate from '../Commons/SubmitBtn';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import DatePickerComponent from '../Commons/DatePicker';
import DateEndPicker from '../Commons/DateEndPicker';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import MenuService from '../../services/MenuService';
import { useRef } from 'react';
import { Tour, Spin } from 'antd';
import { Button, Modal } from 'flowbite-react';
function CreateMenuInfo() {
  const menuService = new MenuService();
  const [selectMenuCate, setSelectMenuCate] = useState('');
  const [selectMenuName, setSelectMenuName] = useState([]);
  const [selectMenu, setSelectMenu] = useState([]);
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [menuName, setMenuName] = useState('');
  const [describe, setDescribe] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [getSessionMealSelected, setGetSessionMealSelected] = useState([]);
  const location = useLocation();
  const [errorDate, setErrorDate] = useState(0);
  const navigate = useNavigate();

  const menuInfoSession = JSON.parse(sessionStorage.getItem('previewMealData'));
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const [open, setOpen] = useState(false);
  const [openModalSendRequest, setOpenModalSendRequest] = useState(false);
  const [openModalSaveDraft, setOpenModalSaveDraft] = useState(false);
  const [spinning, setSpinning] = React.useState(false);
  // Updated previewMenu function
  const steps = [
    {
      title: 'Step 4',
      description: 'Fill the information',
      target: () => ref1.current,
    },
    {
      title: 'Step 5',
      description: (
        <div>
          Click button &quot;Preview menu&quot; <br />
          (Note: Each time you change information, you must preview it once)
        </div>
      ),
      target: () => ref2.current,
    },
    {
      title: 'Step 6: Option 1',
      description: 'Click button "Send request menu" to send menu request',
      target: () => ref3.current,
    },
    {
      title: 'Step 6: Option 2',
      description: 'Click button "Save draft menu" to save draft menu',
      target: () => ref4.current,
    },
  ];

  const previewMenu = () => {
    const currentDate = new Date();
    if (
      (selectMenuCate === '' && menuName === '') ||
      (selectMenuCate && menuName === '') ||
      (selectMenuCate === '' && menuName)
    ) {
      return setErrorDate(-1);
    } else if (
      (selectMenuCate &&
        menuName &&
        (StartDate === '' || StartDate === null)) ||
      (selectMenuCate &&
        menuName &&
        EndDate &&
        (StartDate === '' || StartDate === null))
    ) {
      return setErrorDate(1);
    } else if (
      selectMenuCate &&
      menuName &&
      StartDate &&
      EndDate &&
      EndDate < StartDate
    ) {
      return setErrorDate(2);
      // console.log('test')
    } else if (
      selectMenuCate &&
      menuName &&
      StartDate &&
      (EndDate !== null || EndDate === null) &&
      new Date(StartDate) < currentDate
    ) {
      return setErrorDate(3);
    } else if (describe === null || describe !== null) {
      setErrorDate(0);
      const previewAllData = [
        {
          menuName: menuName,
          describe: describe,
          menuCategoryName: selectMenuName,
          startDate: StartDate,
          endDate: EndDate === '' ? null : EndDate,
          mealIds: getSessionMealSelected,
        },
      ];
      // Log the previewData for debugging

      setPreviewData(previewAllData);
      sessionStorage.setItem('previewData', previewData);
    }
  };

  const createDraftMenu = async () => {
    // Lấy danh sách mealIds từ selectedMealDetailsData
    const selectedMealIds = getSessionMealSelected.map(
      (mealDetail) => mealDetail.mealId
    );

    const menuData = {
      menuName: menuName,
      describe: describe,
      menuCategoryId: selectMenuCate,
      startDate: StartDate,
      endDate: EndDate === '' ? null : EndDate,
      mealIds: selectedMealIds, // mealIds là một mảng các chuỗi
    };
    try {
      setSpinning(true);
      const response = await menuService.createMenu(menuData);
      if (response.code === 200) {
        toast.success(`${menuName} has been save draft.`);
        setSpinning(false);
        setOpenModalSaveDraft(false);
        setTimeout(() => {
          sessionStorage.removeItem('sessionSelectedMealDetails');
          sessionStorage.removeItem('previewMealData');
          sessionStorage.removeItem('sessionBackSelectedMeal');
          setPreviewData([]);
          setMenuName('');
          setStartDate('');
          setEndDate('');
          setDescribe('');
          setGetSessionMealSelected([]);
          navigate('/admin/menu_management/create_menu');
        }, 1000);
      }
    } catch (error) {
      setSpinning(false);
      toast.error(error);
    }
  };

  const sendRequestMenuToPending = async () => {
    const selectedMealIds = getSessionMealSelected.map(
      (mealDetail) => mealDetail.mealId
    );

    const menuData = {
      menuName: menuName,
      describe: describe,
      menuCategoryId: selectMenuCate,
      startDate: StartDate,
      endDate: EndDate === '' ? null : EndDate,
      mealIds: selectedMealIds, // mealIds là một mảng các chuỗi
    };
    console.log('menuData', menuData);
    try {
      setSpinning(true);
      const response = await menuService.createMenuAndPending(menuData);
      if (response.code === 200) {
        toast.success(`${menuName} has been request to pending menu.`);
        setSpinning(false);
        setOpenModalSaveDraft(false);
        setTimeout(() => {
          sessionStorage.removeItem('sessionSelectedMealDetails');
          sessionStorage.removeItem('previewMealData');
          sessionStorage.removeItem('sessionBackSelectedMeal');
          setPreviewData([]);
          setMenuName('');
          setStartDate('');
          setEndDate('');
          setDescribe('');
          setGetSessionMealSelected([]);
          navigate('/admin/menu_management/create_menu');
        }, 1000);
      }
    } catch (error) {
      setSpinning(false);
      toast.error(error);
    }
  };

  const getMenuCategory = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      console.log(response.response.data);
      if (response.code === 200) {
        setSelectMenu(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Add this function
  const formatSafeDate = (date) => {
    try {
      return format(new Date(date), 'MM/dd/yyyy:HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleStartDatePicker = (selectedStartDate) => {
    if (selectedStartDate != '') {
      setStartDate(selectedStartDate);
    } else if (menuInfoSession) {
      setStartDate(menuInfoSession[0]?.startDate);
    }
    // setStartDate(selectedStartDate);
  };

  const handleEndDatePicker = (selectedEndDate) => {
    if (selectedEndDate != '') {
      setEndDate(selectedEndDate);
    } else if (menuInfoSession) {
      setEndDate(menuInfoSession[0]?.endDate);
    }
  };

  const handleBack = () => {
    const previewData = {
      menuName: menuName,
      describe: describe,
      menuCategoryName: selectMenuName,
      menuCategoryId: selectMenuCate,
      startDate: StartDate,
      endDate: EndDate,
      mealIds: getSessionMealSelected,
    };

    sessionStorage.setItem('previewMealData', JSON.stringify([previewData]));
    sessionStorage.setItem(
      'sessionBackSelectedMeal',
      JSON.stringify(getSessionMealSelected)
    );
    setPreviewData([]);
    navigate('/admin/menu_management/create_menu');
  };
  useEffect(() => {
    const mealSession = JSON.parse(
      sessionStorage.getItem('sessionSelectedMealDetails')
    );
    setGetSessionMealSelected(mealSession);

    if (location.state?.menuInfoSession) {
      location.state?.menuInfoSession.map((item) => {
        if (item.menuName) {
          setMenuName(item.menuName);
        }

        // Check if menuCategoryName exists in the item before setting the state
        if (item.menuCategoryId) {
          setSelectMenuCate(item.menuCategoryId);
        }

        if (item.menuCategoryName) {
          setSelectMenuName(item.menuCategoryName);
        }
      });
    }

    if (menuInfoSession) {
      setEndDate(menuInfoSession[0].endDate);
      setStartDate(menuInfoSession[0].startDate);
      setDescribe(menuInfoSession[0].describe);
    }
  }, []);

  useEffect(() => {
    getMenuCategory();
  }, []);
  console.log('previewData: ', previewData);
  return (
    <div>
      <Spin spinning={spinning} fullscreen />
      <div className='mb-2'>
        <div className='flex justify-between mb-4'>
          <h2 className='font-bold text-2xl'>Create Menu Information</h2>
          <Tour
            open={open}
            onClose={() => setOpen(false)}
            steps={steps}
            indicatorsRender={(current, total) => (
              <span>
                {current + 1} / {total}
              </span>
            )}
          ></Tour>
          <button
            onClick={() => setOpen(true)}
            className='rounded-md last:text-sm px-5 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium'
          >
            Guidelines
          </button>
        </div>
        <div className='grid gap-2 xl:grid-cols-2 2xl:grid-cols-2 mt-4'>
          <div className='col-span-1'>
            <div
              ref={ref1}
              className='shadow-sm h-[700px] p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'
            >
              <div className='text-center text-base font-bold flex-grow'>
                Menu Information
              </div>
              <div>
                <label htmlFor='underline_select' className='sr-only'>
                  Underline select
                </label>
                <select
                  id='underline_select'
                  className='mt-2 py-2.5 px-2 w-1/2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                  value={selectMenuCate}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectMenuCate(selectedValue);

                    const selectedItem = selectMenu.find(
                      (item) => item.menuCategoryId === selectedValue
                    );

                    if (selectedItem) {
                      setSelectMenuName(selectedItem.menuCategoryName);
                    }
                  }}
                >
                  <option value=''>---Choose a menu category---</option>
                  {selectMenu.map((item, i) => (
                    <option
                      key={i}
                      value={item.menuCategoryId}
                      title={item.menuCategoryName}
                    >
                      {item.menuCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-3 mt-4'>
                <label
                  htmlFor='base-input'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Menu Name
                </label>
                <input
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  required
                  type='text'
                  id='base-input'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <div className=' mt-6 flex gap-20 items-center'>
                <div>
                  <label
                    htmlFor='base-input'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Start Date
                  </label>
                  <DatePickerComponent
                    onSelectedDatePicker={handleStartDatePicker}
                    getADate={StartDate}
                  ></DatePickerComponent>
                </div>
                <div>
                  <label
                    htmlFor='base-input'
                    className='block text-sm font-medium text-gray-900 dark:text-white'
                  >
                    End Date
                  </label>
                  <DateEndPicker
                    onSelectedEndDatePicker={handleEndDatePicker}
                    getAEndDate={EndDate}
                  ></DateEndPicker>
                </div>
              </div>
              <div className='text-red-700 text-sm  '>
                {errorDate === 1 ? 'StartDate must required!' : ''}
              </div>
              <div className='text-red-700 text-sm underline '>
                {errorDate === 2 ? 'EndDate not before StartDate!' : ''}
              </div>
              <div className='text-red-700 text-sm underline '>
                {errorDate === 3 ? 'StartDate must after current date!' : ''}
              </div>
              <div>
                <label
                  htmlFor='message'
                  className='block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Description
                </label>
                <textarea
                  onChange={(e) => setDescribe(e.target.value)}
                  value={describe}
                  id='message'
                  rows={4}
                  className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  placeholder='Write your thoughts here...'
                  defaultValue={''}
                />
              </div>
              <div className='text-red-700 text-sm underline '>
                {errorDate === -1 ? 'Required enter field' : ''}
              </div>
              <div className='App'>
                <button
                  ref={ref2}
                  className='rounded-md last:text-sm px-14 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium'
                  onClick={previewMenu}
                >
                  Menu Preview
                </button>
              </div>
            </div>
          </div>
          <div className='col-span-1'>
            <div className='shadow-sm  h-[700px] p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
              <div className='text-center text-base font-bold flex-grow'>
                Menu Preview
              </div>
              {previewData &&
                previewData.map((item, i) => (
                  <div key={i}>
                    <div>
                      <label className='text-base text-gray-700'>
                        Menu Category: <span>{item.menuCategoryName}</span>{' '}
                      </label>
                    </div>
                    <div>
                      <label className='text-base text-gray-700'>
                        Menu Name: <span>{item.menuName}</span>{' '}
                      </label>
                    </div>
                    <div className='flex gap-4 mt-2'>
                      <div>
                        <label className='text-base text-gray-700'>
                          Start Date:{' '}
                          <span>
                            {item.startDate === null
                              ? ''
                              : formatSafeDate(item.startDate)}
                          </span>{' '}
                        </label>
                      </div>
                      <label className='text-base text-gray-700'>
                        End Date:{' '}
                        <span>
                          {item.endDate === null
                            ? 'Invalid'
                            : formatSafeDate(item.endDate)}
                        </span>{' '}
                      </label>
                    </div>
                    <div className='mt-2'>
                      <label className='text-sm text-gray-600'>
                        Description: <span>{item.describe}</span>
                      </label>
                    </div>
                  </div>
                ))}
              <div className='flex flex-col mt-4'>
                <div className='py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
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
                      </tr>
                    </thead>
                    <tbody className='bg-white'>
                      {getSessionMealSelected?.map((item, i) => (
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
                              {item.mealPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                            <span className='text-sm leading-5 text-gray-500'>
                              {item.mealDescribe}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData.length > 0 && (
                    <div className='text-center mt-[48px] flex justify-center gap-4'>
                      <div ref={ref3}>
                        <button
                          onClick={() => setOpenModalSendRequest(true)}
                          type='button'
                          className='text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-md shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg'
                        >
                          <div className='lg:flex md:flex sm:flex justify-center text-sm'>
                            <p className='md:w-max sm:w-max px-10 align-middle mt-0.5'>
                              Send menu to pending
                            </p>
                          </div>
                        </button>
                      </div>
                      <div ref={ref4}>
                        <button
                          onClick={() => setOpenModalSaveDraft(true)}
                          type='button'
                          className='text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300  shadow-md shadow-yellow-300/50 dark:shadow-lg  font-medium rounded-lg'
                        >
                          <div className='lg:flex md:flex sm:flex justify-center text-sm'>
                            <p className='md:w-max sm:w-max px-10 align-middle mt-0.5'>
                              Save Draft menu
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex py-5 '>
          {/* <Link to={'/admin/menu_management/create_menu'}> */}
          <div className='text-left align-middle'>
            <svg
              className='w-4 h-4 text-blue-800 dark:text-white mt-1 mr-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 5H1m0 0 4 4M1 5l4-4'
              />
            </svg>
          </div>
          <button onClick={handleBack}>
            <span className='hover:text-blue-600'>Back to Menu</span>
          </button>
          {/* </Link> */}
        </div>
      </div>
      <ToastContainer></ToastContainer>
      <>
        <Modal
          show={openModalSendRequest}
          size='md'
          onClose={() => setOpenModalSendRequest(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-14 w-14'>
                <svg
                  fill='#006eff'
                  width='40px'
                  height='40px'
                  viewBox='0 0 16 16'
                  id='request-sent-16px'
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
                      id='Path_50'
                      data-name='Path 50'
                      d='M-11.5,0h-11A2.5,2.5,0,0,0-25,2.5v8A2.5,2.5,0,0,0-22.5,13h.5v2.5a.5.5,0,0,0,.309.462A.489.489,0,0,0-21.5,16a.5.5,0,0,0,.354-.146L-18.293,13H-11.5A2.5,2.5,0,0,0-9,10.5v-8A2.5,2.5,0,0,0-11.5,0ZM-10,10.5A1.5,1.5,0,0,1-11.5,12h-7a.5.5,0,0,0-.354.146L-21,14.293V12.5a.5.5,0,0,0-.5-.5h-1A1.5,1.5,0,0,1-24,10.5v-8A1.5,1.5,0,0,1-22.5,1h11A1.5,1.5,0,0,1-10,2.5Zm-2.038-3.809a.518.518,0,0,1-.109.163l-2,2A.5.5,0,0,1-14.5,9a.5.5,0,0,1-.354-.146.5.5,0,0,1,0-.708L-13.707,7H-18.5A1.5,1.5,0,0,0-20,8.5a.5.5,0,0,1-.5.5.5.5,0,0,1-.5-.5A2.5,2.5,0,0,1-18.5,6h4.793l-1.147-1.146a.5.5,0,0,1,0-.708.5.5,0,0,1,.708,0l2,2a.518.518,0,0,1,.109.163A.505.505,0,0,1-12.038,6.691Z'
                      transform='translate(25)'
                    />{' '}
                  </g>
                </svg>
              </div>
              <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                Are you sure you want to send request to menu pending?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button
                  color='blue'
                  onClick={sendRequestMenuToPending}
                >
                  Yes, I&apos;m sure
                </Button>
                <Button
                  color='gray'
                  onClick={() => setOpenModalSendRequest(false)}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
      <>
        <Modal
          show={openModalSaveDraft}
          size='md'
          onClose={() => setOpenModalSaveDraft(false)}
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <div className='mx-auto mb-4 h-14 w-14'>
                <svg
                  width='64px'
                  height='64px'
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
                      d='M6 18.5V9.62132C6 9.2235 6.15803 8.84197 6.43934 8.56066L10.5607 4.43934C10.842 4.15804 11.2235 4 11.6213 4H16.5C17.3284 4 18 4.67157 18 5.5V18.5C18 19.3284 17.3284 20 16.5 20H7.5C6.67157 20 6 19.3284 6 18.5Z'
                      stroke='#ffa200'
                      strokeWidth={2}
                    />{' '}
                    <path
                      d='M6 10H10.5C11.3284 10 12 9.32843 12 8.5V4'
                      stroke='#ffa200'
                      strokeWidth='1.5'
                    />{' '}
                  </g>
                </svg>
              </div>
              <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                Are you sure you want to save draft menu?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='yellow' onClick={createDraftMenu}>
                  Yes, I&apos;m sure
                </Button>
                <Button
                  color='gray'
                  onClick={() => setOpenModalSaveDraft(false)}
                >
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </div>
  );
}

export default CreateMenuInfo;
