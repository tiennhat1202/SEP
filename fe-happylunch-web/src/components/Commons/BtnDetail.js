import React from 'react'
import { Link } from 'react-router-dom'
function BtnEdit({ linkUrl='', onClick }) {
  return (
    <Link to={linkUrl}>
      <div>
        <button onClick={onClick}
          type="button"
          className=" text-sm px-5 py-2 text-center text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        >
          Detail
        </button>
      </div>
    </Link>
  );
}

export default BtnEdit