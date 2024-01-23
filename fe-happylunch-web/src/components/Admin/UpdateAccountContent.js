import React from 'react';
import BackMenuComponent from '../Commons/BackMenu';

function AccountDetailContent() {
  document.title = 'Update Account'

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='pb-2'>
          <div className='pb-2 flex items-center justify-center'>
            <h2 className='font-bold text-3xl'>Update Account</h2>
          </div>
          <form /* onSubmit={handleSubmit} */>
            <div className='w-[32rem] p-4 border-2 border-gray-200 border-solid shadow-xl rounded-lg'>
              <div className='mb-3 mt-5'>
                <label
                  htmlFor='base-input'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Account Name
                </label>
                <input
                  /* onChange={(e) => setMealName(e.target.value)}
                value={mealName} */
                  required
                  type='text'
                  id='base-input'
                  className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
              </div>
              <div className='mb-3'>
                <label
                  htmlFor='default-input'
                  className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                >
                  Input 1
                </label>
                <input
                  /* onChange={(e) => setMealPrice(e.target.value)}
                value={mealPrice} */
                  type='text'
                  id='default-input'
                  className='pr-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                />
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
                  Update Account
                </button>
              </div>
            </div>
          </form>
          <div className='text-end mt-2 grid grid-cols-2'>
            <BackMenuComponent linkUrl='/admin/account_management'></BackMenuComponent>
          </div>
        </div>
        {/* <ToastContainer></ToastContainer> */}
      </div>
    </div>
  );
}

export default AccountDetailContent;
