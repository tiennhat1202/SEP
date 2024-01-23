import React from 'react'

function FilterBy({ setFilterBy }) {
  const handleFilterChange = (value) => {
    setFilterBy(value);
  };
  return (
    <div className='md:text-end lg:text-left'>
      <div className='md:text-end lg:text-left max-sm:mt-3 max-sm:mb-2'>
        <button
          id='dropdownHoverButton'
          data-dropdown-toggle='dropdownHover'
          data-dropdown-trigger='hover'
          className='border hover:border-gray-600 text-gray-500 bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2 text-left inline-flex items-center '
          type='button'
        >
          Sort by
          <svg
            className='w-2.5 h-2.5 ml-2.5'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 10 6'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='m1 1 4 4 4-4'
            />
          </svg>
        </button>
        {/* Dropdown menu */}
        <div
          id='dropdownHover'
          className='z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700'
        >
          <ul
            className='py-2 text-sm text-gray-700 dark:text-gray-200'
            aria-labelledby='dropdownHoverButton'
          >
            <li onClick={() => handleFilterChange('none')}>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                None
              </a>
            </li>
            <li onClick={() => handleFilterChange('Meal Name')}>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Meal Name
              </a>
            </li>
            <li onClick={() => handleFilterChange('Description')}>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Description
              </a>
            </li>
            <li onClick={() => handleFilterChange('Price')}>
              <a
                href='#'
                className='block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
              >
                Price
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FilterBy