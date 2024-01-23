import React, { useEffect } from 'react';
import { useState } from 'react';
import MealService from '../../services/MealService';
import MenuService from '../../services/MenuService';
import { ToastContainer, toast } from 'react-toastify';
import { FileUploader } from 'react-drag-drop-files';
import { Spin } from 'antd';
import '../../index.css';
import BackMenuComponent from '../Commons/BackMenu';
function CreateMealContent() {
  document.tite = 'Create Meal';

  const [mealName, setMealName] = useState('');
  const [mealPrice, setMealPrice] = useState('');
  const [description, setDescription] = useState('');
  const [mealCate, setMealCate] = useState([]);
  const [menuCate, setMenuCate] = useState([]);
  const [selectMealCate, setSelectMealCate] = useState(null);
  const [selectMenuCate, setSelectMenuCate] = useState(null);
  const [showFileLoader, setShowFileLoader] = useState(true);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileTypes = ['JPG', 'PNG', 'GIF'];
  const [loading, setLoading] = useState(false);
  const mealService = new MealService();
  const menuService = new MenuService();
  const getMealCate = async () => {
    try {
      const response = await mealService.getListMealCate();
      if (response.code === 200 && response.response.data) {
        setMealCate(response.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getListCateMenu = async () => {
    try {
      const response = await menuService.viewListCateMenu();
      if (response.code === 200 && response.response.data) {
        setMenuCate(response.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getMealCate();
    getListCateMenu();
  }, []);
  const handleChange = (file) => {
    setUploadedImage(file);
    setShowFileLoader(false);
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setShowFileLoader(true);
  };

  const handleSelectMealCateChange = (event) => {
    setSelectMealCate(event.target.value);
  };
  const handleSelectMenuCateChange = (event) => {
    setSelectMenuCate(event.target.value);
  };

  // const handleFileSelect = (event) => {
  //   setImage(event.target.files[0]);
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('MenuCategoryId', selectMenuCate);
    formData.append('MealCategoryId', selectMealCate);
    formData.append('MealName', mealName);
    formData.append('MealPrice', mealPrice);
    formData.append('Describe', description ? description : 'null');
    formData.append('Image', uploadedImage);
    try {
      const mealService = new MealService();
      const response = await mealService.createMealForHeadChef(formData);
      if (response.code === 200) {
        toast.success(response.response.data);
        setMealName('');
        setSelectMenuCate('');
        setMealPrice('');
        setDescription('');
        setUploadedImage(null);
        setSelectMealCate('');
        setShowFileLoader(true);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div>
      <Spin spinning={loading} fullscreen />
      <div className='flex items-center justify-center'>
        <div className=''>
          <div className='pb-4 flex items-center justify-center'>
            <h2 className='font-bold text-3xl'>Create Meal</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='w-[32rem] p-4 border-2 border-gray-200 border-solid shadow-xl rounded-lg'>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Choose File Image
              </label>
              <div className='flex justify-center'>
                {showFileLoader ? (
                  <FileUploader
                    handleChange={handleChange}
                    name='file'
                    types={fileTypes}
                  />
                ) : (
                  <div className='image-container'>
                    {/* <button className='delete-button' onClick={handleDeleteImage}>
                    Delete Image
                  </button> */}
                    {uploadedImage && (
                      <>
                        <img
                          src={URL.createObjectURL(uploadedImage)}
                          alt='Uploaded'
                          style={{ maxWidth: '25%' }}
                        />
                        <p>File Upload: {uploadedImage.name}</p>
                        <button
                          className='delete-button'
                          onClick={handleDeleteImage}
                        >
                          X
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className='mb-3 mt-5'>
                <label
                  htmlFor='base-input'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Meal Name
                </label>
                <input
                  onChange={(e) => setMealName(e.target.value)}
                  value={mealName}
                  required
                  type='text'
                  id='base-input'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <div className='mb-3 mt-5'>
                <label
                  htmlFor='default'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Menu Category
                </label>
                <select
                  id='default'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  value={selectMenuCate}
                  onChange={handleSelectMenuCateChange}
                >
                  <option hidden defaultValue=''>
                    ---Choose a menu category---
                  </option>
                  {menuCate.map((item, i) => (
                    <option key={i} value={item.menuCategoryId}>
                      {item.menuCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-3 mt-5'>
                <label
                  htmlFor='default'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Meal Category
                </label>
                <select
                  id='default'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                  value={selectMealCate}
                  onChange={handleSelectMealCateChange}
                >
                  <option hidden defaultValue=''>
                    ---Choose a meal category---
                  </option>
                  {mealCate.map((item, i) => (
                    <option key={i} value={item.mealCategoryId}>
                      {item.mealCategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='default-input'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Price
                </label>
                <input
                  onChange={(e) => setMealPrice(e.target.value)}
                  value={mealPrice}
                  type='text'
                  id='default-input'
                  placeholder='VNĐ'
                  className='pr-16 placeholder:absolute placeholder:top-0 placeholder:text-sm placeholder:right-2 placeholder:translate-y-2/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <div className='mb-3'>
                <>
                  <label
                    htmlFor='message'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Description
                  </label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    id='message'
                    rows={4}
                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Write your thoughts here...'
                    defaultValue={''}
                  />
                </>
              </div>
              <div className='mb-6 flex items-center justify-center'>
                {/* <CreateMealBtn
                onSubmit={handleSubmit}
                linkName={'Create Meal'}
              ></CreateMealBtn> */}
                <button
                  type='submit'
                  className='text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 mt-5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                >
                  Create Meal
                </button>
              </div>
            </div>
          </form>
        </div>
        <ToastContainer></ToastContainer>
      </div>
      <div className='flex'>
          <BackMenuComponent linkUrl='/admin/meal_management'></BackMenuComponent>
        </div>
    </div>
  );
}

export default CreateMealContent;
