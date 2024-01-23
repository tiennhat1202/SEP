import React, { useState, useEffect, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import MealService from '../../services/MealService';
import MenuService from '../../services/MenuService';
import OrderService from '../../services/OrderService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CouterNavbar from '../Counter/Navbar';
import ModalPayment from '../Counter/ModalPayment';
import { UserContext } from '../../store/UserContext';
import * as signalR from '@microsoft/signalr';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

function OrderListMeal() {
  const discount = 0;
  const { user } = useContext(UserContext);
  const mealService = new MealService();
  const menuService = new MenuService();
  const orderService = new OrderService();
  const [dataGetAPI, setDataGetAPI] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 798);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [menuCategoryId, setMenuCategoryId] = useState('');
  const [menuCategoryList, setMenuCategoryList] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [arrayDataSearch, setArrayDataSearch] = useState([]);

  useEffect(() => {
    document.title = 'Home';

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/meal', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    hubConnection.start();

    hubConnection.on('StopServingMeal', async (mealId) => {
      console.log(mealId);
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
      setCartItems((prevCartItems) => {
        const updatedCartItems = { ...prevCartItems };
        delete updatedCartItems[mealId];
        return updatedCartItems;
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

  const handleCheckout = () => {
    const data = {
      userId: user.customerId,
      totalMoney: calculateTotal(),
      orderDetails: simplifiedCartItems,
    };

    setModalData(data);
    setOpenModalPayment(true);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  useEffect(() => {
    getListMenuCategory();
    // getMeals();
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

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
      console.error(error);
    }
  };

  useEffect(() => {
    if (dataGetAPI && dataGetAPI.length > 0) {
      const mealNames = dataGetAPI.flatMap((menu) =>
        menu.listMeals.map((item) => item)
      );

      setArrayDataSearch(mealNames);
    }
  }, [dataGetAPI]);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth <= 1280);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAddToCart = (meal) => {
    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems };

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
      return updatedCart;
    });
  };

  const handleQuantityChange = (mealId, newQuantity) => {
    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems };

      if (updatedCart[mealId]) {
        updatedCart[mealId] = {
          ...updatedCart[mealId],
          quantity: parseInt(newQuantity, 10) || 0,
        };
      }

      return updatedCart;
    });
  };

  const handleRemoveCartItem = (mealId) => {
    setCartItems((prevCartItems) => {
      const updatedCart = { ...prevCartItems };
      delete updatedCart[mealId];
      return updatedCart;
    });
  };

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const calculateTotal = () => {
    let total = 0;
    for (const cartItem of Object.values(cartItems)) {
      total += cartItem.item.mealPrice * cartItem.quantity;
    }
    return total;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCategoryClick = (categoryId) => {
    setMenuCategoryId(categoryId);
    getMeals(categoryId);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const simplifiedCartItems = Object.values(cartItems).map((cartItem) => ({
    mealId: cartItem.item.mealId,
    quantity: cartItem.quantity,
    unitPrice: cartItem.unitPrice,
  }));
  const handlePaymentSuccess = () => {
    setOpenModalPayment(false);
    toast.success('Payment Order Success');
    clearCart();
  };

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

  const clearSearch = async () => {
    setSearchInput('');
  };

  return (
    <>
      <CouterNavbar />
      <div className="bg-gray-100 min-h-[92vh]">
        <div className="mx-auto py-10 max-w-screen-2xl min-h-fit justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3 xl:w-3/4">
            <div className="xl:mx-32 mb-10">
              <div className="w-full">
                <div className="mx-auto xl:px-11 sm:px-6 xl:max-w-screen-xl md:max-w-screen-sm sm:max-w-prose">
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
                            onClick={() =>
                              handleCategoryClick(item.menuCategoryId)
                            }
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
            </div>

            {loading ? (
              <>
                <div className="max-w-screen-xl mx-auto px-10 mt-10 uppercase font-bold text-2xl underline text-center">
                  <Skeleton width={200} height={25} />
                </div>
                <section
                  key={-1}
                  id="Projects"
                  className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14"
                >
                  {[1, 2, 3].map((index) => (
                    <div key={index}>
                      <div className="md:w-52 xl:w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
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
                <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 mt-10 font-bold text-2xl underline text-center">
                  Search Results
                </div>
                <section
                  id="Projects"
                  className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14 mt-10 pb-16"
                >
                  {filteredMeals.map((item, index) => (
                    <div
                      key={index}
                      className="md:w-52 xl:w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                    >
                      <img
                        src={item.image}
                        alt="Product"
                        className="xl:w-64 xl:h-64 md:h-52 md:w-52 rounded-t-xl bg-gray-300 object-cover"
                      />
                      <div className="px-4 py-3 xl:w-64 md:w-52">
                        <span className="text-gray-400 mr-3 uppercase text-xs">
                          MealCategory
                        </span>
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
                            {isSmallScreen ? (
                              <button
                                type="button"
                                key={item.mealId}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddToCart(item);
                                }}
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                Add
                              </button>
                            ) : (
                              <button
                                type="button"
                                key={item.mealId}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddToCart(item);
                                }}
                                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                Add To Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            ) : (
              dataGetAPI.map((data, index) => (
                <>
                  <div className="max-w-screen-xl mx-auto xl:px-11 sm:px-24 mt-10 font-bold text-2xl underline text-center">
                    {data.menuName}
                  </div>
                  <section
                    key={index}
                    id="Projects"
                    className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-12 gap-x-14 mt-10 pb-16"
                  >
                    {data.listMeals.map((item) => (
                      <div
                        key={item.mealId}
                        className="md:w-52 xl:w-64 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                      >
                        <img
                          src={item.image}
                          alt="Product"
                          className="xl:w-64 xl:h-64 md:h-52 md:w-52 rounded-t-xl bg-gray-300 object-cover"
                        />
                        <div className="px-4 py-3 xl:w-64 md:w-52">
                          <span className="text-gray-400 mr-3 uppercase text-xs">
                            MealCategory
                          </span>
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
                              {isSmallScreen ? (
                                <button
                                  type="button"
                                  key={item.mealId}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(item);
                                  }}
                                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Add
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  key={item.mealId}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(item);
                                  }}
                                  className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Add To Cart
                                </button>
                              )}
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

          <div className="sticky-cart mt-6 md:h-fit rounded-lg border bg-white p-6 pt-3 shadow-md md:mt-0 md:w-1/3 xl:w-1/4">
            <div className="mb-2 flex justify-between">
              <p className="text-lg font-bold">Cart</p>
              <p
                className="text-red-500 underline text-xs font-bold flex items-center cursor-pointer pe-1"
                onClick={handleClearCart}
              >
                Clear Cart
              </p>
            </div>
            <div
              className="mb-3 pb-2 flex justify-between"
              style={{ borderBottom: '1px dashed black' }}
            >
              <p className="font-bold text-base w-1/3 text-start">Quantity</p>
              <p className="font-bold text-base w-1/3 text-center">
                Unit Price
              </p>
              <p className="font-bold text-base w-1/3 text-end pe-1">
                SubTotal
              </p>
            </div>

            <div
              className="max-h-[60vh] md:min-h-[30vh] overflow-auto pe-1"
              style={{ scrollbarWidth: '2px', fontSize: '14px' }}
            >
              {Object.values(cartItems).map((cartItem) => (
                <div className="mb-3" key={cartItem.item.mealId}>
                  <div className="mb-1 flex justify-between items-center">
                    <p className="uppercase">{cartItem.item.mealName}</p>
                    <p>
                      <span
                        className="font-bold text-xl cursor-pointer ms-2 my-2"
                        onClick={() =>
                          handleRemoveCartItem(cartItem.item.mealId)
                        }
                      >
                        x
                      </span>
                    </p>
                  </div>
                  <div className="mb-3 flex justify-between items-center">
                    <p className="w-1/3 text-start">
                      <input
                        className="w-2/3 py-0 pr-0 border-0 ms-1"
                        type="number"
                        min="0"
                        value={cartItem.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            cartItem.item.mealId,
                            e.target.value
                          )
                        }
                      />
                    </p>
                    <p className="w-1/3 text-center">
                      {cartItem.item.mealPrice.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </p>
                    <p className="w-1/3 text-end">
                      {(
                        cartItem.item.mealPrice * cartItem.quantity
                      ).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </p>
                  </div>
                  <hr className="my-3" />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <p className="w-1/2 text-[16px] font-bold">Discount</p>
              <p className="w-1/2 mb-1 text-[16px] font-bold text-end text-red-500">
                -
                {discount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="w-1/2 text-[16px] font-bold">Total</p>
              <p className="w-1/2 mb-1 text-[16px] font-bold text-end text-red-500">
                {calculateTotal().toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </p>
            </div>
            <button
              className="mt-6 w-full rounded-3xl bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <ModalPayment
              openModal={openModalPayment}
              setOpenModal={setOpenModalPayment}
              data={modalData}
              clearCart={clearCart}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
export default OrderListMeal;
