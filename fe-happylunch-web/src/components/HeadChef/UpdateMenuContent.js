import React, { useEffect, useState } from 'react';
import BackMenuComponent from '../Commons/BackMenu';
import UpdateButtonComponent from '../Commons/UpdateButton';
import SearchFieldComponent from '../Commons/SearchField';
import DatePickerComponent from '../Commons/DatePicker';
import DateEndPicker from '../Commons/DateEndPicker';
import { useLocation } from 'react-router-dom';
import MenuService from '../../services/MenuService';
import MealService from '../../services/MealService';
import { toast, ToastContainer } from 'react-toastify';

function UpdateMenu() {
  document.title = 'Update Menu'
  const [listMenuById, setListMealById] = useState([]);
  const [menuCate, setMenuCate] = useState([]);
  const [menuName, setMenuName] = useState('');
  const [selectMenuCate, setSelectMenuCate] = useState('');
  const [mealList, setMealList] = useState([]);
  const [selectMenuName, setSelectMenuName] = useState([]);
  const [selectedMenuCategoryName, setSelectedMenuCategoryName] = useState('');
  const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState('');
  const [selectedMenuCateToMealList, setSelectedMenuCateToMealList] =
    useState('');
  const [selectTab, setSelectTab] = useState(null);
  const [mealAll, setMealAll] = useState([]);
  const [mealCate, setMealCate] = useState([]);
  const [selectMealCate, setSelectMealCate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMealAll, setFilterMealAll] = useState(mealAll);
  const [filterMealList, setFilterMealList] = useState(mealList);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectMenu, setSelectMenu] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [describe, setDescribe] = useState('');
  const [errorDate, setErrorDate] = useState(0);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const menu_id = queryParams.get('menu_id');

  const handleStartDatePicker = (selectedStartDate) => {
    if (selectedStartDate != '') {
      setStartDate(removeComma(formatDateString(selectedStartDate)));
    } else if (listMenuById) {
      setStartDate(listMenuById.startDate);
    }
    // setStartDate(selectedStartDate);
  };

  const handleEndDatePicker = (selectedEndDate) => {
    if (selectedEndDate !== '') {
      setEndDate(removeComma(formatDateString(selectedEndDate)));
    } else if (listMenuById) {
      setEndDate(listMenuById.endDate);
    } else {
      setEndDate(null); // Đặt giá trị null khi selectedEndDate là chuỗi rỗng
    }
  };

  const handleSelectMealChange = (event) => {
    const selectedMealCate = event.target.value;
    setSelectMealCate(selectedMealCate);
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
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectedMealAll = (selectedMeal) => {
    // Check if the selected meal is not already in the list
    if (!selectedMeals.some((meal) => meal.mealId === selectedMeal.mealId)) {
      // Check if the selected meal is in mealAll
      const indexInMealAll = filterMealAll.findIndex(
        (meal) => meal.mealId === selectedMeal.mealId
      );

      if (indexInMealAll !== -1) {
        // Remove the selected meal from mealAll
        const updatedMealAll = [...filterMealAll];
        updatedMealAll.splice(indexInMealAll, 1);
        setFilterMealAll(updatedMealAll);
      }
      // Add the selected meal to selectedMeals
      setSelectedMeals((prevSelectedMeals) => [
        ...prevSelectedMeals,
        selectedMeal,
      ]);
    }
  };

  const handleSelectedMealList = (selectedMeal) => {
    // Check if the selected meal is not already in the list
    if (!selectedMeals.some((meal) => meal.mealId === selectedMeal.mealId)) {
      // Check if the selected meal is in mealAll
      const indexInMealList = filterMealList.findIndex(
        (meal) => meal.mealId === selectedMeal.mealId
      );

      if (indexInMealList !== -1) {
        // Remove the selected meal from mealAll
        const updatedMealAll = [...filterMealList];
        updatedMealAll.splice(indexInMealList, 1);
        setFilterMealList(updatedMealAll);
      }
      // Add the selected meal to selectedMeals
      setSelectedMeals((prevSelectedMeals) => [
        ...prevSelectedMeals,
        selectedMeal,
      ]);
    }
  };
  const handleDeletedSelectedMeal = (mealToDelete) => {
    // Remove the deleted meal from the selectedMeals array
    const updatedSelectedMeals = selectedMeals.filter((meal) => {
      return meal.mealId !== mealToDelete.mealId;
    });
    setSelectedMeals(updatedSelectedMeals);

    // Add the deleted meal back to mealAll
    setFilterMealAll((prevMealAll) => [...prevMealAll, mealToDelete]);
    setFilterMealList((prevMealAll) => [...prevMealAll, mealToDelete]);
  };

  const handleClearAllMeal = () => {
    // Lưu trữ các ID của món đã được xóa để thêm lại vào mealAll
    const deletedMealIds = [...selectedMeals.map((meal) => meal.mealId)];

    // Thêm lại các món đã xóa vào mealAll
    if (selectMealCate !== '') {
      const updatedMealList = [
        ...mealList,
        ...selectedMeals.filter(
          (meal) => !deletedMealIds.includes(meal.mealId)
        ),
      ];
      console.log('updatedMealList: ', updatedMealList);
      setFilterMealList(updatedMealList);
      setSelectedMeals([]);
    } else {
      const updatedMealAll = [
        ...mealAll,
        ...selectedMeals.filter(
          (meal) => !deletedMealIds.includes(meal.mealId)
        ),
      ];
      setFilterMealAll(updatedMealAll);
      setSelectedMeals([]);
      console.log('updatedMealAll: ', updatedMealAll);
    }
  };

  const getListMenuCate = async () => {
    try {
      const menuService = new MenuService();
      const response = await menuService.viewListCateMenu();
      if (response.code === 200) {
        setMenuCate(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListMealCate = async () => {
    try {
      const mealService = new MealService();
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
      const mealService = new MealService();
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
        const mealService = new MealService();
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

  const getMenuCategory = async () => {
    try {
      const menuService = new MenuService();
      const response = await menuService.viewListCateMenu();
      if (response.code === 200) {
        setSelectMenu(response.response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const searchData = () => {
      if (selectMealCate === '') {
        removeDuplicatesMealAll();
      } else {
        removeDuplicatesMealList();
      }
    };

    searchData();
  }, [mealAll, mealList, selectMealCate]);

  const updateMenu = () => {
    const currentDate = new Date();
    const selectedMealId = selectedMeals.map((item) => {
      return item.mealId;
    });
    if (
      (selectMenuCate === '' && menuName === '') ||
      (selectMenuCate && menuName === '')
    ) {
      return setErrorDate(-1);
    } else if (
      (selectMenuCate &&
        menuName &&
        (startDate === '' || startDate === null)) ||
      (selectMenuCate &&
        menuName &&
        endDate &&
        (startDate === '' || startDate === null))
    ) {
      return setErrorDate(1);
    } else if (
      selectMenuCate &&
      menuName &&
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      return setErrorDate(2);
      // console.log('test')
    } else if (
      selectMenuCate &&
      menuName &&
      startDate &&
      (endDate !== null || endDate === null) &&
      new Date(startDate) < currentDate
    ) {
      return setErrorDate(3);
    } else if (describe === null || describe !== null) {
      setErrorDate(0);
      const updateData = {
        menuId: menu_id,
        menuName: menuName,
        describe: describe,
        menuCategoryId: selectMenuName,
        startDate: convertToISO8601(startDate),
        endDate:
          convertToISO8601(endDate) === '' ? null : convertToISO8601(endDate),
        mealIds: selectedMealId,
      };
      // Log the previewData for debugging
      apiUpdateMenu(updateData);
    }
  };

  const apiUpdateMenu = async (menuDataUpdate) => {
    try {
      const menuService = new MenuService();
      const res = await menuService.updateMenu(menuDataUpdate);
      if (res.code === 200) {
        toast.success(`Menu name: ${menuName} has been updated!`);
      }
    } catch (error) {
      toast.error(
        `Menu name: ${menuName} was not updated! Please check again!`
      );
    }
  };

  const convertToISO8601 = (dateTimeString) => {
    // Kiểm tra xem biến có giá trị undefined hoặc null không
    if (dateTimeString == null || dateTimeString === '') {
      console.error('dateTimeString is undefined or null.');
      return null; // Hoặc giá trị khác tùy thuộc vào yêu cầu của bạn
    }

    const parts = dateTimeString.split(' ');

    if (parts.length !== 3) {
      return null;
    }

    const [datePart, timePart, ampm] = parts;

    const [month, day, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    const ampmHours =
      ampm === 'AM' ? parseInt(hours, 10) : parseInt(hours, 10) + 12;

    const formattedDate = new Date(
      Date.UTC(year, month - 1, day, ampmHours, minutes, seconds)
    );

    return formattedDate.toISOString(); // Trả về giá trị ngày tháng định dạng
  };

  function formatDateString(inputDateString) {
    if (inputDateString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };

      const formattedDateString = new Date(inputDateString).toLocaleString(
        'en-US',
        options
      );

      return formattedDateString;
    } else {
      // Trả về giá trị mặc định hoặc thực hiện hành động phù hợp
      return null; // Hoặc một giá trị mặc định khác
    }
  }

  function removeComma(inputDateString) {
    if (inputDateString != null) {
      return inputDateString.replace(/,/g, '');
    } else {
      return null; // Hoặc một giá trị mặc định khác
    }
  }

  useEffect(() => {
    const getListMenuDetailById = async () => {
      try {
        const menuService = new MenuService();
        const res = await menuService.viewMenusDoingDetailById(menu_id);
        if (res.code === 200) {
          setListMealById(res.response.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getListMenuDetailById();
  }, [menu_id]);

  useEffect(() => {
    getListMenuCate();
    getListMealCate();
    getMenuCategory();
  }, []);

  useEffect(() => {
    if (selectMealCate.length > 0 || selectedMenuCateToMealList !== '') {
      getListAllMealByMenuCate();
      getListMealsFromMenuCateByMealCate();
    }
  }, [selectMealCate, selectedMenuCateToMealList]);

  useEffect(() => {
    // Check if listMeals is not empty before updating selectedMeals
    if (
      listMenuById.menuName &&
      listMenuById.listMeals &&
      listMenuById.listMeals.length > 0
    ) {
      setSelectedMeals(listMenuById.listMeals);
      setMenuName(listMenuById.menuName);
      setDescribe(listMenuById.menuDescribe);
    }

    if (listMenuById.endDate !== null && listMenuById.startDate !== null) {
      setStartDate(listMenuById.startDate);
      setEndDate(listMenuById.endDate);
    }
  }, [
    listMenuById.listMeals,
    listMenuById.menuName,
    listMenuById.startDate,
    listMenuById.endDate,
    listMenuById.menuDescribe,
  ]);

  useEffect(() => {
    if (selectMenu.length > 0) {
      // Find the index of the item with menuCategoryName equal to listMenuById.menuCategoryName
      const selectedIndex = selectMenu.findIndex(
        (item) => item.menuCategoryName === listMenuById.menuCategoryName
      );

      // If a matching item is found, set the corresponding value for selectMenuCate
      if (selectedIndex !== -1) {
        const selectedValue = selectMenu[selectedIndex].menuCategoryId;
        setSelectMenuCate(selectedValue);
        setSelectMenuName(selectedValue); // Set selectMenuName if needed
      }
    }
  }, [selectMenu, listMenuById.menuCategoryName]);

  const removeDuplicatesMealAll = () => {
    const query = removeAccents(searchQuery.toLowerCase().trim());
    const updatedMealAll = mealAll.filter(
      (meal) =>
        !selectedMeals.some(
          (selectedMeal) => selectedMeal.mealId === meal.mealId
        )
    );
    /* setFilterMealAll(updatedMealAll); */
    const filtered = updatedMealAll.filter((item) =>
      removeAccents(item.mealName.toLowerCase()).includes(query)
    );
    setFilterMealAll(filtered);
  };
  const removeDuplicatesMealList = () => {
    const query = removeAccents(searchQuery.toLowerCase().trim());
    const updatedMealList = mealList.filter(
      (meal) =>
        !selectedMeals.some(
          (selectedMeal) => selectedMeal.mealId === meal.mealId
        )
    );
    /* setFilterMealList(updatedMealAll); */
    const filtered = updatedMealList.filter((item) =>
      removeAccents(item.mealName.toLowerCase()).includes(query)
    );
    setFilterMealList(filtered);
  };
  useEffect(() => {
    // Check for duplicates only when mealAll or selectedMeals change
    if (mealAll.length > 0 && selectedMeals.length > 0) {
      removeDuplicatesMealAll();
    }
  }, [mealAll.length, selectedMeals.length, searchQuery]);

  useEffect(() => {
    // Check for duplicates only when mealAll or selectedMeals change
    if (mealList.length > 0 && selectedMeals.length > 0) {
      removeDuplicatesMealList();
    }
  }, [mealList.length, selectedMeals.length, searchQuery]);
  useEffect(() => {
    setSelectTab(menuCate[0]?.menuCategoryId);
    setSelectedMenuCateToMealList(menuCate[0]?.menuCategoryId)
  }, [menuCate[0]?.menuCategoryId]);
  console.log('selectedMenuCateToMealList: ', selectedMenuCateToMealList);
  console.log('menuCate: ', menuCate);
  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-2xl mb-2">Update Menu To Do</h2>
        <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-2">
          <div className="h-[800px] shadow-sm p-4  border-2 border-gray-500 border-dashed rounded-lg dark:border-gray-700 w-full">
            <div className="text-center text-base font-bold flex-grow">
              Meal list
            </div>
            <div className="text-sm w-fit font-medium text-center">
              <ul
                className="flex mb-0 list-none flex-wrap flex-row"
                role="tablist"
              >
                {menuCate.map((item, i) => (
                  <li
                    key={i}
                    className="-mb-px mr-2 last:mr-0 flex-auto text-center"
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
            <>
              <div className="flex mt-2 mb-3">
                <div className="relative">
                  <label htmlFor="underline_select" className="sr-only">
                    Underline select
                  </label>
                  <select
                    id="underline_select"
                    className="py-2.5 px-2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                    value={selectMealCate}
                    onChange={handleSelectMealChange}
                  >
                    <option hidden defaultValue="">
                      ---Choose a meal category---
                    </option>
                    <option value="">---Choose a meal category---</option>
                    {mealCate.map((item, i) => (
                      <option key={i} value={item.mealCategoryId}>
                        {item.mealCategoryName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-auto">
                  <SearchFieldComponent onSearch={handleSearch} />
                </div>
              </div>
              <div className="relative shadow-md sm:rounded-lg overflow-auto max-h-[635px]">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <tbody>
                    {selectMealCate === ''
                      ? filterMealAll.map((item, i) => (
                          <tr
                            key={i}
                            className={`${
                              selectedMeals.some(
                                (meal) => meal.mealId === item.mealId
                              )
                                ? 'border-2 border-red-500' // Apply red border for selected item
                                : 'bg-white border dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <td className="p-4">
                              <img
                                src={item.image}
                                className="w-16 md:w-32 max-w-full max-h-full"
                                alt={item.mealName}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.mealName}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.mealPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleSelectedMealAll(item)}
                                className="flex border text-blue-600  border-blue-600 rounded-md py-1 px-4 hover:bg-blue-700 hover:text-white"
                              >
                                <span className="mt-0.5 ">Select</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      : filterMealList.map((item, i) => (
                          <tr
                            key={i}
                            className={`${
                              selectedMeals.some(
                                (meal) => meal.mealId === item.mealId
                              )
                                ? 'border-2 border-red-500' // Apply red border for selected item
                                : 'bg-white border dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            <td className="p-4">
                              <img
                                src={item.image}
                                className="w-16 md:w-32 max-w-full max-h-full"
                                alt={item.mealName}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.mealName}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.mealPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleSelectedMealList(item)}
                                className="flex border text-blue-600  border-blue-600 rounded-md py-1 px-4 hover:bg-blue-700 hover:text-white"
                              >
                                <span className="mt-0.5 ">Select</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </>
          </div>
          <div className="h-[800px] shadow-sm p-4  border-2 border-gray-500 border-dashed rounded-lg dark:border-gray-700 w-full overflow-auto">
            <div className="text-center text-base font-bold flex-grow">
              Menu Information
            </div>
            <div>
              <label htmlFor="underline_select" className="sr-only">
                Underline select
              </label>
              <select
                id="underline_select"
                className="py-2.5 px-2 w-1/2 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                value={selectMenuName}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSelectMenuCate(selectedValue);

                  const selectedItem = selectMenu.find(
                    (item) => item.menuCategoryId === selectedValue
                  );

                  if (selectedItem) {
                    setSelectMenuName(selectedItem.menuCategoryId); // Ensure this is set correctly
                  }
                }}
              >
                <option value="">---Choose a menu category---</option>
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
            <div className="mt-2">
              <label
                htmlFor="base-input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Menu Name
              </label>
              <input
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                required
                type="text"
                id="base-input"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
            <div className=" mt-2 flex gap-20 items-center">
              <div>
                <label
                  htmlFor="base-input"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Start Date
                </label>
                <DatePickerComponent
                  onSelectedDatePicker={handleStartDatePicker}
                  getADate={startDate}
                ></DatePickerComponent>
              </div>
              <div>
                <label
                  htmlFor="base-input"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  End Date
                </label>
                <DateEndPicker
                  onSelectedEndDatePicker={handleEndDatePicker}
                  getAEndDate={endDate}
                ></DateEndPicker>
              </div>
            </div>
            <div className="text-red-700 text-sm  ">
              {errorDate === 1 ? 'StartDate must required!' : ''}
            </div>
            <div className="text-red-700 text-sm underline ">
              {errorDate === 2 ? 'EndDate not before StartDate!' : ''}
            </div>
            <div className="text-red-700 text-sm underline ">
              {errorDate === 3 ? 'StartDate must after current date!' : ''}
            </div>
            <div>
              <label
                htmlFor="message"
                className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                onChange={(e) => setDescribe(e.target.value)}
                value={describe}
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your thoughts here..."
                defaultValue={''}
              />
            </div>
            <div className="text-red-700 text-sm underline ">
              {errorDate === -1 ? 'Required enter field' : ''}
            </div>
            <div className="App">
              <button
                className="rounded-md last:text-sm px-14 py-2.5 max-sm:px-2 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium"
                onClick={updateMenu}
              >
                Update
              </button>
            </div>
            <div className="shadow-sm mt-2 mb-2 border border-gray-200 w-full"></div>
            <div className="text-center text-base font-bold flex-grow">
              Meals selected
            </div>
            <div className="justify-start">
              <button
                onClick={handleClearAllMeal}
                type="button"
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Clear all
              </button>
            </div>
            <div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    {/* <tr>
                      <th scope='col' className='px-16 py-3'>
                        <span className='sr-only'>Image</span>
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Product
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Qty
                      </th>
                      <th scope='col' className='px-6 py-3'>
                        Price
                      </th>
                    </tr> */}
                  </thead>
                  <tbody>
                    {selectedMeals &&
                      selectedMeals.map((item, i) => (
                        <tr
                          key={i}
                          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="p-4">
                            <img
                              src={item.image}
                              className="w-16 md:w-32 max-w-full max-h-full"
                              alt={item.mealName}
                            />
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {item.mealName}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                            {item.mealPrice.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeletedSelectedMeal(item)}
                              className="flex border text-red-600  border-red-600 rounded-md py-1 px-4 hover:bg-red-700 hover:text-white"
                            >
                              <span className="mt-0.5 ">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <BackMenuComponent linkUrl="/admin/menu_management/todo_menu"></BackMenuComponent>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default UpdateMenu;
