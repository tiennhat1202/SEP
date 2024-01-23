import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import OrderService from '../../services/OrderService';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Breadcrumb } from 'flowbite-react';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

Quill.register('modules/imageResize', ImageResize);

function OrderHistoryDetails() {
  const { orderId } = useParams();
  const [orderHistoryDetails, setOrderHistoryDetails] = useState(null);
  const [valueFeedback, setValueFeedback] = useState('');

  const orderService = new OrderService();
  const [openModal, setOpenModal] = useState({
    open: false,
    type: '',
  });
  const discount = 0;
  const [loading, setLoading] = useState(false);

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
    document.title = 'OrderDetail';
    getOrderDetails(orderId);
  }, []);

  const getOrderDetails = async (orderId) => {
    try {
      const response = await orderService.getOrderHistoryDetailsCustomer(
        orderId
      );
      if (response.code === 200) {
        setOrderHistoryDetails(response.response.data);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cancelOrder = async () => {
    setLoading(true);
    try {
      const response = await orderService.cancelOrderCustomer(orderId);
      if (response.code === 200) {
        toast.success('Order was successfully canceled');
        getOrderDetails(orderId);
        setLoading(false);
      } else {
        toast.error('Failed to cancel the order');
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async () => {
    try {
      const response = await orderService.feedbackOrderCustomer(
        orderId,
        valueFeedback
      );
      if (response.code === 200) {
        toast.success('Send Feedback successfully');
        setValueFeedback('You have completed the feedback');
        getOrderDetails(orderId);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const reOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.postReOrderCustomer(orderId);
      if (res && res.code === 200) {
        toast.success('Reorder successfully');
        getOrderDetails(orderId);
        setLoading(false);
      }
    } catch (error) {
      toast.success('Reorder failed');
    } finally {
      setLoading(false);
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

  return (
    <>
      <div className="mb-10 static min-h-[100vh]">
        <div>
          <h2 className="text-xl text-gray-800 font-bold sm:text-3xl dark:text-white text-center pt-5 mb-2">
            Order Detail
          </h2>
        </div>
        <div className="max-w-screen-2xl mx-auto pt-5 mb-3">
          <Breadcrumb
            aria-label="Solid background breadcrumb example"
            className="bg-gray-50 px-5 py-3 dark:bg-gray-800 rounded-md"
          >
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/orderhistory">OrderHistory</Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item>
              <Link to={`/orderhistory/${orderId}`}>OrderDetail</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="xl:flex max-w-screen-2xl xl:mx-auto md:mx-8 mx-3 sm:block md:block">
          <div className="xl:w-3/4 md:w-full sm:w-full">
            {orderHistoryDetails ? (
              <div>
                <div className="bg-gray-100 border-solid border-2 py-2 px-5 rounded-lg flex justify-between">
                  <div>
                    <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800">
                      Order ID:{' '}
                      <span className="text-blue-600 uppercase">
                        {orderHistoryDetails.orderId}
                      </span>
                    </p>
                    <div className="flex items-center">
                      <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800">
                        Order Date:{' '}
                        {parseDateTime(
                          orderHistoryDetails.orderDate
                        ).toLocaleString('vi-VN')}
                      </p>
                      <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                      <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800">
                        OrderIndex:{' '}
                        <span className="text-blue-600 uppercase">
                          {orderHistoryDetails.orderIndex}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-6 text-gray-800 flex items-center">
                    <span
                      className={` ${
                        orderHistoryDetails.status === 0
                          ? 'status-0 py-0'
                          : orderHistoryDetails.status === 1
                          ? 'status-1'
                          : orderHistoryDetails.status === 2
                          ? 'status-2'
                          : orderHistoryDetails.status === -1
                          ? 'status--1'
                          : orderHistoryDetails.status === 3
                          ? 'status-3'
                          : ''
                      }`}
                    >
                      {' '}
                      {getStatusText(orderHistoryDetails.status)}
                    </span>
                  </p>
                </div>
                <div>
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto mt-3 border-solid border-2">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 border-solid border-2">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Product Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          UnitPrice
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          SubTotal
                        </th>
                      </tr>
                    </thead>
                    {orderHistoryDetails.listMealOrder.map((meal, index) => (
                      <tbody key={index}>
                        <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                          <th
                            scope="row"
                            className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white"
                          >
                            {meal.mealName}
                          </th>
                          <td className="px-6 py-4 text-center">
                            {meal.quantity}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {meal.mealPrice.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {meal.unitPrice.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>

                {orderHistoryDetails.status === 3 && (
                  <div className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto mt-3">
                    <div
                      className="py-2 "
                      style={{ border: '2px solid #e5e7eb ' }}
                    >
                      <p className="text-black px-6 font-bold">
                        {' '}
                        Feedback Content
                      </p>
                      <div className="min-h-36 p-6">
                        {orderHistoryDetails && (
                          <div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: `
                                  <style>
                                    img{
                                        cursor: default !important;
                                        border-radius: 10px;
                                    }
                                  </style>
                                  ${
                                    orderHistoryDetails.feedbackContent === null
                                      ? 'No feedback content'
                                      : orderHistoryDetails.feedbackContent
                                  }
                                `,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                      {orderHistoryDetails.feedbackResponse !== null && (
                        <>
                          <p className="text-black px-6 font-bold">
                            Feedback Response
                          </p>
                          <div className="min-h-36 p-6">
                            {orderHistoryDetails && (
                              <div>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: `
                                  <style>
                                    img{
                                        cursor: default !important;
                                        border-radius: 10px;
                                    }
                                  </style>
                                  ${orderHistoryDetails.feedbackResponse}
                                `,
                                  }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {orderHistoryDetails && orderHistoryDetails.status === 3 ? (
                      <div
                        className={`mt-3 ${
                          orderHistoryDetails.feedbackContent !== null
                            ? 'hidden'
                            : 'block'
                        }`}
                      >
                        <ReactQuill
                          theme="snow"
                          value={valueFeedback}
                          onChange={setValueFeedback}
                          modules={modules}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            className="bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center cursor-pointer"
                            onClick={sendFeedback}
                          >
                            Send
                            <img
                              className="ml-2"
                              width="16"
                              height="16"
                              style={{ filter: 'invert(1)' }}
                              src="https://img.icons8.com/sf-regular-filled/48/paper-plane.png"
                              alt="paper-plane"
                            />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Skeleton count={3} height={20} />
                <div className="bg-gray-100 mt-3 rounded-lg p-2">
                  <Skeleton count={3} height={40} />
                </div>
              </div>
            )}
          </div>
          <div className="xl:w-1/4 md:w-full sm:w-full xl:ml-4 md:mt-3 mt-3 xl:mt-0 border-solid border-2 rounded-lg text-sm h-fit">
            <div className="bg-gray-100 px-4 py-2 text-sm">PAYMENT METHOD</div>
            <div className="flex justify-between px-4">
              {orderHistoryDetails?.paymentMethod === 3 ? (
                <>
                  <p className="py-2">VNPay</p>
                  <span className="flex items-center font-bold text-black">
                    {orderHistoryDetails?.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </span>
                </>
              ) : orderHistoryDetails?.paymentMethod === 2 ? (
                <>
                  <p className="py-2">Wallet</p>
                  <span className="flex items-center font-bold text-black">
                    {orderHistoryDetails?.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </span>
                </>
              ) : (
                <>
                  <p className="py-2">Cash</p>
                  <span className="flex items-center font-bold text-black">
                    {orderHistoryDetails?.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </span>
                </>
              )}
            </div>
            <div className="flex justify-between px-4">
              <p className="py-2">Provisional Amount</p>
              <span className="flex items-center font-bold text-black">
                {orderHistoryDetails?.totalMoney.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </span>
            </div>
            <div className="flex justify-between px-4">
              <p className="py-2">Discount</p>
              <span className="flex items-center font-bold text-red-600">
                -
                {discount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </span>
            </div>
            <div className="flex justify-between px-4 mb-3">
              <p className="py-2">Shipping Fee</p>
              <span className="flex items-center font-bold text-red-600">
                Free
              </span>
            </div>
            <hr></hr>
            <div className="flex justify-between px-4 mb-3 mt-2">
              <p className="py-2 font-bold flex items-center text-xl">Total</p>
              <span className="flex items-center text-2xl font-bold text-red-600">
                {orderHistoryDetails?.totalMoney.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                })}
              </span>
            </div>
            <div className="flex justify-between px-4 mb-3 mt-2">
              {orderHistoryDetails && orderHistoryDetails.status === 0 ? (
                <button
                  className="w-full bg-red-600 py-2 text-white uppercase rounded-lg font-bold"
                  onClick={() => setOpenModal({ open: true, type: 'cancel' })}
                >
                  {loading === true ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300 mr-1"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              ) : orderHistoryDetails && orderHistoryDetails.status === 2 ? (
                <button
                  className="w-full bg-gray-400 py-2 text-white uppercase rounded-lg font-bold"
                  hidden
                >
                  Cancel Order
                </button>
              ) : orderHistoryDetails && orderHistoryDetails.status === -1 ? (
                <button
                  className="w-full bg-blue-600 py-2 text-white uppercase rounded-lg font-bold"
                  onClick={() => setOpenModal({ open: true, type: 'reorder' })}
                >
                  {loading === true ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300 mr-1"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Reordering...
                    </>
                  ) : (
                    'ReOrder'
                  )}
                </button>
              ) : (
                <button
                  className="w-full bg-gray-400 py-2 text-white uppercase rounded-lg font-bold"
                  hidden
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Modal
        show={openModal.open}
        size="md"
        onClose={() =>
          setOpenModal((prevState) => ({ ...prevState, open: false }))
        }
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to {openModal.type} ?
            </h3>
            <div className="flex justify-center gap-4 mb-5">
              <Button
                color="failure"
                onClick={() => {
                  if (openModal.type === 'cancel') {
                    cancelOrder();
                  } else if (openModal.type === 'reorder') {
                    reOrder();
                  }
                  setOpenModal({ open: false, type: '' });
                }}
              >
                Yes, I&apos;m sure
              </Button>
              <Button
                color="gray"
                onClick={() => setOpenModal({ open: false, type: '' })}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OrderHistoryDetails;
