import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useRef } from 'react';
import MenuService from '../../services/MenuService';
import MealService from '../../services/MealService';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import SearchFieldComponent from '../Commons/SearchField';
import BtnCreate from '../Commons/SubmitBtn';
import BackMenuComponent from '../Commons/BackMenu';
import '../../index.css';
import UseModalCompare from '../Commons/UseModalCompare';
import { useNavigate } from 'react-router-dom';
import { DatePicker, Space, Select, Empty, Tour } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat);
function CreateMenuContent() {
  document.title = 'Create Menu';
  const [menuCate, setMenuCate] = useState([]);
  const [mealCate, setMealCate] = useState([]);
  const [mealList, setMealList] = useState([]);
  const [mealAll, setMealAll] = useState([]);
  const [selectMenuCate, setSelectMenuCate] = useState('');
  const [selectMealCate, setSelectMealCate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMealAll, setFilterMealAll] = useState(mealAll);
  const [filterMealList, setFilterMealList] = useState(mealList);
  const [selectTab, setSelectTab] = useState(null);
  const [selectedMenuCateToMealList, setSelectedMenuCateToMealList] =
    useState('');
  const [selectedMealDetails, setSelectedMealDetails] = useState({});

  const [selectedMenuCategoryName, setSelectedMenuCategoryName] = useState('');
  const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState('');
  const { isShowingCompare, toggleCompare } = UseModalCompare();
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  const [availableMenuList, setAvailableMenuList] = useState([]);
  const [unavailableMenuList, setUnavailableMenuList] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [hiddenStatusMenus, setHiddenStatusMenus] = useState([]);
  const [hiddenUlIndices, setHiddenUlIndices] = useState([]);
  const [mealSelected, setMealSelected] = useState([]);
  const [borderSelected, setBorderSelected] = useState([]);
  const [selectedFirstDate, setSelectedFirstDate] = useState(null);
  const [selectedSecondDate, setSelectedSecondDate] = useState(null);
  const [sortingOption, setSortingOption] = useState('');
  const [filteredAvailableMenus, setFilteredAvailableMenus] = useState([]);
  const menuService = new MenuService();
  const mealService = new MealService();
  const dateFormat = 'DD/MM/YYYY';
  // Lấy giá trị của selectedMealDetails và lặp qua chúng
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const [open, setOpen] = useState(false);

  const steps = [
    {
      title: 'Step 1',
      description: 'Choose type of menu',
      target: () => ref1.current,
    },
    {
      title: 'Import menu',
      description: 'You can import another menu exists',
      target: () => ref2.current,
    },
    {
      title: 'Sort and search',
      description: 'You can sort and search meal',
      target: () => ref3.current,
    },
    {
      title: 'Step 2',
      description:
        'Hover the item to show button "Select" and click to add meal',
      target: () => ref4.current,
    },
    {
      title: 'Step 3',
      description:
        'When the meal selected , the meal selected show here and the button "Next step" will appear to navigate next phase to create menu',
      target: () => ref5.current,
    },
  ];

  const getListMenuCate = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      if (response.code === 200 && response.response.data) {
        setMenuCate(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListMealCate = async () => {
    try {
      const response = await mealService.getListMealCate();
      if (response.code === 200 && response.response.data) {
        setMealCate(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListAllMealByMenuCate = async () => {
    try {
      const response = await mealService.viewListAllMealByMenuCate(
        selectedMenuCateToMealList
      );
      if (response.code === 200) {
        setMealAll(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListMealsFromMenuCateByMealCate = async () => {
    if (selectMealCate !== '') {
      try {
        const response = await mealService.viewListMealsFromMenuCateByMealCate(
          selectedMenuCateToMealList,
          selectMealCate
        );
        if (response.code === 200 && response.response.data) {
          setMealList(response.response.data);
        }
      } catch (error) {
        if (error.code === 400) {
          toast.error(error.code);
        }
      }
    }
  };

  const getListMenusUnavailableByCategory = async () => {
    try {
      const res = await menuService.viewListMenusUnavailableByCategory(
        selectedMenuCategoryId
      );
      if (res.code === 200 && selectedAvailability === 'Unavailable') {
        setUnavailableMenuList(res.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getListMenusAvailableByCategory = async () => {
    try {
      const res = await menuService.viewListMenuApprovedByCategory(
        selectedMenuCategoryId
      );
      if (res.code === 200 && selectedAvailability === 'Available') {
        setAvailableMenuList(res.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const searchData = () => {
      if (selectMealCate === '') {
        const query = removeAccents(searchQuery.toLowerCase().trim()); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi tìm kiếm
        const filtered = mealAll.filter((item) =>
          removeAccents(item.mealName.toLowerCase()).includes(query)
        );
        setFilterMealAll(filtered);
      } else {
        const query = removeAccents(searchQuery.toLowerCase().trim()); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi tìm kiếm
        const filtered = mealList.filter((item) =>
          removeAccents(item.mealName.toLowerCase()).includes(query)
        );
        setFilterMealList(filtered);
      }
    };
    searchData();
  }, [searchQuery, mealAll, mealList]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectMenuCate = (menuCateId) => {
    const selectedCategory = menuCate.find(
      (item) => item.menuCategoryId === menuCateId
    );
    if (selectedCategory) {
      setSelectedMenuCategoryName(selectedCategory.menuCategoryName);
      setSelectedMenuCategoryId(selectedCategory.menuCategoryId);
    }
    setSelectedMenuCateToMealList(menuCateId);
    setSelectTab(menuCateId);
    setSelectedAvailability(null);
  };

  const handleSelectMealChange = (event) => {
    const selectedMealCate = event.target.value;
    setSelectMealCate(selectedMealCate);
  };

  const handleClickUnavailable = (unavailability) => {
    setSelectedAvailability(unavailability);
  };

  const handleClickAvailable = (availability) => {
    setSelectedAvailability(availability);
  };

  const handleStatusMenuClick = (clickedMenu) => {
    // Kiểm tra xem đối tượng đã tồn tại trong selectedMenus hay chưa
    if (!selectedMenus.some((menu) => menu.menuId === clickedMenu.menuId)) {
      // Thêm đối tượng vào mảng selectedMenus
      setSelectedMenus((prevMenus) => [...prevMenus, clickedMenu]);
      // Ẩn đối tượng khỏi menu status
      setHiddenStatusMenus((prevMenus) => [...prevMenus, clickedMenu]);
    }
  };

  const handleSelectedMenuClick = (clickedMenu) => {
    setSelectedMenus((prevMenus) => {
      const updatedMenus = prevMenus.filter((menu) => menu !== clickedMenu);

      // Kiểm tra xem có dữ liệu trong selectedMealDetails không
      if (Object.keys(selectedMealDetails).length > 0) {
        // Lấy danh sách mealId từ selectedMealDetails
        const selectedMealIds = Object.keys(selectedMealDetails);

        // Kiểm tra xem có bất kỳ mealId nào trùng với selectedMenus không
        const isDuplicate = selectedMenus.some((menu) =>
          menu.listMeals.some((meal) => selectedMealIds.includes(meal.mealId))
        );

        // Nếu có, loại bỏ chúng khỏi selectedMealDetails
        if (isDuplicate) {
          setSelectedMealDetails((prevSelectedMealDetails) => {
            const updatedSelectedMealDetails = { ...prevSelectedMealDetails };

            selectedMealIds.forEach((mealId) => {
              delete updatedSelectedMealDetails[mealId];
            });

            return updatedSelectedMealDetails;
          });
        }
      }

      return updatedMenus;
    });

    setHiddenStatusMenus((prevMenus) =>
      prevMenus.filter((menu) => menu !== clickedMenu)
    );
  };

  const createCombine = () => {
    // Lấy danh sách bữa ăn từ selectedMenus
    const listMeals = selectedMenus.flatMap((menu) => menu.listMeals || []);

    // Lấy dữ liệu từ sessionBackSelectedMeal
    const sessionBackSelectedMeal =
      JSON.parse(sessionStorage.getItem('sessionBackSelectedMeal')) || [];

    // Tạo một Set để theo dõi mealIds đã xuất hiện
    const uniqueMealIds = new Set();

    // Cập nhật mealDetailsValues
    setSelectedMealDetails((prevSelectedMealDetails) => {
      const updatedMealDetails = { ...prevSelectedMealDetails };

      // Thêm các meals không trùng với sessionBackSelectedMeal vào setMealSelected
      const uniqueMealsFromListMeals = listMeals.filter(
        (meal) =>
          !sessionBackSelectedMeal.some(
            (existingMeal) => existingMeal.mealId === meal.mealId
          )
      );
      setMealSelected((prevMealSelected) => [
        ...prevMealSelected,
        ...uniqueMealsFromListMeals,
      ]);

      // Kiểm tra và lấy giá trị của sessionBackSelectedMeal và listMeals
      [sessionBackSelectedMeal, listMeals].forEach((mealsArray) => {
        mealsArray.forEach((meal) => {
          const mealId = meal.mealId;

          // Kiểm tra xem mealId đã xuất hiện chưa
          if (!uniqueMealIds.has(mealId)) {
            // Kiểm tra xem mealId đã tồn tại trong selectedMealDetailsValues chưa
            const isDuplicateInSelected = Object.values(
              updatedMealDetails
            ).some((existingMeal) => existingMeal.mealId === mealId);

            // Nếu mealId không trùng trong selectedMealDetailsValues, thêm meal vào selectedMealDetailsValues
            if (!isDuplicateInSelected) {
              updatedMealDetails[mealId] = {
                mealId: mealId,
                ...meal, // Sử dụng toàn bộ dữ liệu từ meal
              };
              uniqueMealIds.add(mealId);
            }
          }
        });
      });

      // Cập nhật lại selectedMealDetailsValues
      const updatedSelectedMealDetailsValues = Object.values(
        updatedMealDetails
      ).filter((meal) => meal !== null);
      setMealSelected(updatedSelectedMealDetailsValues);

      // Lưu vào session
      sessionStorage.setItem(
        'sessionSelectedMealDetails',
        JSON.stringify(updatedSelectedMealDetailsValues)
      );

      const newSelectedMealIds = updatedSelectedMealDetailsValues.map(
        (meal) => meal.mealId
      );
      setBorderSelected(newSelectedMealIds);

      return updatedMealDetails;
    });

    // Cập nhật lại selectedMenus
    toggleCompare();
  };

  const handleDivClick = (mealId) => {
    // Update selectedMealDetails state
    const mealDetails = mealAll.find((meal) => meal.mealId === mealId);
    if (mealDetails && mealDetails.mealId) {
      // Merge with existing selectedMealDetails and sessionBackSelectedMeal
      setSelectedMealDetails((prevSelectedMealDetails) => {
        const sessionBackSelectedMeal = JSON.parse(
          sessionStorage.getItem('sessionBackSelectedMeal')
        );

        // Check for null before using some method
        const isDuplicateInSession =
          sessionBackSelectedMeal &&
          sessionBackSelectedMeal.some(
            (existingMeal) => existingMeal.mealId === mealDetails.mealId
          );

        const isDuplicateInMealSelected =
          mealSelected &&
          mealSelected.some(
            (existingMeal) => existingMeal.mealId === mealDetails.mealId
          );

        // Check if mealDetails already exists in sessionBackSelectedMeal
        if (!isDuplicateInSession && !isDuplicateInMealSelected) {
          const mergedDetails = {
            ...prevSelectedMealDetails,
            ...sessionBackSelectedMeal,
            [mealDetails.mealId]: mealDetails,
          };

          // Update both states with the helper function
          updateSelectedMeals(Object.values(mergedDetails));

          return mergedDetails;
        } else {
          return prevSelectedMealDetails;
        }
      });
      setBorderSelected((prevIds) => [...prevIds, mealDetails.mealId]);
    }
  };

  const updateSelectedMeals = (newMeals) => {
    // Update selectedMealDetails state
    setSelectedMealDetails(newMeals);

    // Update mealSelected state
    setMealSelected(() => {
      // Filter out meals with null values
      const updatedMealSelected = newMeals.filter((meal) => meal !== null);
      return updatedMealSelected;
    });
  };

  useEffect(() => {
    // Save to session after selectedMealDetails state is updated
    const updatedSelectedMealDetailsValues =
      Object.values(selectedMealDetails) || [];
    sessionStorage.setItem(
      'sessionSelectedMealDetails',
      JSON.stringify(updatedSelectedMealDetailsValues)
    );

    // Update the mealSelected state after selectedMealDetails state is updated
    setMealSelected(updatedSelectedMealDetailsValues);
  }, [selectedMealDetails]);

  const navigate = useNavigate();
  const handleClick = () => {
    const menuInfoSession = JSON.parse(
      sessionStorage.getItem('previewMealData')
    );
    navigate('/admin/menu_management/create_menuInfo', {
      state: {
        menuCate: menuCate,
        selectMenuCate: selectMenuCate,
        selectMenuName: selectedMenuCategoryName,
        selectTabMenuCateId: selectTab,
        menuInfoSession: menuInfoSession,
        /* startDateSession: menuInfoSession[0].startDate */
      },
    });
  };


  useEffect(() => {
    const updatedSelectedMealDetailsValues =
      Object.values(selectedMealDetails) || [];
    setMealSelected(updatedSelectedMealDetailsValues);
    sessionStorage.setItem(
      'sessionSelectedMeal',
      JSON.stringify(Object.values(mealSelected) || [])
    );
    let backMealDetailsValues =
      JSON.parse(sessionStorage.getItem('sessionBackSelectedMeal')) || [];
    setMealSelected(
      updatedSelectedMealDetailsValues.concat(
        backMealDetailsValues.filter((meal) => meal !== null)
      )
    );
    const menuInfoSession = JSON.parse(
      sessionStorage.getItem('previewMealData')
    );
    console.log('menuInfoSession', menuInfoSession)
  }, []);

  useEffect(() => {
    let backMealDetailsValues =
      JSON.parse(sessionStorage.getItem('sessionBackSelectedMeal')) || [];
    const backMealIds = backMealDetailsValues.map((meal) => meal.mealId);
    setBorderSelected((prevIds) => [...prevIds, ...backMealIds]);
  }, []);

  // Save to session
  sessionStorage.setItem(
    'sessionSelectedMealDetails',
    JSON.stringify(mealSelected)
  );

  const handleClearAllMeal = () => {
    // Xóa tất cả món ăn đã chọn khỏi sessionStorage
    sessionStorage.removeItem('sessionBackSelectedMeal');
    sessionStorage.removeItem('sessionSelectedMealDetails');

    // Xóa tất cả món ăn đã chọn khỏi selectedMealDetailsValues
    setMealSelected([]);
    setBorderSelected('');
    updateSelectedMeals([]);
  };

  const handleRemoveFromSelected = (mealId) => {
    // Kiểm tra xem mealId có tồn tại trong dữ liệu selectedMealDetailsValues không
    const isMealInSelectedDetails = mealSelected.some(
      (meal) => meal && meal.mealId === mealId
    );

    if (isMealInSelectedDetails) {
      // Lọc ra các món ăn khác món cần xóa
      const updatedSelectedMealDetailsValues = mealSelected.filter(
        (meal) => meal && meal.mealId !== mealId
      );

      // Cập nhật state với mảng mới
      updateSelectedMeals(updatedSelectedMealDetailsValues);
      setBorderSelected((prevIds) => prevIds.filter((id) => id !== mealId));
      // Kiểm tra xem có món ăn nào còn không
      if (updatedSelectedMealDetailsValues.length === 0) {
        handleClearAllMeal();
      }
    }
  };

  const convertDateStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    );
  };

  const convertDateEndStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    );
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    const convertedDates = convertDateStrings(dateStrings);
    const convertedEndDates = convertDateEndStrings(dateStrings);
    setSelectedFirstDate(convertedDates[0]);
    setSelectedSecondDate(convertedEndDates[1]);
  };

  const handleSortingChange = (value) => {
    const selectedOption = value;
    setSortingOption(selectedOption);
  };

  useEffect(() => {
    const sortAndFilterMenus = () => {
      // Filter by date
      const filteredMenus =
        availableMenuList &&
        availableMenuList.viewMenus &&
        availableMenuList.viewMenus
          .filter((item) => {
            const itemStartDate = new Date(item.startDate).getTime();
            const firstDateTimestamp =
              selectedFirstDate && new Date(selectedFirstDate).getTime();
            const secondDateTimestamp =
              selectedSecondDate && new Date(selectedSecondDate).getTime();

            return (
              (!firstDateTimestamp || itemStartDate >= firstDateTimestamp) &&
              (!secondDateTimestamp || itemStartDate <= secondDateTimestamp)
            );
          })
          // Sort based on sorting option
          .sort((a, b) =>
            sortingOption === 'ASC'
              ? new Date(a.startDate) - new Date(b.startDate)
              : sortingOption === 'DES'
              ? new Date(b.startDate) - new Date(a.startDate)
              : 0
          );
      // Update the state
      setFilteredAvailableMenus(filteredMenus);
    };
    // Call the sorting and filtering function
    sortAndFilterMenus();
  }, [availableMenuList, selectedFirstDate, selectedSecondDate, sortingOption]);

  useEffect(() => {
    getListMenuCate();
    getListMealCate();
  }, []);

  useEffect(() => {
    if (selectMealCate.length > 0 || selectedMenuCateToMealList?.length > 0) {
      getListAllMealByMenuCate();
      getListMealsFromMenuCateByMealCate();
    }
  }, [selectMealCate, selectedMenuCateToMealList]);

  useEffect(() => {
    if (selectedAvailability === 'Available') {
      getListMenusAvailableByCategory();
    } else if (selectedAvailability === 'Unavailable') {
      getListMenusUnavailableByCategory();
    }
  }, [selectedAvailability]);

  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCateToMealList(menuCate[0]?.menuCategoryId);
  }, [menuCate[0]?.menuCategoryId]);
  return (
    <div>
      <div className='mb-2'>
        <div className='flex justify-between mb-4'>
          <h2 className='font-bold text-2xl'>Create Menu</h2>
          <Tour
            
            open={open}
            onClose={() => setOpen(false)}
            steps={steps}
            indicatorsRender={(current, total) => (
              <span>
                {current + 1} / {total}
              </span>
            )}
          >
          </Tour>
          <button onClick={() => setOpen(true)} className='rounded-md last:text-sm px-5 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium'>
              Guidelines
            </button>
        </div>
        <div className='grid gap-4 xl:grid-cols-2 2xl:grid-cols-2'>
          <div className='col-span-1'>
            <div className='p-4 max-h-full sm:p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 overflow-y-auto'>
              <div className='flex items-center'>
                <div ref={ref1} className='text-sm w-fit font-medium text-center'>
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
                              setSelectMenuCate(item.menuCategoryId);
                            } // Cập nhật giá trị của selectMenuCate khi người dùng thay đổi
                          }
                        >
                          {item.menuCategoryName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='ml-2'>
                  <button
                    ref={ref2}
                    className='rounded-md last:text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium'
                    onClick={toggleCompare}
                  >
                    Import menu
                  </button>
                  {isShowingCompare
                    ? ReactDOM.createPortal(
                        <React.Fragment>
                          <div className='modal-overlay' />
                          <div
                            className='modal-wrapper'
                            aria-modal
                            aria-hidden
                            tabIndex={-1}
                            role='dialog'
                          >
                            <div className='modal m-auto mt-36 max-h-[670px] xl:max-w-[1300px] lg:max-w-[1000px]'>
                              <div className='modal-header flex justify-between items-center'>
                                <div className='text-center text-2xl font-bold flex-grow'>
                                  Import menus
                                </div>
                                <button
                                  type='button'
                                  className='modal-close-button'
                                  data-dismiss='modal'
                                  aria-label='Close'
                                  onClick={toggleCompare}
                                >
                                  <span aria-hidden='true'>x</span>
                                </button>
                              </div>

                              <div className='text-sm w-fit font-medium text-center'>
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
                                          selectedMenuCategoryId ===
                                          item.menuCategoryId
                                            ? 'text-white bg-blue-600'
                                            : 'text-blue-600 bg-white'
                                        }`}
                                        onClick={() => {
                                          handleSelectMenuCate(
                                            item.menuCategoryId
                                          );
                                        }}
                                      >
                                        {item.menuCategoryName}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {selectedMenuCategoryId ? (
                                <div className='mt-3 flex'>
                                  <div>
                                    <button
                                      onClick={() =>
                                        handleClickAvailable('Available')
                                      }
                                      type='button'
                                      className={`${
                                        selectedAvailability === 'Available'
                                          ? 'text-white bg-green-800'
                                          : 'text-green-700 border-green-700'
                                      } text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800`}
                                    >
                                      Available
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() =>
                                        handleClickUnavailable('Unavailable')
                                      }
                                      type='button'
                                      className={`${
                                        selectedAvailability === 'Unavailable'
                                          ? 'text-white bg-red-800'
                                          : 'text-red-700 border-red-700'
                                      } text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-800`}
                                    >
                                      Unavailable
                                    </button>
                                  </div>
                                  {selectedAvailability === 'Available' ? (
                                    <div className='flex items-center'>
                                      <div>
                                        <span className='mx-4 text-gray-500 text-base'>
                                          Search date:
                                        </span>
                                        <Space direction='vertical' size={12}>
                                          <RangePicker
                                            size='small'
                                            defaultValue={[
                                              dayjs().subtract(1, 'day'),
                                              dayjs(),
                                            ]}
                                            disabled={[false, false]}
                                            format={dateFormat}
                                            onChange={handleDateRangeChange}
                                          />
                                        </Space>
                                      </div>
                                      <div className='ml-2'>
                                        <>
                                          <label
                                            htmlFor='underline_select'
                                            className='sr-only'
                                          >
                                            Underline select
                                          </label>
                                          <Select
                                            defaultValue=''
                                            value={sortingOption}
                                            style={{
                                              width: '140px',
                                              padding: '5px 0px 2px 0px',
                                            }}
                                            onChange={handleSortingChange}
                                            options={[
                                              {
                                                value: '',
                                                label: 'Sort by date',
                                              },
                                              {
                                                value: 'ASC',
                                                label: 'Ascending',
                                              },
                                              {
                                                value: 'DES',
                                                label: 'Descending',
                                              },
                                            ]}
                                          />
                                        </>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              ) : (
                                ''
                              )}
                              <div className='grid gap-4 xl:grid-cols-2 lg:grid-cols-2'>
                                <div className='col-span-1 w-full'>
                                  <div className='p-4 max-h-[420px] justify-between sm:p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 overflow-auto'>
                                    <div className='mb-2'>
                                      <h2 className='font-bold text-md text-center'>
                                        Menu Status
                                      </h2>
                                    </div>

                                    {selectedAvailability === 'Available' &&
                                      filteredAvailableMenus &&
                                      filteredAvailableMenus.map((item, i) => (
                                        <ul
                                          key={i}
                                          className={`flex bg-gray-100 flex-col gap-2 w-full rounded-lg mb-2  ${
                                            !hiddenUlIndices.includes(i) &&
                                            !hiddenStatusMenus.includes(item)
                                              ? ''
                                              : 'hidden'
                                          }`}
                                        >
                                          <li>
                                            <details className='group'>
                                              <summary className='flex items-center xl:w-[570px] lg:w-[420px] justify-between gap-10 p-2 font-medium marker:content-none hover:cursor-pointer'>
                                                <span className='flex gap-2'>
                                                  <span>
                                                    {item.menuName} -{' '}
                                                    {item.startDate}
                                                  </span>
                                                </span>
                                                <button
                                                  onClick={() =>
                                                    handleStatusMenuClick(item)
                                                  }
                                                >
                                                  <svg
                                                    width='25px'
                                                    height='25px'
                                                    viewBox='0 0 32 32'
                                                    version='1.1'
                                                    fill='#000000'
                                                  >
                                                    <g
                                                      id='SVGRepo_bgCarrier'
                                                      strokeWidth={0}
                                                    />
                                                    <g
                                                      id='SVGRepo_tracerCarrier'
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                    />
                                                    <g id='SVGRepo_iconCarrier'>
                                                      {' '}
                                                      <title>
                                                        arrow-right-circle
                                                      </title>{' '}
                                                      <desc>
                                                        Created with Sketch
                                                        Beta.
                                                      </desc>{' '}
                                                      <defs> </defs>{' '}
                                                      <g
                                                        id='Page-1'
                                                        stroke='none'
                                                        strokeWidth={1}
                                                        fill='none'
                                                        fillRule='evenodd'
                                                      >
                                                        {' '}
                                                        <g
                                                          id='Icon-Set'
                                                          transform='translate(-308.000000, -1087.000000)'
                                                          fill='#3276c3'
                                                        >
                                                          {' '}
                                                          <path
                                                            d='M324,1117 C316.268,1117 310,1110.73 310,1103 C310,1095.27 316.268,1089 324,1089 C331.732,1089 338,1095.27 338,1103 C338,1110.73 331.732,1117 324,1117 L324,1117 Z M324,1087 C315.163,1087 308,1094.16 308,1103 C308,1111.84 315.163,1119 324,1119 C332.837,1119 340,1111.84 340,1103 C340,1094.16 332.837,1087 324,1087 L324,1087 Z M330.535,1102.12 L324.879,1096.46 C324.488,1096.07 323.855,1096.07 323.465,1096.46 C323.074,1096.86 323.074,1097.49 323.465,1097.88 L327.586,1102 L317,1102 C316.447,1102 316,1102.45 316,1103 C316,1103.55 316.447,1104 317,1104 L327.586,1104 L323.465,1108.12 C323.074,1108.51 323.074,1109.15 323.465,1109.54 C323.855,1109.93 324.488,1109.93 324.879,1109.54 L330.535,1103.88 C330.775,1103.64 330.85,1103.31 330.795,1103 C330.85,1102.69 330.775,1102.36 330.535,1102.12 L330.535,1102.12 Z'
                                                            id='arrow-right-circle'
                                                          >
                                                            {' '}
                                                          </path>{' '}
                                                        </g>{' '}
                                                      </g>{' '}
                                                    </g>
                                                  </svg>
                                                </button>
                                              </summary>
                                              <article className='px-2 pb-4 h-full overflow-y-auto'>
                                                <div className='relative overflow-x-auto'>
                                                  <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-x-auto'>
                                                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                                      <tr>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          <span className='sr-only'></span>
                                                        </th>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          Meal name
                                                        </th>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          <div className='flex items-center'>
                                                            Price
                                                          </div>
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {item.listMeals.map(
                                                        (meals, i) => (
                                                          <tr
                                                            key={i}
                                                            className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                                                          >
                                                            <td className='w-32 p-6'>
                                                              <img
                                                                className='w-20 ml-4'
                                                                src={
                                                                  meals.image
                                                                }
                                                                alt={
                                                                  meals.mealName
                                                                }
                                                              ></img>
                                                            </td>
                                                            <th
                                                              scope='row'
                                                              className='px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white'
                                                            >
                                                              {meals.mealName}
                                                            </th>
                                                            <td className='px-6 py-4 text-black'>
                                                              {meals.mealPrice.toLocaleString(
                                                                'vi-VN',
                                                                {
                                                                  style:
                                                                    'currency',
                                                                  currency:
                                                                    'VND',
                                                                }
                                                              )}
                                                            </td>
                                                          </tr>
                                                        )
                                                      )}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </article>
                                            </details>
                                          </li>
                                        </ul>
                                      ))}
                                    {selectedAvailability === 'Unavailable' &&
                                      unavailableMenuList.menuCategoryName !==
                                        null &&
                                      unavailableMenuList.viewMenus &&
                                      unavailableMenuList.viewMenus.map(
                                        (item, i) => (
                                          <ul
                                            key={i}
                                            className={`flex bg-gray-100 flex-col gap-2 w-fit rounded-lg mb-2 ${
                                              !hiddenUlIndices.includes(i) &&
                                              !hiddenStatusMenus.includes(item)
                                                ? ''
                                                : 'hidden'
                                            }`}
                                          >
                                            <li>
                                              <details className='group'>
                                                <summary className='flex items-center xl:w-[570px] lg:w-[420px] justify-between gap-10 p-2 font-medium marker:content-none hover:cursor-pointer'>
                                                  <span className='flex gap-2'>
                                                    <span>{item.menuName}</span>
                                                  </span>
                                                  <button
                                                    onClick={() =>
                                                      handleStatusMenuClick(
                                                        item
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      width='25px'
                                                      height='25px'
                                                      viewBox='0 0 32 32'
                                                      version='1.1'
                                                      fill='#000000'
                                                    >
                                                      <g
                                                        id='SVGRepo_bgCarrier'
                                                        strokeWidth={0}
                                                      />
                                                      <g
                                                        id='SVGRepo_tracerCarrier'
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                      />
                                                      <g id='SVGRepo_iconCarrier'>
                                                        {' '}
                                                        <title>
                                                          arrow-right-circle
                                                        </title>{' '}
                                                        <desc>
                                                          Created with Sketch
                                                          Beta.
                                                        </desc>{' '}
                                                        <defs> </defs>{' '}
                                                        <g
                                                          id='Page-1'
                                                          stroke='none'
                                                          strokeWidth={1}
                                                          fill='none'
                                                          fillRule='evenodd'
                                                        >
                                                          {' '}
                                                          <g
                                                            id='Icon-Set'
                                                            transform='translate(-308.000000, -1087.000000)'
                                                            fill='#3276c3'
                                                          >
                                                            {' '}
                                                            <path
                                                              d='M324,1117 C316.268,1117 310,1110.73 310,1103 C310,1095.27 316.268,1089 324,1089 C331.732,1089 338,1095.27 338,1103 C338,1110.73 331.732,1117 324,1117 L324,1117 Z M324,1087 C315.163,1087 308,1094.16 308,1103 C308,1111.84 315.163,1119 324,1119 C332.837,1119 340,1111.84 340,1103 C340,1094.16 332.837,1087 324,1087 L324,1087 Z M330.535,1102.12 L324.879,1096.46 C324.488,1096.07 323.855,1096.07 323.465,1096.46 C323.074,1096.86 323.074,1097.49 323.465,1097.88 L327.586,1102 L317,1102 C316.447,1102 316,1102.45 316,1103 C316,1103.55 316.447,1104 317,1104 L327.586,1104 L323.465,1108.12 C323.074,1108.51 323.074,1109.15 323.465,1109.54 C323.855,1109.93 324.488,1109.93 324.879,1109.54 L330.535,1103.88 C330.775,1103.64 330.85,1103.31 330.795,1103 C330.85,1102.69 330.775,1102.36 330.535,1102.12 L330.535,1102.12 Z'
                                                              id='arrow-right-circle'
                                                            >
                                                              {' '}
                                                            </path>{' '}
                                                          </g>{' '}
                                                        </g>{' '}
                                                      </g>
                                                    </svg>
                                                  </button>
                                                </summary>
                                                <article className='px-2 pb-4 h-full overflow-y-auto'>
                                                  <div className='relative overflow-x-auto'>
                                                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-x-auto'>
                                                      <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                                        <tr>
                                                          <th
                                                            scope='col'
                                                            className='px-6 py-3'
                                                          >
                                                            <span className='sr-only'></span>
                                                          </th>
                                                          <th
                                                            scope='col'
                                                            className='px-6 py-3'
                                                          >
                                                            Meal name
                                                          </th>
                                                          <th
                                                            scope='col'
                                                            className='px-6 py-3'
                                                          >
                                                            <div className='flex items-center'>
                                                              Price
                                                            </div>
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {item.listMeals.map(
                                                          (meals, i) => (
                                                            <tr
                                                              key={i}
                                                              className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                                                            >
                                                              <td className='w-32 p-6'>
                                                                <img
                                                                  className='w-20 ml-4'
                                                                  src={
                                                                    meals.image
                                                                  }
                                                                  alt={
                                                                    meals.mealName
                                                                  }
                                                                ></img>
                                                              </td>
                                                              <th
                                                                scope='row'
                                                                className='px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white'
                                                              >
                                                                {meals.mealName}
                                                              </th>
                                                              <td className='px-6 py-4 text-black'>
                                                                {meals.mealPrice.toLocaleString(
                                                                  'vi-VN',
                                                                  {
                                                                    style:
                                                                      'currency',
                                                                    currency:
                                                                      'VND',
                                                                  }
                                                                )}
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </article>
                                              </details>
                                            </li>
                                          </ul>
                                        )
                                      )}
                                  </div>
                                </div>
                                <div className='col-span-1'>
                                  <div className='p-4 max-h-[420px] justify-between sm:p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 overflow-auto'>
                                    <div>
                                      <h2 className='font-bold text-md mb-2 text-center'>
                                        Menu Selected
                                      </h2>
                                    </div>
                                    {selectedMenus &&
                                      selectedMenus.length > 0 &&
                                      selectedMenus.map((item, i) => (
                                        <ul
                                          key={i}
                                          className={`flex bg-gray-100 flex-col gap-2 w-fit rounded-lg mb-2 ${
                                            !hiddenUlIndices.includes(i)
                                              ? ''
                                              : 'hidden'
                                          }`}
                                        >
                                          <li>
                                            <details className='group justify-center'>
                                              <summary className='flex items-center xl:w-[570px] lg:w-[420px] justify-between gap-10 p-2 font-medium marker:content-none hover:cursor-pointer'>
                                                <span className='flex gap-2'>
                                                  <span>{item.menuName}</span>
                                                </span>
                                                <button
                                                  onClick={() =>
                                                    handleSelectedMenuClick(
                                                      item
                                                    )
                                                  }
                                                >
                                                  <svg
                                                    width='25px'
                                                    height='25px'
                                                    viewBox='0 0 24 24'
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                  >
                                                    <g
                                                      id='SVGRepo_bgCarrier'
                                                      strokeWidth={0}
                                                    />
                                                    <g
                                                      id='SVGRepo_tracerCarrier'
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                    />
                                                    <g id='SVGRepo_iconCarrier'>
                                                      {' '}
                                                      <circle
                                                        cx={12}
                                                        cy={12}
                                                        r={10}
                                                        stroke='#ff0000'
                                                        strokeWidth='1.5'
                                                      />{' '}
                                                      <path
                                                        d='M15 12H9'
                                                        stroke='#ff0000'
                                                        strokeWidth='1.5'
                                                        strokeLinecap='round'
                                                      />{' '}
                                                    </g>
                                                  </svg>
                                                </button>
                                              </summary>
                                              <article className='px-2 pb-4 h-full overflow-y-auto'>
                                                <div className='relative overflow-x-auto'>
                                                  <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-x-auto'>
                                                    <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                                                      <tr>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          <span className='sr-only'></span>
                                                        </th>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          Meal name
                                                        </th>
                                                        <th
                                                          scope='col'
                                                          className='px-6 py-3'
                                                        >
                                                          <div className='flex items-center'>
                                                            Price
                                                          </div>
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {item.listMeals.map(
                                                        (meals, i) => (
                                                          <tr
                                                            key={i}
                                                            className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                                                          >
                                                            <td className='w-32 p-6'>
                                                              <img
                                                                className='w-20 ml-4'
                                                                src={
                                                                  meals.image
                                                                }
                                                                alt={
                                                                  meals.mealName
                                                                }
                                                              ></img>
                                                            </td>
                                                            <th
                                                              scope='row'
                                                              className='px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white'
                                                            >
                                                              {meals.mealName}
                                                            </th>
                                                            <td className='px-6 py-4 text-black'>
                                                              {meals.mealPrice.toLocaleString(
                                                                'vi-VN',
                                                                {
                                                                  style:
                                                                    'currency',
                                                                  currency:
                                                                    'VND',
                                                                }
                                                              )}
                                                            </td>
                                                          </tr>
                                                        )
                                                      )}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </article>
                                            </details>
                                          </li>
                                        </ul>
                                      ))}
                                  </div>
                                </div>
                              </div>
                              <div className='py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
                                <div className='text-center mt-3'>
                                  <BtnCreate
                                    linkName='Import'
                                    onSubmit={createCombine}
                                  ></BtnCreate>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>,
                        document.body
                      )
                    : null}
                </div>
              </div>
              {mealAll.length > 0 ? (
                <div ref={ref3} className='flex mt-2 mb-3'>
                  <div className='relative'>
                    <label htmlFor='underline_select' className='sr-only'>
                      Underline select
                    </label>
                    <select
                      id='underline_select'
                      className='py-2.5 px-2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                      value={selectMealCate}
                      onChange={handleSelectMealChange}
                    >
                      <option hidden defaultValue=''>
                        ---Choose a meal category---
                      </option>
                      <option value=''>---Choose a meal category---</option>
                      {mealCate.map((item, i) => (
                        <option key={i} value={item.mealCategoryId}>
                          {item.mealCategoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex-grow text-center mt-2.5'>
                    <span className='font-bold text-md'>Meal List</span>
                  </div>
                  <div className='ml-auto'>
                    <SearchFieldComponent onSearch={handleSearch} />
                  </div>
                </div>
              ) : (
                ''
              )}

              <div ref={ref4} className='grid grid-cols-3 max-h-[31rem] overflow-y-auto'>
                {selectMealCate === ''
                  ? filterMealAll.map((item, i) => (
                      <div
                        key={i}
                        className={`${
                          borderSelected.includes(item.mealId)
                            ? 'border-2 border-red-600 hidden'
                            : ''
                        } mb-4 popup-w-64 w-56 relative mt-3 shadow-md rounded-xl duration-500 hover:shadow-xl`}
                      >
                        <div className='card-content'>
                          <img
                            src={item.image}
                            alt='Product'
                            className='h-44 popup-w-64 w-64 rounded-t-xl bg-gray-300 object-cover'
                          />
                          <div className='px-4 py-3 popup-w-64 w-64'>
                            <span className='text-gray-400 mr-3 uppercase text-xs'>
                              MealCategory
                            </span>
                            <p className='text-lg font-bold text-black truncate block capitalize'>
                              {item.mealName}
                            </p>
                            <div className='flex items-center'>
                              <p className='text-lg font-semibold text-black cursor-auto my-3'>
                                {item.mealPrice.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='card-popup'>
                          <button
                            type='button'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                            onClick={() => handleDivClick(item.mealId)}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))
                  : filterMealList.map((item, i) => (
                      <div
                        key={i}
                        className={`${
                          borderSelected.includes(item.mealId)
                            ? 'border-2 border-red-600 hidden'
                            : ''
                        } mb-4 popup-w-64 w-56 relative mt-3 shadow-md rounded-xl duration-500 hover:shadow-xl`}
                      >
                        <div className='card-content'>
                          <img
                            src={item.image}
                            alt='Product'
                            className='h-44 popup-w-64 w-64 rounded-t-xl bg-gray-300 object-cover'
                          />
                          <div className='px-4 py-3 popup-w-64 w-64'>
                            <span className='text-gray-400 mr-3 uppercase text-xs'>
                              MealCategory
                            </span>
                            <p className='text-lg font-bold text-black truncate block capitalize'>
                              {item.mealName}
                            </p>
                            <div className='flex items-center'>
                              <p className='text-lg font-semibold text-black cursor-auto my-3'>
                                {item.mealPrice.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='card-popup'>
                          <button
                            type='button'
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                            onClick={() => handleDivClick(item.mealId)}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className='col-span-1'>
            <div className='shadow-sm sm:p-4 max-h-full p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
              <div className='flex justify-center items-center mb-6'>
                <div className='font-bold text-md'>Meal selected</div>
              </div>
              {mealSelected.length > 0 ? (
                <p className='hidden'></p>
              ) : (
                <Empty
                  className='py-[211px]'
                  description='Empty meal selected , add more!'
                />
              )}

              {mealSelected && mealSelected.some((item) => item !== null) && (
                <div className='justify-start'>
                  <button
                    onClick={handleClearAllMeal}
                    type='button'
                    className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                  >
                    Clear all
                  </button>
                </div>
              )}

              <div className='grid grid-cols-3 max-h-[505px] overflow-y-auto'>
                {mealSelected &&
                  mealSelected.map((mealDetail, i) => (
                    <div
                      key={i}
                      className='mb-4 popup-w-64 w-56 relative mt-3 shadow-md rounded-xl duration-500 hover:shadow-xl'
                    >
                      {mealDetail && (
                        <div className='card-content'>
                          <img
                            src={mealDetail.image || 'fallback_image_url'}
                            alt='Product'
                            className='h-44 popup-w-64 w-64 rounded-t-xl bg-gray-300 object-cover'
                          />
                          <div className='px-4 py-3 popup-w-64 w-64'>
                            <span className='text-gray-400 mr-3 uppercase text-xs'>
                              MealCategory
                            </span>
                            <p className='text-lg font-bold text-black truncate block capitalize'>
                              {mealDetail.mealName}
                            </p>
                            <div className='flex items-center'>
                              <p className='text-lg font-semibold text-black cursor-auto my-3'>
                                {mealDetail.mealPrice?.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className='card-popup'>
                        <button
                          type='button'
                          className='text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800'
                          onClick={() =>
                            handleRemoveFromSelected(mealDetail.mealId)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            {mealSelected.length > 0 && (
              <div className='items-end mt-2 justify-end text-end'>
                <button
                  ref={ref5}
                  onClick={handleClick}
                  type='button'
                  className='text-sm px-10 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg'
                >
                  <div className='lg:flex md:flex sm:flex justify-center text-sm'>
                    <p className='max-sm:hidden md:w-max sm:w-max align-middle mt-0.5'>
                      Next Step
                    </p>
                    <div>
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
                            d='M5 12H19M19 12L13 6M19 12L13 18'
                            stroke='#ffffff'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />{' '}
                        </g>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
          <div className='flex'>
            <BackMenuComponent linkUrl='/admin/menu_management'></BackMenuComponent>
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default CreateMenuContent;
