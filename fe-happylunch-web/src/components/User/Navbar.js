import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo1.svg';
import PaymentService from '../../services/PaymentService';
import 'flowbite';
import { UserContext } from '../../store/UserContext';
import { Dropdown } from 'flowbite-react';
import { FaShoppingCart, FaCircle } from 'react-icons/fa';
import MealService from '../../services/MealService';
import {
  ShoppingCartOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

const mealService = new MealService();

function Navbar({ cartItems }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [isSticky, setIsSticky] = useState(false);
  const customerId = user ? user.customerId : null;

  const [isOpen, setOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);

  useEffect(() => {
    // Function to get cart data from the API
    getCartData(customerId);
  }, [customerId]);

  useEffect(() => {
    // Function to get cart data from the API
    getCartData(customerId);
  }, [cartItems]);

  const getCartData = async (customerId) => {
    if (user.auth) {
      try {
        const response = await mealService.getListMealCartCustomer(customerId);
        if (response.code === 200) {
          if (response.response.data.length > 0) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }
      } catch (error) {
        // console.error(error);
      }
    } else {
      const cartDataFromLocalStorage = JSON.parse(
        localStorage.getItem('CartLocalStorage')
      );
      if (cartDataFromLocalStorage && cartDataFromLocalStorage.length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  };

  function handleClick() {
    navigate('/payment');
  }

  function handleLogout() {
    if (user.roleName === 'RL_Customer') {
      logout();
      navigate('/signin');
    } else {
      logout();
      navigate('/signin_employee');
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup sự kiện khi component bị unmount.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const showBalance = async () => {
    const paymentService = new PaymentService();
    const response = await paymentService.getBalance(customerId);
    if (response.code === 200) {
      setBalance(response.response.data);
    }
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <>
      <nav
        className={`bg-white border-gray-500 dark:bg-gray-900 shadow ${
          isSticky ? 'fixed top-0 left-0 w-full z-50' : ''
        }`}
      >
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 pt-0 pb-0">
          <NavLink to="/" className="flex items-center">
            <img
              src={Logo}
              className="h-8 mr-3"
              alt="Brand Image"
              style={{ width: '64px', height: '64px' }}
            />
          </NavLink>
          <div className="flex items-center md:order-2">
            <button type="button" className="flex mr-5" onClick={handleClick}>
              <div className="relative pt-1">
                <div className="absolute left-3 top-2 ">
                  {isOpen == true && (
                    <FaCircle className="text-red-500 w-3 h-3"></FaCircle>
                  )}
                </div>
                <ShoppingCartOutlined className="mt-3 mb-4 text-[18px] hover:text-blue-500 cursor-pointer" />
              </div>
            </button>

            <Dropdown
              size="sm"
              renderTrigger={() => (
                <img
                  className="w-8 h-8 rounded-full cursor-pointer"
                  src={require('../../assets/images/avtdefault.png')}
                  alt="user photo"
                />
              )}
            >
              {user.auth && (
                <Dropdown.Header>
                  {user && user.name && user.auth && (
                    <span className="block text-sm text-black truncate  font-medium dark:text-white">
                      {user.name}
                    </span>
                  )}

                  <span className="flex justify-between mt-2 truncate text-sm font-medium">
                    Balance:{' '}
                    {isBalanceVisible && balance !== null
                      ? balance
                          .toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })
                          .replace(/\./g, ',')
                      : 'N/A'}{' '}
                    <span
                      className="text-xs cursor-pointer ml-1 justify-end"
                      onClick={showBalance}
                    >
                      {isBalanceVisible ? (
                        <EyeInvisibleOutlined className="text-[18px]" />
                      ) : (
                        <EyeOutlined className="text-[18px]" />
                      )}
                    </span>
                  </span>
                </Dropdown.Header>
              )}

              <Dropdown.Item>
                {' '}
                <NavLink to="/payment" className="w-full text-start">
                  Payment Order
                </NavLink>
              </Dropdown.Item>
              {user.auth && (
                <Dropdown.Item>
                  {' '}
                  <NavLink to="/deposit" className="w-full text-start">
                    Deposit
                  </NavLink>
                </Dropdown.Item>
              )}
              {user.auth && (
                <Dropdown.Item>
                  {' '}
                  <NavLink to="/transfermoney" className="w-full text-start">
                    Transfer Money
                  </NavLink>
                </Dropdown.Item>
              )}
              {user.auth && (
                <Dropdown.Item>
                  {' '}
                  <NavLink to="/orderhistory" className="w-full text-start">
                    Order History
                  </NavLink>
                </Dropdown.Item>
              )}
              {user.auth && (
                <Dropdown.Item>
                  {' '}
                  <NavLink to="/changePassword" className="w-full text-start">
                    Change Password
                  </NavLink>
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              {user.auth ? (
                <Dropdown.Item>
                  {' '}
                  <NavLink
                    to="#"
                    onClick={handleLogout}
                    style={{ color: 'red' }}
                    className="w-full text-start"
                  >
                    Logout
                  </NavLink>
                </Dropdown.Item>
              ) : (
                <Dropdown.Item>
                  {' '}
                  <Link
                    to="/signin"
                    style={{ color: 'red' }}
                    className="w-full text-start"
                  >
                    Login
                  </Link>
                </Dropdown.Item>
              )}
            </Dropdown>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <NavLink
                  to="/"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="#"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/report"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Support
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
