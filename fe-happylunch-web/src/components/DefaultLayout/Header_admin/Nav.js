import React from 'react';
import LogoBtnComponent from '../../Commons/LogoBtn';
import AvatarDropDownComponent from '../../Commons/AvatarDropDown';

function Nav() {
  return (
    <nav className="fixed z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-1 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <LogoBtnComponent></LogoBtnComponent>
          <AvatarDropDownComponent></AvatarDropDownComponent>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
