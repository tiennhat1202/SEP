import React, { useState, useEffect, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { ToastContainer, toast } from 'react-toastify';
import { decodeAccessToken } from '../../utils/jwtDecode';
import MealService from '../../services/MealService';
import MenuService from '../../services/MenuService';
import '../../assets/css/user_home.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UserNavbar from '../../components/User/Navbar';
import { UserContext } from '../../store/UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

function OrderListMeal() {
  const [loading, setLoading] = useState(true);
  const [menuCategoryList, setMenuCategoryList] = useState([]);
  const [menuCategoryId, setMenuCategoryId] = useState('');
  const [dataGetAPI, setDataGetAPI] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [arrayDataSearch, setArrayDataSearch] = useState([]);
  const [cartItems, setCartItems] = useState(false);
  const menuService = new MenuService();
  const mealService = new MealService();
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useContext(UserContext);
  const [cartLocalStorage, setCartLocalStorage] = useState([]);
  const navigate = useNavigate();

  const RL_Admin = 'RL_Admin';
  const RL_HeadChef = 'RL_HeadChef';
  const RL_Counter = 'RL_Counter';
  const RL_CanteenManager = 'RL_CanteenManager';

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getMeals = async (categoryId) => {
    try {
      const response = await mealService.getListMealToOrderCustomer(categoryId);
      if (response.code === 200) {
        setDataGetAPI(response.response.data.viewMenus);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Home';
    getListMenuCategory();

    const token = Cookies.get('accessToken');
    if (token) {
      const user = jwtDecode(token);
      if (user.RoleName === RL_Admin) {
        navigate('/admin/dashboard');
      } else if (user.RoleName === RL_HeadChef) {
        navigate('/admin/menu_management');
      } else if (user.RoleName === RL_CanteenManager) {
        navigate('/admin/menu_management_canteen_manager');
      } else if (user.RoleName === RL_Counter) {
        navigate('/counter_staff/orderlistmeal');
      }
    }

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/meal', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    //https://8raehgpmmh.execute-api.us-east-1.amazonaws.com/dev/meal
    hubConnection.start();

    hubConnection.on('StopServingMeal', async (mealId) => {
      await setDataGetAPI((prevData) => {
        const stoppedMealName = findMealName(prevData, mealId);
        toast.warning(`Stop Serving ${stoppedMealName}`);
        const updatedData = prevData.map((menu) => {
          if (menu.listMeals) {
            menu.listMeals = menu.listMeals.filter(
              (meal) => meal.mealId !== mealId
            );
          }
          return menu;
        });

        return updatedData;
      });
    });

    return () => {
      hubConnection.stop();
    };
  }, []);

  const findMealName = (data, targetMealId) => {
    for (const menu of data) {
      if (menu.listMeals) {
        const stoppedMeal = menu.listMeals.find(
          (meal) => meal.mealId === targetMealId
        );

        if (stoppedMeal) {
          return stoppedMeal.mealName;
        }
      }
    }
    return 'Unknown Meal';
  };

  const getListMenuCategory = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      if (response.code === 200) {
        setMenuCategoryList(response.response.data);
        if (response.response.data.length > 0) {
          const initialCategoryId = response.response.data[0].menuCategoryId;
          setMenuCategoryId(initialCategoryId);
          getMeals(initialCategoryId);
        }
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setMenuCategoryId(categoryId);
    getMeals(categoryId);
  };

  useEffect(() => {
    if (dataGetAPI && dataGetAPI.length > 0) {
      const mealNames = dataGetAPI.flatMap((menu) =>
        menu.listMeals.map((item) => item)
      );

      setArrayDataSearch(mealNames);
    }
  }, [dataGetAPI]);

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    setSearchInput(inputValue);

    const uniqueMeals = [
      ...new Map(arrayDataSearch.map((meal) => [meal.mealId, meal])).values(),
    ];

    const filtered = uniqueMeals.filter((meal) => {
      const mealName = meal.mealName.toLowerCase();
      const mealNameWithoutDiacritics = mealName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return (
        mealName.includes(inputValue) ||
        mealNameWithoutDiacritics.includes(inputValue)
      );
    });

    setFilteredMeals(filtered);
  };

  const handleAddToCart = async (meal) => {
    if (user.auth) {
      try {
        const decodedToken = decodeAccessToken();
        if (decodedToken && decodedToken.CustomerId) {
          const customerId = decodedToken ? decodedToken.CustomerId : null;
          const mealId = meal.mealId;
          await mealService.addToCartCustomer(mealId, customerId);
          toast.success(`Added ${meal.mealName} to cart!`);
          setCartItems(true);
        } else {
          toast.error('Invalid customer data in the token.');
        }
      } catch (error) {
        toast.error('Error adding item to the cart:', error);
      }
    } else {
      const updatedCart = { ...cartLocalStorage };

      if (updatedCart[meal.mealId]) {
        updatedCart[meal.mealId] = {
          ...updatedCart[meal.mealId],
          quantity: updatedCart[meal.mealId].quantity + 1,
        };
      } else {
        updatedCart[meal.mealId] = {
          item: meal,
          quantity: 1,
          unitPrice: meal.mealPrice,
        };
      }

      setCartLocalStorage(updatedCart);

      const dataCartLocalStorage = Object.values(updatedCart).map((item) => ({
        mealId: item.item.mealId,
        mealName: item.item.mealName,
        mealPrice: item.item.mealPrice,
        image: item.item.image,
        quantity: item.quantity,
      }));

      localStorage.setItem(
        'CartLocalStorage',
        JSON.stringify(dataCartLocalStorage)
      );
      setCartItems(true);
      toast.success(`Added ${meal.mealName} to cart!`);
    }
  };

  function formatDate(dateString) {
    if (!dateString) {
      return 'Unknown';
    }

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );

    return formattedDate;
  }

  const clearSearch = async () => {
    setSearchInput('');
  };

  return (
    <>
      <UserNavbar cartItems={cartItems} />
      <div className="bg-gray-100 min-h-[92vh]">
        <div>
          <div className="w-full">
            <p className="font-bold text-2xl text-center mb-4 pt-10">
              What do we have today?
            </p>
            <div className="mx-auto xl:px-11 sm:px-6 xl:max-w-screen-lg md:max-w-screen-sm sm:max-w-prose">
              <div className="flex justify-between items-center xl:max-w-screen-xl md:max-w-screen-sm sm:max-w-prose mx-auto bg-white py-1 px-1 rounded-3xl drop-shadow-xl">
                <div className="flex">
                  {menuCategoryList &&
                    menuCategoryList.map((item) => (
                      <div
                        key={item.menuCategoryId}
                        className={`mx-1 px-5 py-2 rounded-3xl font-semibold cursor-pointer ${
                          menuCategoryId === item.menuCategoryId
                            ? 'bg-orange-500 text-white'
                            : 'bg-red-100 text-black'
                        }`}
                        onClick={() => handleCategoryClick(item.menuCategoryId)}
                      >
                        {item.menuCategoryName}
                      </div>
                    ))}
                </div>

                <div
                  className={`flex me-1 items-center px-2 py-2 rounded-3xl shadow-[inset_1px_5px_6px_rgba(0,0,0,0.1)] cursor-pointer ${
                    isHovered ? 'hovered' : ''
                  }`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={() => {
                    if (searchInput === '') {
                      handleMouseLeave();
                    }
                  }}
                >
                  <input
                    className={`py-0 rounded-3xl border-none focus:outline-0 focus:ring-0 focus:ring-offset-0 hidden xl:w-52 sm:w-36 text-[14px] ${
                      isHovered ? 'input-animation' : ''
                    }`}
                    type="text"
                    placeholder="Search for meals..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    style={{
                      display:
                        isHovered || searchInput !== '' ? 'block' : 'none',
                    }}
                  />
                  {searchInput !== '' ? (
                    <CloseOutlined
                      className="text-black text-[15px]"
                      onClick={clearSearch}
                    />
                  ) : (
                    <SearchOutlined className="text-black text-[16px]" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <>
              <div className="max-w-screen-xl mx-auto px-10 mt-10 uppercase font-bold text-2xl underline text-center">
                <Skeleton width={200} height={25} />
              </div>
              <section
                key={-1}
                id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14 mt-10 pb-16"
              >
                {[1, 2, 3, 4].map((index) => (
                  <div key={index}>
                    <div className="w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                      <a href="#">
                        <div className="h-64 w-64 bg-gray-300 rounded-t-xl animate-pulse" />
                        <div className="px-4 py-3 w-64">
                          <Skeleton width={60} height={12} />
                          <Skeleton width={120} height={20} />
                          <div className="flex items-center">
                            <Skeleton width={100} height={20} />
                            <div className="ml-auto">
                              <Skeleton width={80} height={30} />
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </section>
            </>
          ) : searchInput && filteredMeals.length > 0 ? (
            <div>
              <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 mt-10 font-medium text-xl text-center">
                Search Results
              </div>
              <section
                id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14 mt-10 pb-16"
              >
                {filteredMeals.map((item, index) => (
                  <div
                    key={index}
                    className="w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                  >
                    <img
                      src={item.image}
                      alt="Product"
                      className="h-64 w-64 rounded-t-xl bg-gray-300 object-cover"
                    />
                    <div className="px-4 py-3 w-64">
                      <p className="text-lg font-bold text-black truncate block capitalize">
                        {item.mealName}
                      </p>
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-black cursor-auto my-3">
                          {item.mealPrice.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                        <div className="ml-auto">
                          <button
                            key={item.mealId}
                            type="button"
                            onClick={() => handleAddToCart(item)}
                            className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark-bg-gray-800 dark-text-gray-400 dark-border-gray-600 dark-hover-text-white dark-hover-bg-gray-700"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          ) : searchInput && filteredMeals.length == 0 ? (
            <div>
              <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 mt-10 font-medium text-xl text-red-600 text-center">
                The desired meal was not found
              </div>
            </div>
          ) : (
            dataGetAPI.map((data, index) => (
              <>
                <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 mt-10 font-bold text-2xl underline text-center">
                  {data.menuName}
                </div>
                <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 font-semi text-[14px] mt-1 text-center">
                  Start Date {formatDate(data.startDate)} - End Date{' '}
                  {data.endDate === null ? 'Unknown' : formatDate(data.endDate)}
                </div>

                <section
                  key={index}
                  id="Projects"
                  className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14 mt-10 pb-16"
                >
                  {data.listMeals.map((item) => (
                    <div
                      key={item.mealId}
                      className="w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                    >
                      <img
                        src={item.image}
                        alt="Product"
                        className="h-64 w-64 rounded-t-xl bg-gray-300 object-cover"
                      />
                      <div className="px-4 py-3 w-64">
                        <p className="text-lg font-bold text-black truncate block capitalize">
                          {item.mealName}
                        </p>
                        <div className="flex items-center">
                          <p className="text-lg font-semibold text-black cursor-auto my-3">
                            {item.mealPrice.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </p>
                          <div className="ml-auto">
                            <button
                              key={item.mealId}
                              type="button"
                              onClick={() => handleAddToCart(item)}
                              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark-bg-gray-800 dark-text-gray-400 dark-border-gray-600 dark-hover-text-white dark-hover-bg-gray-700"
                            >
                              Add To Cart
                              {/* <FaCartPlus className='w-5 h-5 mx-4'></FaCartPlus> */}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </>
            ))
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default OrderListMeal;
