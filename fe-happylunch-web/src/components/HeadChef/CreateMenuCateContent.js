import React from 'react';
import CreateMenuCate from '../Commons/SubmitBtn';
import MenuService from '../../services/MenuService';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import BackMenuComponent from '../Commons/BackMenu';

function CreateMenuCateContent() {
  document.title = 'Create Menu Category';

  const [menuCategoryName, setMenuCateName] = useState('');
  const [describe, setDescribe] = useState('');

  const handleSubmit = () => {
    const menuCateData = {
      menuCategoryName,
      describe,
    };
    createMenuCate(menuCateData);
  };

  const createMenuCate = async (menuCateData) => {
    const menuService = new MenuService();
    try {
      const response = await menuService.createMenuCate(menuCateData);
      if (response.code === 200) {
        toast.success('Add Successfully');
      }
    } catch (error) {
      toast.error('Add Failed', error);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="p-4">
          <div className="pb-4 flex items-center justify-center">
            <h2 className="font-bold text-3xl">Create Menu Category</h2>
          </div>
          <form onSubmit>
            <div className="w-[32rem] p-4 border-2 border-gray-200 border-solid rounded-lg">
              <div className="mb-3 mt-12">
                <label
                  htmlFor="base-input"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Menu Category Name
                </label>
                <input
                  onChange={(e) => setMenuCateName(e.target.value)}
                  value={menuCategoryName}
                  required
                  type="text"
                  id="base-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    onChange={(e) => setDescribe(e.target.value)}
                    value={describe}
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                    defaultValue={''}
                  />
                </>
              </div>
              <div className="mb-6 flex items-center justify-center">
                <CreateMenuCate
                  onSubmit={handleSubmit}
                  linkName={'Create Menu Category'}
                ></CreateMenuCate>
              </div>
            </div>
          </form>
          <div className="text-end mt-2 grid grid-cols-2">
            <BackMenuComponent linkUrl="/admin/menu_category"></BackMenuComponent>
          </div>
        </div>
        <ToastContainer></ToastContainer>
      </div>
    </div>
  );
}

export default CreateMenuCateContent;
