import React, { useState, useEffect } from 'react';
import {
  PiCallBellBold,
  PiClipboardTextBold,
  PiCheckBold,
  PiXBold,
  PiChatTeardropTextBold,
} from 'react-icons/pi';
import OrderService from '../../services/OrderService';
import { decodeAccessToken } from '../../utils/jwtDecode';
import { NavLink } from 'react-router-dom';

function OrderRecent() {
  const orderService = new OrderService();
  const decodedToken = decodeAccessToken();
  const customerId = decodedToken ? decodedToken.CustomerId : null;
  const [dataOrderRecent, setDataOrderRecent] = useState([]);

  useEffect(() => {
    getLastOrderCustomer();
  }, []);

  const getLastOrderCustomer = async () => {
    try {
      const res = await orderService.getLastOrderCustomer(customerId);
      if (res && res.code === 200) {
        setDataOrderRecent(res.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto mb-5 min-h-[300px] bg-white">
      <div className="flex items-center justify-between px-5 py-5 rounded">
        <div>RECENT ORDER</div>
        <div className="flex items-center">
          <p>
            {' '}
            ORDER INDEX:{' '}
            <span className="uppercase text-blue-500">
              {dataOrderRecent.orderIndex
                ? dataOrderRecent.orderIndex
                : 'Unknow'}
            </span>
          </p>
          <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
          <p>
            {' '}
            ORDER ID:{' '}
            <span className="uppercase text-blue-500">
              {dataOrderRecent.orderId}
            </span>
          </p>
          <span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
          <p>
            {dataOrderRecent.status == 0 ? (
              <span className="text-[#b57bff] uppercase">Todo</span>
            ) : dataOrderRecent.status == 2 ? (
              <span className="text-[#FFB302] uppercase">Waiting</span>
            ) : dataOrderRecent.status == 3 ? (
              <span className="text-[#31c48d] uppercase">Completed</span>
            ) : (
              <span className="text-[#FF3838] uppercase">Cancelled</span>
            )}
          </p>
        </div>
      </div>
      <hr />
      <div className="min-h-[100px] p-8">
        <div className="flex items-center justify-center pt-10 pb-16  rounded ">
          <div
            className={`w-14 h-14 border-[4px] rounded-full ${
              dataOrderRecent.status === -1
                ? 'border-red-400'
                : 'border-green-400'
            } flex justify-center items-center`}
          >
            {dataOrderRecent.status === -1 ? (
              <PiXBold className="w-8 h-8 text-red-400 relative" />
            ) : (
              <PiClipboardTextBold className="w-8 h-8 text-green-400 relative" />
            )}
            <div className="absolute w-36 h-32">
              <div className="font-medium absolute bottom-0 w-36 flex justify-center">
                {dataOrderRecent.status === -1
                  ? 'OrderCancel'
                  : 'Order Success'}
              </div>
            </div>
          </div>
          <div className="w-[26%] bg-gray-200 rounded-full h-1  dark:bg-gray-700">
            <div
              className={` ${
                dataOrderRecent.status === 0
                  ? 'w-[99%] bg-green-400 h-1 rounded-full dark:bg-green-400'
                  : dataOrderRecent.status === -1
                  ? 'w-[0%] bg-red-400 h-1 rounded-full dark:bg-red-400'
                  : 'w-[100%] bg-green-400 h-1 rounded-full dark:bg-green-400'
              }`}
            />
          </div>

          <div
            className={`w-14 h-14 border-[4px] rounded-full ${
              dataOrderRecent.status === 2
                ? 'border-green-400'
                : dataOrderRecent.status === 3
                ? 'border-green-400'
                : dataOrderRecent.status === -1
                ? 'border-red-400'
                : dataOrderRecent.isFeedback
                ? 'border-green-400'
                : 'border-gray-200'
            } flex justify-center items-center`}
          >
            <PiCallBellBold
              className={`w-8 h-8 ${
                dataOrderRecent.status === 2
                  ? 'text-green-400'
                  : dataOrderRecent.status === 3
                  ? 'text-green-400'
                  : dataOrderRecent.status === -1
                  ? 'text-red-400'
                  : dataOrderRecent.isFeedback
                  ? 'text-green-400'
                  : 'text-gray-200'
              }`}
            />
            <div className="absolute w-36 h-32">
              <div className="font-medium absolute bottom-0 w-36 flex justify-center">
                Meals Ready
              </div>
            </div>
          </div>

          <div className="w-[26%] bg-gray-200 rounded-full h-1  dark:bg-gray-700">
            <div
              className={` ${
                dataOrderRecent.status === 0
                  ? 'w-[0%] bg-green-400 h-1 rounded-full dark:bg-green-400'
                  : dataOrderRecent.status === -1
                  ? 'w-[0%] bg-red-400 h-1 rounded-full dark:bg-red-400'
                  : 'w-[100%] bg-green-400 h-1 rounded-full dark:bg-green-400'
              }`}
            />
          </div>

          <div
            className={`w-14 h-14 border-[4px] rounded-full ${
              dataOrderRecent.status === 3
                ? 'border-green-400'
                : dataOrderRecent.status === -1
                ? 'border-red-400'
                : dataOrderRecent.isFeedback
                ? 'border-green-400'
                : 'border-gray-200'
            } flex justify-center items-center`}
          >
            <PiCheckBold
              className={`w-8 h-8 ${
                dataOrderRecent.status === 3
                  ? 'text-green-400'
                  : dataOrderRecent.status === -1
                  ? 'text-red-400'
                  : dataOrderRecent.isFeedback
                  ? 'text-green-400'
                  : 'text-gray-200'
              }`}
            />
            <div className="absolute w-36 h-32">
              <div className="font-medium absolute bottom-0 w-36 flex justify-center">
                Completed
              </div>
            </div>
          </div>

          <div className="w-[26%] bg-gray-200 rounded-full h-1 dark:bg-gray-700">
            <div
              className={` ${
                dataOrderRecent.status === 3
                  ? 'w-[100%] bg-green-400 h-1 rounded-full dark:bg-green-400'
                  : dataOrderRecent.status === -1
                  ? 'w-[0%] bg-red-400 h-1 rounded-full dark:bg-red-400'
                  : 'w-[0%]'
              }`}
            />
          </div>
          <div
            className={`w-14 h-14 border-[4px] rounded-full ${
              dataOrderRecent.isFeedbacked
                ? 'border-green-400'
                : dataOrderRecent.status === -1
                ? 'border-red-400'
                : 'border-gray-200'
            } flex justify-center items-center`}
          >
            <PiChatTeardropTextBold
              className={`w-8 h-8 ${
                dataOrderRecent.isFeedbacked
                  ? 'text-green-400'
                  : dataOrderRecent.status === -1
                  ? 'text-red-400'
                  : 'text-gray-200'
              }`}
            />
            <div className="absolute w-36 h-32">
              <div className="font-medium absolute bottom-0 w-36 flex justify-center">
                Feedback
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between px-14 py-6 bg-orange-50 items-center">
        <p className="text-[13px] text-red-600 italic underline">
          You can cancel your order before 9:30 AM every day!
        </p>
        <NavLink
          to={`/orderhistory/${dataOrderRecent.orderId}`}
          className="px-5 py-1.5 bg-[#3e70e1] text-[14px] font-semibold text-white rounded-md hover:bg-[#3a57a0]"
        >
          Order Detail
        </NavLink>
      </div>
    </div>
  );
}

export default OrderRecent;
