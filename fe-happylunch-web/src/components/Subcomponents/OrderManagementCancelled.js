import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
import { Button, Modal } from 'flowbite-react';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY - HH:mm:ss';
import OrderService from '../../services/OrderService';

function OrderCancelled() {
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const [paging, setPaging] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [startDate, setStartDate] = useState(
    dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );

  const orderService = new OrderService();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getOrderListFromAPI(selectedStatus, startDate, endDate, paging);
  }, [selectedStatus, paging, startDate, endDate]);

  const getOrderListFromAPI = async (
    selectedStatus,
    startDate,
    endDate,
    paging
  ) => {
    try {
      const response = await orderService.managerOrderCanteenManager(
        selectedStatus,
        startDate,
        endDate,
        paging
      );
      if (response.code === 200) {
        setOrders(response.response.data.viewProcessingResponseModels);
        setPagination(response.response.data.pagination);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getOrderDetail = async (orderId) => {
    try {
      const response = await orderService.getOrderDetailCanteenManager(orderId);
      if (response.code === 200) {
        setOrderDetail(response.response.data);
        setSelectedStatus(response.response.data.status);
      } else {
        console.log('Order request failed:', response.response.data);
      }
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <>
      <div className="pb-3 mt-2 flex justify-between">
        <RangePicker
          size="medium"
          defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]}
          disabled={[false, false]}
          format={dateFormat}
          onChange={handleDateRangeChange}
          showTime
        />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 flex item items-center">
                Order Time
              </th>
              <th scope="col" className="px-6 py-3">
                Money
              </th>

              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.orderId}
                  </th>
                  <td className="px-6 py-4">
                    {parseDateTime(item.orderDate).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    {item.totalMoney.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    <FaEye
                      className="w-5 h-5 text-orange-500 cursor-pointer"
                      onClick={() => {
                        getOrderDetail(item.orderId);
                        setOpenModal(true);
                      }}
                    ></FaEye>
                  </td>
                </tr>
              ))}
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
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white uppercase">
            Order Detail
          </h3>
          <p className="uppercase font-semi text-sm pt-2">
            OrderID:{' '}
            <span className="text-blue-600">{orderDetail?.orderId}</span>
          </p>
        </Modal.Header>
        <Modal.Body className="py-0 px-0">
          <div className="px-0 pt-0 border-b-0 space-y-6">
            <table className="w-full text-sm text-left text-gray-500 dark-text-gray-400 mx-auto">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark-bg-gray-700 dark-text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Meal Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity
                  </th>
                </tr>
              </thead>
              {orderDetail?.listMealOrder.map((item, index) => (
                <>
                  <tbody>
                    <tr
                      key={index}
                      className="bg-white border-b dark-bg-gray-900 dark-border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark-text-white"
                      >
                        {item.mealName}
                      </th>
                      <td className="px-6 py-4">{item.quantity}</td>
                    </tr>
                  </tbody>
                </>
              ))}
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end py-3">
          <Button
            className="bg-red-500 text-white font-semibold hover:bg-red-600 enabled:hover:bg-red-600 focus:ring-red-600  rounded-lg focus:ring-2"
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderCancelled;
