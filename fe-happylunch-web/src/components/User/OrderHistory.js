import React, { useEffect, useState } from 'react';
import OrderService from '../../services/OrderService';
import { decodeAccessToken } from '../../utils/jwtDecode';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Breadcrumb } from 'flowbite-react';
import OrderRecent from '../Subcomponents/UserOrderHistoryRecent';
import OrderShowPreviewCell from '../Subcomponents/UserOrderHistoryPreviewCell';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Select } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY - HH:mm:ss';

function OrderHistory() {
  const orderService = new OrderService();
  const [orderHistory, setOrderHistory] = useState([]);
  const decodedToken = decodeAccessToken();
  const customerId = decodedToken ? decodedToken.CustomerId : null;
  const [paging, setPaging] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [showList, setShowList] = useState(true);
  const [selectedItems, setSelectedItems] = useState(0);
  const [recent, setRecent] = useState(true);
  const [orderIdPreview, setOrderIdPreview] = useState('');

  const [startDate, setStartDate] = useState(
    dayjs().startOf('month').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );

  useEffect(() => {
    document.title = 'Order History';
    getOrderHistory(customerId, paging, selectedItems, startDate, endDate);
  }, [paging, startDate, endDate, selectedItems]);

  const getOrderHistory = async (
    customerId,
    paging,
    status,
    startDate,
    endDate
  ) => {
    try {
      const response = await orderService.getViewOrderHistoryCustomer(
        customerId,
        paging,
        status,
        startDate,
        endDate
      );
      if (response.code === 200) {
        setOrderHistory(response.response.data.viewOrderedMealResponseModels);
        setPagination(response.response.data.pagination);
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

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, pagination.currentPage - 1);
    const endPage = Math.min(pagination.totalPage, startPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const convertDateStartStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    );
  };

  const convertDateEndStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
    );
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings[0] == '' || dateStrings[1] == '') {
      setStartDate(
        dayjs()
          .startOf('month')
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
      );
      setEndDate(dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    } else {
      const dateSelectedStart = convertDateStartStrings(dateStrings);
      const dateSelectedEnd = convertDateEndStrings(dateStrings);
      setStartDate(dateSelectedStart[0]);
      setEndDate(dateSelectedEnd[1]);
    }
  };

  const handleRowClick = (orderId) => {
    setRecent(false);
    setOrderIdPreview(orderId);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-[92vh] p-5">
        <div>
          <h2 className="text-xl text-gray-800 font-bold sm:text-3xl dark:text-white text-center pt-5 mb-2">
            Order History
          </h2>
        </div>
        <div className="max-w-screen-2xl mx-auto pt-5 mb-3 ">
          <Breadcrumb
            aria-label="Solid background breadcrumb example"
            className="bg-white px-5 py-3 dark:bg-gray-800 rounded-md"
          >
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to="/orderhistory">OrderHistory</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {recent === true ? (
          <OrderRecent />
        ) : (
          <OrderShowPreviewCell
            orderIdPreview={orderIdPreview}
            setRecent={setRecent}
          />
        )}
        <div className="max-w-screen-2xl mx-auto mb-5 min-h-[50px] bg-white">
          <div className="flex items-center justify-between px-5 py-5 rounded">
            <div className="uppercase">Order History</div>
            {showList === false ? (
              <FaAngleDown
                className="w-8 h-8 p-1.5 cursor-pointer"
                onClick={() => setShowList(true)}
              />
            ) : (
              <FaAngleUp
                className="w-8 h-8 p-1.5 cursor-pointer"
                onClick={() => setShowList(false)}
              />
            )}
          </div>
          {showList === true ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <div className="px-4 mb-3 flex justify-between">
                <div>
                  <button
                    onClick={() => {
                      setSelectedItems(0);
                      setPaging(1);
                    }}
                    className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                      selectedItems === 0 ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    Todo
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItems(2);
                      setPaging(1);
                    }}
                    className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                      selectedItems === 2 ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    Waiting
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItems(3);
                      setPaging(1);
                    }}
                    className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                      selectedItems === 3 ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItems(-1);
                      setPaging(1);
                    }}
                    className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                      selectedItems === -1 ? 'bg-blue-500 text-white' : ''
                    }`}
                  >
                    Cancel
                  </button>
                </div>
                <RangePicker
                  size="medium"
                  defaultValue={[
                    dayjs().startOf('month').startOf('day'),
                    dayjs().endOf('day'),
                  ]}
                  disabled={[false, false]}
                  format={dateFormat}
                  onChange={handleDateRangeChange}
                  showTime
                />
              </div>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      OrderID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      OrderDate
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TotalPrice
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.length === 0 ? (
                    <tr>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <Skeleton width={80} height={20} />
                      </th>
                      <td className="px-6 py-4">
                        <Skeleton width={120} height={20} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={100} height={20} />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Skeleton width={60} height={30} />
                      </td>
                    </tr>
                  ) : (
                    orderHistory.map((order) => (
                      <tr
                        key={order.orderId}
                        className="bg-white border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleRowClick(order.orderId)}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {order.orderId}
                        </th>
                        <td className="px-6 py-4">
                          {parseDateTime(order.orderDate).toLocaleString(
                            'vi-VN'
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.totalMoney.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <NavLink
                            to={`/orderhistory/${order.orderId}`}
                            className="px-5 py-1.5 bg-[#3e70e1] text-[14px] font-semibold text-white rounded-md hover:bg-[#3a57a0]"
                          >
                            Details
                          </NavLink>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <nav
                className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                aria-label="Table navigation"
              >
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                  Showing{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pagination.totalItem === 0
                      ? 0
                      : pagination.pageSize * (pagination.currentPage - 1) + 1}
                  </span>{' '}
                  -{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.min(
                      pagination.pageSize * pagination.currentPage,
                      pagination.totalItem
                    )}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pagination && pagination.totalItem}
                  </span>
                </span>
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                  <li>
                    <a
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                      onClick={() => {
                        pagination.currentPage > 1
                          ? setPaging(pagination.currentPage - 1)
                          : '';
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  {generatePageNumbers().map((pageNumber) => (
                    <li key={pageNumber}>
                      <a
                        onClick={() => setPaging(pageNumber)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer ${
                          pageNumber === pagination.currentPage
                            ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
                      onClick={() => {
                        pagination.currentPage < pagination.totalPage
                          ? setPaging(pagination.currentPage + 1)
                          : '';
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          ) : (
            <></>
          )}
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
export default OrderHistory;
