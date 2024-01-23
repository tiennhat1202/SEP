import React from 'react';
import { Link, NavLink } from 'react-router-dom';
function CreateMenuButton({ linkName, linkUrl = '' }) {
  return (
    <NavLink to={linkUrl}>
      <button
        type="button"
        className="whitespace-nowrap text-sm max-sm:px-10  px-10 py-2.5 max-sm:py-2 text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg"
      >
        <div className="lg:flex md:flex sm:flex max-sm:flex justify-center text-sm">
          <div></div>
          <p className="align-middle mt-0.5">{linkName}</p>
        </div>
      </button>
    </NavLink>
  );
}

export default CreateMenuButton;
