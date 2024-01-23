import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReportService from '../../services/ReportService';

function ReportDetailContent() {
  document.title = 'Report Detail'

  const [data, setData] = useState([]);
  const reportService = new ReportService();
  const { reportId } = useParams();

  useEffect(() => {
    getReportDetail(reportId);
  }, []);

  const getReportDetail = async (reportId) => {
    try {
      const response = await reportService.getReportDetailAdmin(reportId);
      if (response && response.code == 200) {
        setData(response.response.data);
      }
    } catch (error) {
      console.error(error);
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
  return (
    <>
      <h2 className="mb-2 font-bold text-2xl">Report Detail</h2>
      <div className=" rounded-lg min-h-[70vh]">
        <div className="relative overflow-x-auto sm:rounded-lg min-h-[70vh]">
          <div className="mb-2 static">
            <div className="xl:flex max-w-screen-3xl xl:mx-auto md:mx-8 mx-3 sm:block md:block">
              <div className="xl:w-full md:w-full sm:w-full">
                <div>
                  <div className="bg-gray-100 border-solid border-2 py-2 px-5 rounded-lg">
                    <div>
                      <div>
                        <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800">
                          Report ID:{' '}
                          <span className="text-blue-600 uppercase">
                            {' '}
                            {data.reportId}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <div>
                        <p className="text-base dark:text-white lg:text-md font-semibold leading-7 lg:leading-9 text-gray-800">
                          Report Date: {parseDateTime(data.createDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full text-sm text-gray-500 dark:text-gray-400 mx-auto mt-3">
                  <div
                    className="py-2 "
                    style={{ border: '2px solid #e5e7eb ' }}
                  >
                    <div className="flex">
                      <p className="text-black px-6 pt-2 pb-4 font-bold">
                        Report Title:{' '}
                      </p>
                      <p className="text-black pt-2 pb-4 ">
                        {data.reportTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-black px-6 font-bold">
                        {' '}
                        Report Content:
                      </p>
                      <div className="min-h-36 p-6">
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
                                  ${data.reportContent}
                                `,
                              }}
                            ></div>
                          </div>
                        )}
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
export default ReportDetailContent;
