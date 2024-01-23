import React from 'react';

function Pagination({ postsPerPage, totalPosts, currentPage, paginate, previousPage, nextPage }) {
  const pageNumbers = [];
 
   for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      pageNumbers.push(i);
   }
  return (
    <>
      <nav aria-label="Page navigation example">
  <ul className="inline-flex -space-x-px text-sm">
    <li>
      <button onClick={previousPage}
        className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Previous
      </button>
    </li>
    {pageNumbers.map((number) => (
               <li
                  key={number}
                  onClick={() => paginate(number)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white 
                  ${
                    currentPage === number
                      ? 'bg-blue-500 text-white' // Thay đổi màu nền và màu chữ cho trang hiện tại
                      : 'bg-white text-gray-500'
                  }`}
               >
                  <button onClick={() => paginate(number)}>{number}</button>
               </li>
            ))}
    
    <li>
      <button
      onClick={nextPage}
        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Next
      </button>
    </li>
  </ul>
</nav>

    </>
  );
}

export default Pagination;
