import React from 'react';
import { useState } from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import BtnEdit from '../Commons/BtnDetail';
import MenuService from '../../services/MenuService';
import { useEffect } from 'react';
import BackMenuComponent from '../Commons/BackMenu';

function MenuDetails() {
  document.title = 'Menu Detail'
  const location = useLocation();
  const [menuDetailData, setMenuDetailData] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const menuId = searchParams.get('menuId');
  useEffect(() => {
    // Fetching Data
    const getMenuDetails = async () => {
      const menuService = new MenuService();
      try {
        const response = await menuService.getMenuDetailById(menuId);
        if (response) {
          setMenuDetailData(response.response.data);
        }
      } catch (error) {
        toast.error('Error fetching meals:', error);
      }
    };
    getMenuDetails();
  }, [menuId]);
  return (
    <div>
      <div className="mb-2">
        <h2 className="font-bold text-2xl mb-2">Menu Detail</h2>
        <div className="pb-4 lg:flex md:flex sm:flex gap-4 max-sm:inline-block place-items-center">
          <div className="sm:mr-0 w-80">
            <SearchFieldComponent
            /* onSearch={handleSearch} */
            ></SearchFieldComponent>
          </div>
        </div>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only"></span>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  {/* <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Description
                      <a href="#">
                        <svg
                          className="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th> */}
                  {/* <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Date Release
                      <a href="#">
                        <svg
                          className="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th> */}
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Price
                      <a href="#">
                        <svg
                          className="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="flex items-center">
                      Description
                      <a href="#">
                        <svg
                          className="w-3 h-3 ml-1.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                        </svg>
                      </a>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <div className="text-center">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  <tr
                    key={menuDetailData.menuId}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="w-32 p-6">
                      {/* <img
                        className='w-20 ml-4'
                        src={item.image}
                        alt={item.mealName}
                      ></img> */}
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {menuDetailData.menuCategoryName}
                    </th>
                    <td className="px-6 py-4">{menuDetailData.menuName}</td>
                    <td className="px-6 py-4">{menuDetailData.describe}</td>
                    <td className=" text-center">
                      <BtnEdit
                        linkUrl={'/admin/menu_management/menu_details'}
                      ></BtnEdit>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-end mt-2 grid grid-cols-2">
          <BackMenuComponent linkUrl="/admin/menu_management"></BackMenuComponent>
        </div>
      </div>
    </div>
  );
}

export default MenuDetails;
