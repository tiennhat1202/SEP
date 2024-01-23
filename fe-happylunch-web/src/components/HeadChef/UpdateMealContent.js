import React from 'react';
import UpdateMeal from '../Commons/SubmitBtn';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import MealService from '../../services/MealService';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import MenuService from '../../services/MenuService';
import BackMenuComponent from '../Commons/BackMenu';
import '../../index.css';

function UpdateMealContent() {
  document.tite = 'Update Meal';
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showFileLoader, setShowFileLoader] = useState(false);
  const [mealData, setMealData] = useState([]);
  const fileTypes = ['JPG', 'PNG', 'GIF'];
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const meal_id = queryParams.get('meal_id');
  const mealService = new MealService();
  const menuService = new MenuService();
  const [menuCate, setMenuCate] = useState([]);
  const [selectMealCate, setSelectMealCate] = useState(null);
  const [selectMenuCate, setSelectMenuCate] = useState(null);
  const [selectMenuName, setSelectMenuName] = useState([]);
  const [selectMealName, setSelectMealName] = useState([]);
  const [selectMenuId, setSelectMenuId] = useState('');
  const [selectMealId, setSelectMealId] = useState('');
  const [mealName, setMealName] = useState('');
  const [mealPrice, setMealPrice] = useState('');
  const [mealDescription, setMealDescription] = useState('');
  const [mealCate, setMealCate] = useState([]);
  const navigate = useNavigate();
  const getMealById = async () => {
    try {
      const response = await mealService.viewMealByMealId(meal_id);
      if (response.code === 200) {
        setMealData(response.response.data);
        setUploadedImage(response.response.data.image);
      }
    } catch (error) {
      toast.error('Error fetching meals:', error);
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

  const getListMealCate = async () => {
    try {
      const res = await mealService.getListMealCate();
      if (res.code === 200) {
        setMealCate(res.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleChange = (file) => {
    setUploadedImage(file);
    setShowFileLoader(false);
  };

  const handleDeleteImage = () => {
    setUploadedImage(null);
    setShowFileLoader(true);
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('MealId', mealData.mealId);
    formData.append('MenuCategoryId', selectMenuId);
    formData.append('MealCategoryId', selectMealId);
    formData.append('MealName', mealName);
    formData.append('MealPrice', mealPrice);
    formData.append('Describe', mealDescription ? mealDescription : 'null');
    formData.append('Image', (typeof uploadedImage === 'string' || uploadedImage === null) ? setUploadedImage(null) : uploadedImage);
    
    
    try {
      const mealService = new MealService();
      const response = await mealService.updateMeal(formData);
      console.log('response: ', response);
      if (response.code === 200) {
        toast.success('Update Meal Successful!');
        setMealName('');
        setSelectMenuCate('');
        setMealPrice('');
        setMealDescription('');
        setUploadedImage(null);
        setSelectMealCate('');
        setShowFileLoader(true);

        setTimeout(() => {
          navigate('/admin/meal_management');
        }, 2000);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    setSelectMenuCate(mealData.menuCategoryName);
    setSelectMealCate(mealData.mealCategoryName);
    setMealName(mealData.mealName);
    setMealPrice(mealData.mealPrice);
    setMealDescription(mealData.mealDescribe);
  }, [mealData]);

  useEffect(() => {
    const selectedItem = menuCate.find(
      (item) => item.menuCategoryName === selectMenuCate
    );
    setSelectMenuId(selectedItem?.menuCategoryId);
  }, [menuCate, selectMenuCate]);

  useEffect(() => {
    const selectedItem = mealCate.find(
      (item) => item.mealCategoryName === selectMealCate
    );
    setSelectMealId(selectedItem?.mealCategoryId);
  }, [mealCate, selectMealCate]);

  useEffect(() => {
    // Set initial state for uploadedImage when mealData is available
    if (mealData.image) {
      setUploadedImage(mealData.image);
      setShowFileLoader(false);
    }
  }, [mealData]);
  useEffect(() => {
    getMealById();
    getListCateMenu();
    getListMealCate();
  }, [meal_id]);
  console.log('MealId: ', mealData.mealId);
  console.log('selectMenuId: ', selectMenuId);
  console.log('selectMealId: ', selectMealId);
  console.log('mealName: ', mealName);
  console.log('mealPrice: ', mealPrice);
  console.log('mealDescribe: ', mealDescription);
  console.log('uploadedImage: ', uploadedImage);
  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='mb-2'>
          <div className='pb-4 flex items-center justify-center'>
            <h2 className='font-bold text-3xl'>Update Meal</h2>
          </div>
          <form onSubmit={handleUpdateSubmit}>
            <div className='w-[32rem] p-4 border-2 border-gray-200 border-solid shadow-xl rounded-lg'>
              <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                Choose File Image
              </label>
              <div className='flex'>
                {showFileLoader === true ? (
                  <FileUploader
                    handleChange={handleChange}
                    name='file'
                    types={fileTypes}
                  />
                ) : (
                  ''
                )}
                <div className='image-container max-h-[14rem]'>
                  {/* <button className='delete-button' onClick={handleDeleteImage}>
                    Delete Image
                  </button> */}
                  {uploadedImage && (
                    <>
                      <img
                        src={
                          uploadedImage instanceof File
                            ? URL.createObjectURL(uploadedImage)
                            : uploadedImage
                        }
                        alt='Uploaded'
                        style={{ maxWidth: '50%', maxHeight: '50%' }}
                      />
                      <p>File Upload: {uploadedImage.name}</p>
                      <div>
                        <button
                          onClick={handleDeleteImage}
                          type='button'
                          className='text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                        >
                          Delete Image
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className='mb-3'>
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
                  id='underline_select'
                  className='block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                  value={selectMenuCate}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectMenuCate(selectedValue);

                    const selectedItem = menuCate.find(
                      (item) => item.menuCategoryName === selectedValue
                    );

                    if (selectedItem) {
                      setSelectMenuName(selectedItem.menuCategoryName);
                    }
                  }}
                >
                  <option value=''>---Choose a menu category---</option>
                  {menuCate.map((item, i) => (
                    <option
                      key={i}
                      value={item.menuCategoryName}
                      title={item.menuCategoryName}
                    >
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
                  id='underline_select'
                  className='block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'
                  value={selectMealCate}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setSelectMealCate(selectedValue);

                    const selectedItem = mealCate.find(
                      (item) => item.mealCategoryName === selectedValue
                    );

                    if (selectedItem) {
                      setSelectMealName(selectedItem.mealCategoryName);
                    }
                  }}
                >
                  <option value=''>---Choose a meal category---</option>
                  {mealCate.map((item, i) => (
                    <option
                      key={i}
                      value={item.mealCategoryName}
                      title={item.mealCategoryName}
                    >
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
                  required
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
                    onChange={(e) => setMealDescription(e.target.value)}
                    value={mealDescription}
                    id='message'
                    rows={4}
                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                    placeholder='Write your thoughts here...'
                    defaultValue={''}
                    required
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
                  Update Meal
                </button>
              </div>
            </div>
          </form>
        </div>
        <ToastContainer></ToastContainer>
      </div>
      <div className='flex ml-[270px]'>
        <BackMenuComponent linkUrl='/admin/meal_management'></BackMenuComponent>
      </div>
    </div>
  );
}

export default UpdateMealContent;
