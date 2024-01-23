import React, { useEffect, useState, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import MealService from '../../services/MealService';
import PaymentService from '../../services/PaymentService';
import { decodeAccessToken } from '../../utils/jwtDecode';
import { ToastContainer, toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Modal, Spinner } from 'flowbite-react';
import { FaWallet } from 'react-icons/fa';
import UserNavbar from '../../components/User/Navbar';
import { NavLink } from 'react-router-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import { UserContext } from '../../store/UserContext';
import { useNavigate } from 'react-router-dom';

function PaymentOrders() {
  const [cartData, setCartData] = useState([]);
  const mealService = new MealService();
  const paymentService = new PaymentService();
  const decodedToken = decodeAccessToken();
  const customerId = decodedToken ? decodedToken.CustomerId : null;
  const discount = 0;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const [quantityChangeTimeout, setQuantityChangeTimeout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false); // New loading state
  const [cartItems, setCartItems] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [method, setMethod] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Payment';

    if (user.auth) {
      getCartCustomer();

      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://doan.local:7154/meal', {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .build();

      hubConnection.start();

      hubConnection.on('StopServingMeal', async (mealId) => {
        setCartData((cartData) =>
          cartData.filter((item) => item.mealId !== mealId)
        );
        toast.warning('Have 1 product stopped serving yet');
      });

      return () => {
        hubConnection.stop();
      };
    } else {
      if (localStorage.getItem('CartLocalStorage')?.length > 0) {
        setCartData(JSON.parse(localStorage.getItem('CartLocalStorage')));
        setLoading(false);
      }
    }
  }, [user.auth]);

  const getCartCustomer = async () => {
    try {
      const response = await mealService.getListMealCartCustomer(customerId);
      if (response.code === 200) {
        setCartData(response.response.data);
      }
    } catch (error) {
      //Something went wrong
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (mealId) => {
    if (user.auth) {
      try {
        const response = await mealService.removeCartCustomer(
          customerId,
          mealId
        );
        if (response.code === 200) {
          setCartData((prevCartData) =>
            prevCartData.filter((item) => item.mealId !== mealId)
          );
          toast.success('Removed successfully');
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }
    const updatedCartData = cartData.filter((item) => item.mealId !== mealId);
    setCartData(updatedCartData);
    localStorage.setItem('CartLocalStorage', JSON.stringify(updatedCartData));
  };

  const handleSaveQuantityChange = async (mealId, quantity) => {
    if (user.auth) {
      try {
        const response = await mealService.changeQuantityCartCustomer(
          customerId,
          mealId,
          quantity
        );
        if (response.code === 200) {
          setCartData((prevCartData) =>
            prevCartData.map((item) => {
              if (item.mealId === mealId) {
                return { ...item, quantity };
              }
              return item;
            })
          );
        }
      } catch (error) {
        toast.error(error.response.data);
      }
    }
  };

  const handleQuantityChange = (mealId, newQuantity) => {
    const updatedCartData = cartData.map((item) => {
      if (item.mealId === mealId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartData(updatedCartData);
    if (user.auth) {
      let lastActionTimestamp = Date.now();

      if (quantityChangeTimeout) {
        clearTimeout(quantityChangeTimeout);
      }

      const newTimeout = setTimeout(() => {
        const timeSinceLastAction = Date.now() - lastActionTimestamp;
        if (timeSinceLastAction >= 1000) {
          handleSaveQuantityChange(mealId, newQuantity);
        }
      }, 1000);

      lastActionTimestamp = Date.now();
      setQuantityChangeTimeout(newTimeout);
    } else {
      localStorage.setItem('CartLocalStorage', JSON.stringify(updatedCartData));
      setCartItems(true);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    for (const item of cartData) {
      total += item.mealPrice * item.quantity;
    }
    return total;
  };

  const total = calculateTotal();

  const handleDropdownItemClick = (selectedItem) => {
    setPaymentMethod(selectedItem);
  };

  useEffect(() => {
    const performPayment = async () => {
      let tomorrow;
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (currentHour >= 14 && currentHour <= 24) {
        tomorrow = true;
      } else {
        tomorrow = false;
      }

      if (paymentMethod === 'Wallet') {
        setLoadingPayment(true);
        try {
          const response = await paymentService.paymentOrderCustomer(
            customerId,
            total,
            tomorrow
          );
          if (response.code === 200) {
            getCartCustomer();
            toast.success('Payment order successful');
            setCartItems(true);
            setPaymentMethod('');
            setPaymentResponse(response.response.data);
            setShowResult(true);
            setMethod('Wallet');
          }
        } catch (error) {
          toast.error(error.data.response.data);
          setPaymentMethod('');
          setPaymentResponse(null);
          setShowResult(true);
        } finally {
          setLoadingPayment(false);
        }
      }

      if (paymentMethod === 'VnPay') {
        setLoadingPayment(true);
        try {
          const response = await paymentService.paymentOrderByQRCustomer(
            customerId,
            total,
            tomorrow
          );
          if (response && response.code === 200) {
            window.location.href = response.response.data;
          }
        } catch (error) {
          if (error === 'Request failed with status code 404')
            toast.error('Request Payment Not Found');
        } finally {
          setLoadingPayment(false);
        }
      }
    };

    performPayment();
  }, [paymentMethod]);

  //Payment VNPAY
  const currentUrl = window.location.href;
  const questionMarkIndex = currentUrl.indexOf('=');
  useEffect(() => {
    if (questionMarkIndex !== -1) {
      const queryString = currentUrl.substring(questionMarkIndex + 1);
      const response = JSON.parse(decodeURIComponent(queryString));
      setMethod('VnPay');
      setPaymentResponse(response);
      setShowResult(true);
    }
  }, [currentUrl]);

  function parseDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    // Lấy thông tin ngày giờ
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0

    // Tạo chuỗi định dạng mới
    const formattedDateTime = `${hours}:${minutes}:${seconds} - ${day}/${month}/${dateTime.getFullYear()}`;

    return formattedDateTime;
  }
  console.log('paymentRespone: ', paymentResponse);
  return (
    <div>
      <div className="relative">
        {loadingPayment && (
          <>
            <div className="absolute top-16 left-0 w-full h-[93vh] bg-gray-900 bg-opacity-50"></div>
            <Spinner className="absolute top-1/2 left-1/2 text-white w-10 h-10"></Spinner>
          </>
        )}
        <UserNavbar cartItems={cartItems} />
        <div className="min-h-[93vh] h-fit bg-gray-100 pt-10">
          {showResult === false ? (
            <>
              <h1 className="mb-10 text-center text-2xl font-bold">
                Cart Items
              </h1>
              <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                {loading ? (
                  <>
                    <div className="rounded-lg md:w-2/3">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                        >
                          <Skeleton width={90} height={90} />{' '}
                          <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                            <div className="mt-5 sm:mt-0">
                              <h2 className="text-lg font-bold text-gray-900">
                                <Skeleton width={200} height={20} />
                              </h2>
                              <p className="mt-1 text-xs text-gray-700">
                                <Skeleton width={200} height={20} />
                              </p>
                              <p className="mt-1 text-xs text-gray-700">
                                <Skeleton width={200} height={20} />
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                      <div className="mb-2 flex justify-between">
                        <p className="text-gray-700">
                          <Skeleton width={60} height={12} />
                        </p>
                        <p className="text-gray-700">
                          <Skeleton width={60} height={12} />
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-gray-700">
                          <Skeleton width={60} height={12} />
                        </p>
                        <p className="text-gray-700">
                          <Skeleton width={60} height={12} />
                        </p>
                      </div>
                      <hr className="my-4" />
                      <div className="flex justify-between">
                        <p className="text-lg font-bold">
                          <Skeleton width={60} height={12} />
                        </p>
                        <div className="">
                          <p className="mb-1 text-lg font-bold">
                            <Skeleton width={60} height={12} />
                          </p>
                        </div>
                      </div>
                      <Skeleton width={290} height={30} />
                    </div>
                  </>
                ) : cartData.length > 0 ? (
                  <div className="rounded-lg md:w-2/3">
                    {cartData.map((item) => (
                      <div
                        key={item.mealId}
                        className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                      >
                        <img
                          src={item.image}
                          alt="product-image"
                          className="h-24 rounded-lg sm:w-24 sx:w-24 w-24 object-cover"
                        />
                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                          <div className="mt-5 sm:mt-0">
                            <h2 className="text-lg font-bold text-gray-900">
                              {item.mealName}
                            </h2>
                            <p className="mt-1 text-base">
                              {item.mealPrice.toLocaleString('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              })}
                            </p>
                            <div className="flex items-center border-gray-100 mt-2">
                              {item.quantity > 1 ? (
                                <span
                                  className="cursor-pointer rounded-l bg-gray-200 py-1 px-3.5 duration-100 hover:bg-gray-300"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.mealId,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  {' '}
                                  -{' '}
                                </span>
                              ) : (
                                <span className="cursor-not-allowed text-gray-400 py-1 px-3.5 rounded-l bg-gray-100">
                                  {' '}
                                  -{' '}
                                </span>
                              )}
                              <input
                                className="h-8 w-12 pr-0 text-gray-400 border mr-[1px] bg-white text-center text-xs outline-none focus:outline-none focus:ring-outline-none focus:ring-transparent focus:border-[#6b7280]"
                                type="number"
                                value={item.quantity}
                                readOnly={true}
                                min={1}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.mealId,
                                    e.target.value
                                  )
                                }
                              />
                              <span
                                className="cursor-pointer rounded-r bg-gray-200 py-1 px-3 duration-100 hover-bg-blue-500 hover-text-blue-50 hover:bg-gray-300"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.mealId,
                                    item.quantity + 1
                                  )
                                }
                              >
                                {' '}
                                +{' '}
                              </span>
                            </div>
                          </div>
                          <div>
                            <svg
                              width="25px"
                              height="25px"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => removeProduct(item.mealId)}
                              cursor="pointer"
                              className="ml-auto"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <g id="SVGRepo_iconCarrier">
                                {' '}
                                <path
                                  d="M10 11V17"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{' '}
                                <path
                                  d="M14 11V17"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{' '}
                                <path
                                  d="M4 7H20"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{' '}
                                <path
                                  d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{' '}
                                <path
                                  d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                                  stroke="#ff0000"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{' '}
                              </g>
                            </svg>
                            <div className="mt-4 flex-auto text-right sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                              <p className="mt-[43px] text-lg font-bold align-bottom">
                                {(
                                  item.mealPrice * item.quantity
                                ).toLocaleString('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg md:w-2/3">
                    <p className="text-center">No products in the cart.</p>
                  </div>
                )}
                {cartData.length > 0 && (
                  <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                    <div className="py-2 flex justify-between">
                      <p className="text-[14px]">Provisional Amount</p>
                      <p className="font-bold text-[14px]">
                        {total.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </p>
                    </div>
                    <div className="py-2 flex justify-between">
                      <p className="text-gray-700 text-[14px]">Discount</p>
                      <p className="text-red-500 font-bold text-[14px]">
                        {'-'}
                        {discount.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </p>
                    </div>
                    <div className="py-2 flex justify-between">
                      <p className="text-gray-700 text-[14px]">Shipping Fee</p>
                      <p className="text-red-500 font-bold text-[14px]">Free</p>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                      <p className="text-lg font-bold">Total</p>
                      <div className="">
                        <p className="mb-1 text-lg font-bold">
                          {total.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </p>
                      </div>
                    </div>
                    {user.auth ? (
                      <button
                        className="mt-6 w-full rounded-3xl bg-blue-500 py-1.5 font-medium text-blue-50 hover-bg-blue-600 flex justify-center items-center"
                        onClick={() => setOpenModal(true)}
                      >
                        Payment
                      </button>
                    ) : (
                      <button
                        className="mt-6 w-full rounded-3xl bg-blue-500 py-1.5 font-medium text-blue-50 hover-bg-blue-600 flex justify-center items-center"
                        onClick={() => {
                          navigate('/login');
                          sessionStorage.setItem('pathCart', true);
                        }}
                      >
                        Login
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="min-h-[70vh] flex items-center">
              <div className="bg-white p-6 xl:w-[50rem] xl:h-[32rem] md:w-[28rem] md:h-[24rem]  w-[20rem] h-[24rem] md:mx-auto rounded-xl flex items-center justify-center">
                {paymentResponse != null ? (
                  <>
                    <div className="text-center">
                      <div className="flex justify-center mb-5">
                        <FaRegCheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <>
                        <h3 className="md:text-2xl text-green-500 text-base font-semibold text-center">
                          Payment Order Successfully
                        </h3>
                        <p className="text-gray-600 my-2">
                          Thank you for completing your secure online payment.
                        </p>
                        <hr className="pt-5 mt-5" />
                        <div className="flex justify-center items-center">
                          <div className="min-w-[300px]">
                            <p className="font-bold">Payment Information</p>
                            <p className="flex justify-between mt-3">
                              Order Index:{' '}
                              <span className="font-bold">
                                {paymentResponse && paymentResponse.orderIndex}
                              </span>
                            </p>
                            <p className="flex justify-between mt-3">
                              Amount Paid:{' '}
                              <span className="font-bold">
                                {paymentResponse.totalMoney &&
                                  paymentResponse.totalMoney.toLocaleString(
                                    'vi-VN',
                                    {
                                      style: 'currency',
                                      currency: 'VND',
                                    }
                                  )}
                              </span>
                            </p>
                            <p className="flex justify-between mt-3">
                              Payment Method:{' '}
                              <span className="font-bold">
                                {method == 'Wallet' ? 'Wallet' : 'VnPay'}
                              </span>
                            </p>
                            <p className="flex justify-between mt-3">
                              DateTime:{' '}
                              <span className="font-bold">
                                {paymentResponse.orderDate &&
                                  parseDateTime(
                                    paymentResponse.orderDate
                                  ).toLocaleString('vi-VN')}
                              </span>
                            </p>
                          </div>
                        </div>
                      </>
                      <div className="py-10 text-center">
                        <NavLink
                          to="/"
                          className="px-8 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5"
                        >
                          Continue buy
                        </NavLink>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-center">
                      <div className="flex justify-center mb-5">
                        <FaRegTimesCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <>
                        <h3 className="md:text-2xl text-red-500 text-base font-semibold text-center">
                          Payment Order Failed
                        </h3>
                        <p className="text-gray-600 my-2">
                          Sorry you were unable to complete payment
                        </p>
                      </>
                      <div className="py-10 text-center">
                        <NavLink
                          to="/payment"
                          className="px-8 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5"
                          onClick={() => setShowResult(false)}
                        >
                          Try Again
                        </NavLink>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Modal
          dismissible
          show={openModal}
          onClose={() => {
            setOpenModal(false);
            setPaymentMethod('');
          }}
        >
          <Modal.Header>Payment Method</Modal.Header>
          <Modal.Body>
            <div className="flex w-full items-center">
              <div className="w-1/2 mx-5">
                <div
                  className="border-black border-[1px] hover:cursor-pointer rounded-md hover:border-red-500 hover:border-[1px]"
                  onClick={() => {
                    handleDropdownItemClick('Wallet');
                    setOpenModal(false);
                  }}
                >
                  <div className="flex justify-center pt-5">
                    <FaWallet className="w-6 h-6 m-[4px] text-blue-400"></FaWallet>
                  </div>
                  <div className="flex justify-center font-semibold text-black pb-5 ">
                    Wallet
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div
                  className="border-black border-[1px] hover:cursor-pointer rounded-md hover:border-red-500 hover:border-[1px]"
                  onClick={() => {
                    handleDropdownItemClick('VnPay');
                    setOpenModal(false);
                  }}
                >
                  <div className="flex justify-center items-start pt-5">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g fill="none" stroke="#ee232b" strokeLinejoin="round">
                        <path d="m28.6222 37.7222 14.4444-14.4444c.5778-.5778.5778-1.7333 0-2.3111l-8.6667-8.6667c-.5778-.5778-1.7333-.5778-2.3111 0l-6.3556 6.3556-9.2444-9.2444c-.5778-.5778-1.7333-.5778-2.3111 0l-9.2444 9.2444c-.5778.5778-.5778 1.7333 0 2.3111l16.7556 16.7556c1.7333 1.7333 5.2 1.7333 6.9333 0z" />
                        <g strokeLinecap="round">
                          <path d="m25.7333 18.6556-8.0889 8.0889c-2.3111 2.3111-4.6222 2.3111-6.9333 0" />
                          <path d="m18.2222 30.7889c-1.1556 1.1556-2.3111 1.1556-3.4667 0m22.5333-15.6c-1.262-1.1556-2.8889-.5778-4.0444.5778l-15.0222 15.0222" />
                          <path d="m18.2222 15.7667c-4.6222-4.6222-10.4 1.1556-5.7778 5.7778l5.2 5.2-5.2-5.2" />
                          <path d="m23.4222 20.9667-4.0444-4.0444" />
                          <path d="m21.6889 22.7-4.6222-4.6222c-.5778-.5778-1.4444-1.4444-2.3111-1.1556" />
                          <path d="m14.7556 20.3889c-.5778-.5778-1.4444-1.4444-1.1556-2.3111m5.7778 6.9333-4.6222-4.6222" />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="flex justify-center font-semibold text-black pb-5">
                    VNPay
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <ToastContainer />
      </div>
    </div>
  );
}

export default PaymentOrders;
