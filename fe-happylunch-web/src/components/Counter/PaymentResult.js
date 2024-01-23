import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CounterNav from '../Counter/Navbar';
import { NavLink } from 'react-router-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';
import OrderService from '../../services/OrderService';
import { useReactToPrint } from 'react-to-print';

const PaymentResult = () => {
  const location = useLocation();
  const [paymentResponse, setPaymentResponse] = useState(
    location.state?.data || {}
  );
  const orderService = new OrderService();
  const componentPrint = useRef();

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

  const removeCartItems = () => {
    localStorage.removeItem('cartItems');
  };
  // Payment VNPAY
  const currentUrl = window.location.href;
  const questionMarkIndex = currentUrl.indexOf('=');
  useEffect(() => {
    const saveOrder = async () => {
      if (questionMarkIndex !== -1) {
        const queryString = currentUrl.substring(questionMarkIndex + 1);
        const response = JSON.parse(decodeURIComponent(queryString));
        const status = response.substring(0, 2);

        if (status === '00') {
          const storedDataCartVNPAY = localStorage.getItem('dataCartVNPAY');
          try {
            if (storedDataCartVNPAY) {
              const dataVNPAY = JSON.parse(storedDataCartVNPAY);
              const res = await orderService.counterSaveOrder(dataVNPAY);
              localStorage.removeItem('dataCartVNPAY');
              if (res && res.code === 200) {
                setPaymentResponse(res.response.data);
              }
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setPaymentResponse(null);
        }
      }
    };

    saveOrder();
  }, [currentUrl]);

  const handlePrintBill = useReactToPrint({
    content: () => componentPrint.current,
    documentTitle: 'Print Bill',
  });

  return (
    <div>
      <CounterNav></CounterNav>
      <div className="flex items-center bg-gray-100 min-h-[93vh] relative">
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
                            paymentResponse.totalMoney.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
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
                    to="/counter_staff/orderlistmeal"
                    className="px-8 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5 min-w-[165px]"
                    onClick={removeCartItems}
                  >
                    Continue buy
                  </NavLink>
                  <button
                    className="px-8 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1 min-w-[165px] ml-5"
                    onClick={handlePrintBill}
                  >
                    Print Invoice
                  </button>
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
                    to="/counter_staff/orderlistmeal"
                    className="px-8 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5"
                  >
                    Try Again
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {paymentResponse !== null && (
        <div
          ref={componentPrint}
          className="w-full flex justify-center absolute top-20 left-0 right-0 z-[-10]"
        >
          <div className="max-w-[300px] text-center">
            <div className="text-[36px] font-bold">HAPPY LUNCH</div>
            <div className="text-[15px]">
              Khu Công Nghệ Cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Hoà,
              Thạch Thất, Hà Nội
            </div>
            <div className="text-[24px] font-bold">Invoice</div>
            <div className="text-[28px] font-bold">
              {paymentResponse.orderIndex}
            </div>
            <div className="mb-1">
              Payment Date:{' '}
              {paymentResponse.orderDate &&
                parseDateTime(paymentResponse.orderDate).toLocaleString(
                  'vi-VN'
                )}{' '}
            </div>
            <div className="text-center">
              <table className="min-w-[300px] table-fixed">
                <thead>
                  <tr>
                    <th>MealName</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <hr className="max-w-[300px]"></hr>
                <tbody>
                  {paymentResponse.listMealOrder?.map((item, index) => (
                    <tr key={index} className="mb-1">
                      <td>{item.mealName}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr className="max-w-[300px]"></hr>
            <div className="max-w-[300px]">
              <div className="flex justify-between px-8">
                <div className="font-bold mb-1">Total: </div>
                <div>
                  {paymentResponse.totalMoney &&
                    paymentResponse.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                </div>
              </div>
              <div className="flex justify-between px-8">
                <div className="font-bold mb-1">Payment: </div>
                <div>
                  {paymentResponse.totalMoney &&
                    paymentResponse.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
