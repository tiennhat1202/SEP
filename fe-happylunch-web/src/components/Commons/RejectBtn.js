import React from 'react'
import { Link } from 'react-router-dom';
function RejectBtn({ linkName, linkUrl = '' }) {
  return (
    <Link to={linkUrl}>
      <button
        type="button"
        className="max-sm:py-2.5 max-sm:px-7 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-12 py-2.5 text-center  mb-2"
      >
        <p className="mt-0.5">{linkName}</p>
      </button>
    </Link>
  );
}

export default RejectBtn