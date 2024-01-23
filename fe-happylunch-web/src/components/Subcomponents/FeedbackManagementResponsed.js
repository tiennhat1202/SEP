import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import FeedbackService from '../../services/FeedbackService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY - HH:mm:ss';

function FeedbackResponsed() {
  const feedbackService = new FeedbackService();
  const [listFeedback, setListFeedback] = useState([]);
  const [paging, setPaging] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [startDate, setStartDate] = useState(
    dayjs().startOf('month').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [searchName, setSearchName] = useState(null);

  useEffect(() => {
    getListFeedback(paging, startDate, endDate, searchName);
  }, [paging, searchName, startDate, endDate]);

  const getListFeedback = async () => {
    try {
      const response = await feedbackService.getListFeedbackCanteenManager(
        paging,
        startDate,
        endDate,
        searchName,
        true
      );
      if (response && response.code === 200) {
        setListFeedback(response.response.data.viewListFeedbackResponses);
        setPagination(response.response.data.pagination);
      }
    } catch (error) {
      console.error(error);
    }
  };
  console.log('Load', startDate, endDate);
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

  return (
    <>
      <div className="p-4 border-[1px] border-gray-200 border-solid rounded-lg">
        <div className="flex items-center justify-between mb-2">
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
            allowClear
          />
          <input
            className="ps-3 pe-4 border-[1px] rounded-[8px] text-[13px] py-1 full focus:outline-1 focus:outline-offset-0 focus:outline-blue-500 "
            placeholder="Customer Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          ></input>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Customer</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">Order Id</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="text-center">Feedback Date</div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="text-center">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {listFeedback &&
                listFeedback.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 text-black">
                      {item.customerName}
                    </td>
                    <td className="px-6 py-4 text-black uppercase">
                      {item.orderId}
                    </td>
                    <td className="px-6 py-4 text-black uppercase text-center">
                      {' '}
                      {parseDateTime(item.feedbackDate).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-center place-content-center gap-2 flex">
                      <NavLink
                        to={`/admin/feedback/${item.orderId}`}
                        className=" text-sm px-6 py-1.5 text-center text-blue-700 hover:text-white border border-blue-600 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg  dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                      >
                        Details
                      </NavLink>
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
      </div>
    </>
  );
}

export default FeedbackResponsed;
