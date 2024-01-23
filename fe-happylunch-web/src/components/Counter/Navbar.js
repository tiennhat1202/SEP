import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo1.svg';
import Cookies from 'js-cookie';
import { UserContext } from '../../store/UserContext';
import { Dropdown } from 'flowbite-react';

function Navbar() {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const { user, logout } = useContext(UserContext);

  function handleLogout() {
    logout();
    navigate('/signin_employee');
  }
  useEffect(() => {
    // Đây là một hàm để kiểm tra khi người dùng cuộn trang.
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

  return (
    <>
      <nav
        className={`bg-white border-gray-500 dark:bg-gray-900 shadow ${
          isSticky ? 'fixed top-0 left-0 w-full z-50' : ''
        }`}
      >
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 pt-0 pb-0">
          <NavLink to="/counter_staff/orderlistmeal" className="flex items-center">
            <img
              src={Logo}
              className="h-8 mr-3"
              alt="Brand Image"
              style={{ width: '64px', height: '64px' }}
            />
          </NavLink>
          <div className="flex items-center md:order-2">
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
              <Dropdown.Header>
                {user && user.name && (
                  <span className="block text-sm text-black truncate  font-medium dark:text-white">
                    {user.name}
                  </span>
                )}
              </Dropdown.Header>
              <Dropdown.Item>
                {' '}
                <NavLink
                  to="/counter_staff/changepassword"
                  className="w-full text-start"
                >
                  Change Password
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                {' '}
                <NavLink
                  className="w-full text-start"
                  onClick={handleLogout}
                  style={{ color: 'red' }}
                >
                  Logout
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* <li>
                <NavLink
                  to="/counter_staff/orderlistmeal"
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
