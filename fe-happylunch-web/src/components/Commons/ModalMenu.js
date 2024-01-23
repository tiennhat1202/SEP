import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isShowing, hide, mealsData, menuName }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className='modal-overlay' />
          <div
            className='modal-wrapper'
            aria-modal
            aria-hidden
            tabIndex={-1}
            role='dialog'
          >
            <div className='modal m-auto mt-64 max-h-[670px] max-w-[1000px]'>
              <div className='modal-header flex justify-between items-center'>
                <div className='text-center text-2xl font-bold flex-grow'>
                  Meal list of &quot;{menuName}&quot;
                </div>
                <button
                  type='button'
                  className='modal-close-button'
                  data-dismiss='modal'
                  aria-label='Close'
                  onClick={hide}
                >
                  <span aria-hidden='true'>x</span>
                </button>
              </div>
              <div className='flex flex-col'>
                <div className='py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
                  <div className='max-h-[400px] overflow-y-auto inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg'>
                    <table className='min-w-full'>
                      <thead>
                        <tr>
                          <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                            Meal Name
                          </th>
                          <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                            Meal Price
                          </th>
                          <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                            Description
                          </th>
                          <th className='px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50'>
                            IsDelete
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white'>
                        {mealsData?.map((item, i) => (
                          <tr key={i}>
                            <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                              <div className='flex items-center'>
                                <div className='flex-shrink-0 w-10 h-10'>
                                  <img
                                    className='w-10 h-10 rounded-full'
                                    src={item.image}
                                    alt={item.mealName}
                                  />
                                </div>
                                <div className='ml-4'>
                                  <div className='text-sm font-medium leading-5 text-gray-900'>
                                    {item.mealName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                              <div className='text-sm leading-5 text-gray-500'>
                                {item.mealPrice.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </div>
                            </td>
                            <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                              <span className='text-sm leading-5 text-gray-500'>
                                {item.mealDescribe}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                              <span className='text-sm leading-5 text-gray-500'>
                                {item.mealIsDelete}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;

export default Modal;
