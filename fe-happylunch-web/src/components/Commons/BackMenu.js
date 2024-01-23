import React from 'react';
import { Link } from 'react-router-dom'
function BackMenu({ linkUrl='' }) {
  return (
    <Link to={linkUrl}>
      <div className='flex py-5 '>
            {/* <Link to={'/admin/menu_management/create_menu'}> */}
            <div className='text-left align-middle'>
              <svg
                className='w-4 h-4 text-blue-800 dark:text-white mt-1 mr-1'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 14 10'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 5H1m0 0 4 4M1 5l4-4'
                />
              </svg>
            </div>
            <button>
            <span className='hover:text-blue-600'>Back to Menu</span>
            </button>
            {/* </Link> */}
          </div>
    </Link>
  );
}

export default BackMenu;
