import React from 'react'
import { Link } from 'react-router-dom'
function DeleteRole({ onClick }) {
  return (
    <div>
        <div>
          <button onClick={onclick}
            type='button'
            className=' text-sm px-6 py-2 text-center text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'
          >
            Delete
          </button>
        </div>
    </div>
  );
}

export default DeleteRole