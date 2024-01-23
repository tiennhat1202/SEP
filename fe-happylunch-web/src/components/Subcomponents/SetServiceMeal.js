import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import MenuService from '../../services/MenuService';
import MealService from '../../services/MealService';
import { Table, Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';

function StatusServiceMeal() {
  document.title = 'Serving Meal';

  const [selectedItems, setSelectedItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuService = new MenuService();
  const mealService = new MealService();
  const [options, setOptions] = useState([]);
  const [menuMeal, setMenuMeal] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [menuLoaded, setMenuLoaded] = useState(false);
  const [mealId, setMealId] = useState('');

  useEffect(() => {
    getListCategoryMenu();
  }, []);

  const getListCategoryMenu = async () => {
    try {
      const res = await menuService.viewListCateMenu();
      if (res && res.code === 200) {
        setOptions(res.response.data);
        getListMeal(res.response.data[0].menuCategoryId);
        setSelectedItems(res.response.data[0].menuCategoryId);
        setMenuLoaded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (menuLoaded) {
      getListMeal(selectedItems);
    }
  }, [selectedItems]);

  const getListMeal = async (selectedItems) => {
    try {
      const res = await menuService.viewListMenusAvailableTodayByCategory(
        selectedItems
      );
      if (res && res.code === 200) {
        setMenuMeal(res.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setAllMeals(
      menuMeal.viewMenus
        ? menuMeal.viewMenus.reduce((meals, menu) => {
            if (menu.listMeals) {
              const mealsWithMenuName = menu.listMeals.map((meal) => ({
                ...meal,
                menuName: menu.menuName,
              }));
              return meals.concat(mealsWithMenuName);
            }
            return meals;
          }, [])
        : []
    );
  }, [menuMeal]);

  const stopServing = async (mealId) => {
    try {
      const res = await mealService.updateHeadchefStopServingMeal(mealId);
      if (res && res.code === 200) {
        toast.success('Stop serving meal successfully');
        getListMeal(selectedItems);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  const paginatedList = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allMeals.slice(startIndex, endIndex);
  };

  console.log('MealId', mealId);
  return (
    <div>
      <h2 className=" mb-2 font-bold text-2xl">Serving Meal</h2>
      <div className="pb-3 mt-3 flex justify-between">
        <Select
          mode="single"
          placeholder="Inserted are removed"
          value={selectedItems}
          onChange={setSelectedItems}
          style={{ width: '300px' }}
          options={options.map((item) => ({
            value: item.menuCategoryId,
            label: item.menuCategoryName,
          }))}
        />
        <input
          className="ps-3 pe-4 border-[1px] rounded-[8px] text-[13px] py-1 full focus:outline-1 focus:outline-offset-0 focus:outline-blue-500 "
          placeholder="Search Meal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 ps-8">
                Image
              </th>
              <th scope="col" className="px-6 py-3 flex item items-center">
                Meal Name
              </th>
              <th scope="col" className="px-6 py-3">
                Meal Price
              </th>
              <th scope="col" className="px-6 py-3">
                Menu Name
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList().map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img src={item.image} className="w-14 h-14 object-cover" />
                </th>
                <td className="px-6 py-4">{item.mealName}</td>
                <td className="px-6 py-4">
                  {item.mealPrice &&
                    item.mealPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                </td>
                <td className="px-6 py-4">{item.menuName}</td>
                <td className="px-6 py-4 text-center">
                  {item.mealIsDelete === 'True' ? (
                    <button
                      className="bg-green-500 px-3 py-1.5 rounded-2xl text-white font-semibold cursor-pointer hover:bg-green-600"
                      onClick={() => {
                        stopServing(item.mealId);
                      }}
                    >
                      Restart Serving
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 px-3 py-1.5 rounded-2xl text-white font-semibold cursor-pointer hover:bg-red-600"
                      onClick={() => {
                        setMealId(item.mealId);
                        setOpenModal(true);
                      }}
                    >
                      Stop Serving
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between pb-4 pt-5 ps-0 pe-0 rounded-xl shadow-xl"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto mx-6">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(itemsPerPage * (currentPage - 1) + 1, allMeals.length)}
            </span>{' '}
            -{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.min(itemsPerPage * currentPage, allMeals.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {allMeals.length}
            </span>
          </span>

          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 mx-5">
            <li>
              <a
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${
                  currentPage === 1 ? 'disabled' : ''
                }`}
              >
                Previous
              </a>
            </li>
            {Array.from(
              { length: Math.ceil(allMeals.length / itemsPerPage) },
              (_, index) => (
                <li key={index}>
                  <a
                    onClick={() => setCurrentPage(index + 1)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer ${
                      index + 1 === currentPage
                        ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </a>
                </li>
              )
            )}
            <li>
              <a
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(allMeals.length / itemsPerPage)
                    )
                  )
                }
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${
                  currentPage === Math.ceil(allMeals.length / itemsPerPage)
                    ? 'disabled'
                    : ''
                }`}
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to stop serving this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  stopServing(mealId);
                }}
              >
                Yes, Im sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default StatusServiceMeal;
