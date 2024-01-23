import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
Quill.register('modules/imageResize', ImageResize);
import ImageResize from 'quill-image-resize-module-react';
import FeedbackService from '../../services/FeedbackService';
import { Button, Spin } from 'antd';
import { toast } from 'react-toastify';
function FeedbackDetailContent() {
  document.title = 'Feedback Detail';
  const [spinning, setSpinning] = useState(false);
  const { orderId } = useParams();
  const [valueFeedback, setValueFeedback] = useState('');
  const [data, setData] = useState([]);
  const feedbackService = new FeedbackService();
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }],
      ['link', 'image', 'video'],
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
  };

  useEffect(() => {
    getFeedbackDetail();
  }, [orderId]);

  const getFeedbackDetail = async () => {
    try {
      setSpinning(true);
      const response =
        await feedbackService.getViewFeedbackDetailCanteenManager(orderId);
      if (response && response.code == 200) {
        setData(response.response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSpinning(false);
    }
  };

  const postReplyFeedback = async () => {
    try {
      const response =
        await feedbackService.postRepesonseFeedbackCanteenManager(
          orderId,
          valueFeedback
        );
      if (response && response.code == 200) {
        toast.success('Successfully', response.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  function parseDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Todo';
      case -1:
        return 'Cancel';
      case 1:
        return 'InProgress';
      case 2:
        return 'Waiting';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };
  console.log(data);

  const handleReplyFeedback = async () => {
    await postReplyFeedback();
    setValueFeedback('');
    await getFeedbackDetail();
  };

  return (
    <>
      <Spin spinning={spinning} fullscreen />
      <h2 className='mb-2 font-bold text-2xl'>FeedBack Detail</h2>
      <div className=' rounded-lg min-h-[70vh]'>
        <div className='relative overflow-x-auto sm:rounded-lg min-h-[65vh]'>
          <div className='mb-2 static'>
            <div className='xl:flex max-w-screen-3xl xl:mx-auto md:mx-8 mx-3 sm:block md:block'>
              <div className='xl:w-full md:w-full sm:w-full'>
                <div>
                  <div className='bg-gray-100 gap-4 border-solid border-2 py-2 px-5 rounded-lg flex justify-between'>
                    <div>
                      <div>
                        <p className='text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                          CustomerID:{' '}
                          <span className='text-blue-600 uppercase'>
                            {' '}
                            {data.customerId}
                          </span>
                        </p>

                        <p className='text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                          Order:{' '}
                          <span className='text-blue-600 uppercase'>
                            {' '}
                            {data.orderId}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className='text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                          Name:
                        </div>
                        <span className='text-base lg:text-md font-semibold leading-7 lg:leading-9 text-blue-600'>
                          {data.customerName}
                        </span>
                        <div className='text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                          Order Date:{' '}
                          <span className='text-blue-600'>
                            {parseDateTime(data.orderDate).toLocaleString(
                              'vi-VN'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className='text-base dark:text-white lg:flex  lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                        Total:{' '}
                        <span className='px-4 mx-3 text-red-600'>
                          {' '}
                          {data.totalMoney &&
                            data.totalMoney.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                        </span>
                      </p>
                      <p className='text-base lg:flex dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800'>
                        Status
                        <span
                          className={` ${
                            data.status === 0
                              ? 'status-0 py-0'
                              : data.status === 1
                              ? 'status-1'
                              : data.status === 2
                              ? 'status-2'
                              : data.status === -1
                              ? 'status--1'
                              : data.status === 3
                              ? 'status-3'
                              : ''
                          } mx-3`}
                        >
                          {' '}
                          {getStatusText(data.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto mt-3 border-solid border-s-2 border-e-2 border-t-2'>
                      <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border-solid border-2'>
                        <tr>
                          <th scope='col' className='px-6 py-3'>
                            Product Name
                          </th>
                          <th scope='col' className='px-6 py-3 text-center'>
                            Quantity
                          </th>
                          <th scope='col' className='px-6 py-3 text-center'>
                            UnitPrice
                          </th>
                          <th scope='col' className='px-6 py-3 text-center'>
                            SubTotal
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.listMealOrder &&
                          data.listMealOrder.map((item, index) => (
                            <tr
                              key={index}
                              className='bg-white border-b dark:bg-gray-900 dark:border-gray-700'
                            >
                              <th
                                scope='row'
                                className='px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white'
                              >
                                {item.mealName}
                              </th>
                              <td className='px-6 py-4 text-center'>
                                {item.quantity}
                              </td>
                              <td className='px-6 py-4 text-center'>
                                {item.unitPrice.toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </td>
                              <td className='px-6 py-4 text-center'>
                                {(
                                  item.unitPrice * item.quantity
                                ).toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className='w-full text-sm text-gray-500 dark:text-gray-400 mx-auto mt-3'>
                    <div
                      className='py-2 '
                      style={{ border: '2px solid #e5e7eb ' }}
                    >
                      <p className='text-black px-3 font-bold'>
                        {' '}
                        Feedback Content
                      </p>
                      <div className='min-h-36 p-3'>
                        {data && (
                          <div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: `
                                  <style>
                                  p{
                                    color: black
                                  }
                                    img{
                                        cursor: default !important;
                                        border-radius: 10px;
                                    }
                                  </style>
                                  ${data.feedbackContent}
                                `,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <p className='text-black px-3 font-bold'>
                        {' '}
                        Feedback response
                      </p>
                      <div className='min-h-36 p-3'>
                        {data ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `
                                  <style>
                                  p{
                                    color: black
                                  }
                                    img{
                                        cursor: default !important;
                                        border-radius: 10px;
                                    }
                                  </style>
                                  ${
                                    data.feedbackResponse === 'Not Response'
                                      ? 'No response'
                                      : data.feedbackResponse
                                  }
                                `,
                            }}
                          ></div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                    <div>
                      <div className='mt-2'>
                        <div className={`mb-2 ${data.feedbackResponse === 'Not Response' ? 'block' : 'hidden'}`}>
                          <ReactQuill
                            theme='snow'
                            value={valueFeedback}
                            onChange={setValueFeedback}
                            modules={modules}
                          />
                        </div>
                        <div className={`flex justify-end ${data.feedbackResponse === 'Not Response' ? 'block' : 'hidden'}`}>
                          <button
                            className='bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center'
                            onClick={handleReplyFeedback}
                          >
                            Reply
                            <img
                              className='ml-1'
                              width='16'
                              height='16'
                              style={{ filter: 'invert(1)' }}
                              src='https://img.icons8.com/sf-regular-filled/48/paper-plane.png'
                              alt='paper-plane'
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedbackDetailContent;
