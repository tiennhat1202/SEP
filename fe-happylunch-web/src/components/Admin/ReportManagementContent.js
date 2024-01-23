import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import ReportService from '../../services/ReportService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
import { FaEye, FaTruckMonster } from 'react-icons/fa';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY - HH:mm:ss';

function ReportManagementContent() {
  document.title = 'Manage Report';

  const [listReport, setListReport] = useState([]);
  const [paging, setPaging] = useState(1);
  const [pagination, setPagination] = useState([]);
  const reportService = new ReportService();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(
    dayjs().startOf('month').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  );

  useEffect(() => {
    getListReport(paging, startDate, endDate);
  }, [paging, startDate, endDate]);

  const getListReport = async () => {
    try {
      const res = await reportService.getListReportAdmin(
        paging,
        startDate,
        endDate
      );
      if (res && res.code === 200) {
        setListReport(res.response.data.getReportResponseModels);
        setPagination(res.response.data.pagination);
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
    const dateSelectedStart = convertDateStartStrings(dateStrings);
    const dateSelectedEnd = convertDateEndStrings(dateStrings);
    setStartDate(dateSelectedStart[0]);
    setEndDate(dateSelectedEnd[1]);
  };

  const handleRedirectDetail = (reportId) => {
    navigate(`${reportId}`);
  };

  return (
    <>
      <h2 className="mb-2 font-bold text-2xl">Report Management</h2>
      <div className="p-4 border-[1px] border-gray-200 border-solid rounded-lg">
        <div className="pb-2 flex items-center justify-between">
          <div className="sm:mr-0 flex items-center">
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
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-auto ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Report ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Report Title
                </th>
                <th scope="col" className="px-6 py-3 flex item items-center">
                  Report Time{' '}
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {listReport &&
                listReport.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.reportId}
                    </th>
                    <td className="px-6 py-4">{item.reportTitle}</td>
                    <td className="px-6 py-4">
                      {parseDateTime(item.createDate).toLocaleString('vi-VN')}
                    </td>

                    <td className="px-6 py-4 flex items-center justify-center">
                      <FaEye
                        className="w-5 h-5 text-orange-500 cursor-pointer"
                        onClick={() => handleRedirectDetail(item.reportId)}
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
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default ReportManagementContent;
