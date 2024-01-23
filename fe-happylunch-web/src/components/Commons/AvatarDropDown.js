import React, { useContext, useState } from 'react';
import { UserContext } from '../../store/UserContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { Dropdown } from 'flowbite-react';
import ButtonNotify from '../Commons/NotifyButtonDropdown';

function AvatarDropDown() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  function handleLogout() {
    if (user.roleName === 'RL_Customer') {
      console.log('logout: ', logout)
      logout();
    } else {
      console.log('logout1')
      logout();
    }
  }
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4 pt-0 pb-0">
          <div className="flex items-center md:order-2">
            {/* Thông báo */}
            <ButtonNotify />
            {/* Setting */}
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
                <NavLink to="#" className="w-full text-start">
                  Edit Profile
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                {' '}
                <NavLink
                  to="/admin/changepassword"
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
        </div>
      </div>
    </div>
  );
}

export default AvatarDropDown;
