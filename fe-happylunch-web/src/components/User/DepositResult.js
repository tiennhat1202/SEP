import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

function DepositResult() {
  const [data, setData] = useState({
    VnPayResponseCode: 0,
    VnPayMessage: '',
    Money_Amount: 0,
    TransactionId: '',
    PayDate: '',
  });
  const currentUrl = window.location.href;
  const questionMarkIndex = currentUrl.indexOf('=');

  useEffect(() => {
    document.title = 'Deposit Result';
    if (questionMarkIndex !== -1) {
      // Extract the part of the URL after the "?"
      const queryString = currentUrl.substring(questionMarkIndex + 1);
      const response = JSON.parse(decodeURIComponent(queryString));
      setData(response);
    }
  }, [currentUrl]);

  function parseDateTime(dateTimeString) {
    const year = dateTimeString.substr(0, 4);
    const month = dateTimeString.substr(4, 2) - 1;
    const day = dateTimeString.substr(6, 2);
    const hours = dateTimeString.substr(8, 2);
    const minutes = dateTimeString.substr(10, 2);
    const seconds = dateTimeString.substr(12, 2);

    return new Date(year, month, day, hours, minutes, seconds);
  }

  function replaceMessage(message) {
    const output = message.replace(/\+/g, ' ');
    return output;
  }

  function statusFailed(inputString) {
    const parts = inputString.split(':');
    let part1 = parts[0].trim();
    part1 = part1.replace(/\+/g, ' ');
    part1 = part1.replace(/ due to/g, ''); // Xóa từ "due to"

    return part1;
  }

  function reasonFailed(inputString) {
    const parts = inputString.split(':');
    const part2 = parts[1].trim();
    const part2Modified = part2.replace(/\+/g, ' ');

    return part2Modified;
  }
  return (
    <>
      <div className="min-h-[92vh] bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-6 xl:w-[50rem] xl:h-[32rem] md:w-[28rem] md:h-[24rem]  w-[20rem] h-[24rem] md:mx-auto flex items-center justify-center">
          {data.VnPayResponseCode == 0 ? (
            <>
              <div className="text-center">
                <div className="flex justify-center  mb-5 mt-5">
                  <FaRegCheckCircle className="w-10 h-10 text-green-500"></FaRegCheckCircle>
                </div>
                {data.VnPayMessage ? (
                  <>
                    <h3 className="md:text-3xl text-green-500 text-base font-semibold text-center">
                      {replaceMessage(data.VnPayMessage)}
                    </h3>
                    <p className="text-gray-600 my-2">
                      Thank you for completing your secure online payment.
                    </p>
                    <p> Have a great day! </p>
                    <hr className="pt-5 mt-5" />
                    <div className="flex justify-center items-center">
                      <div className="min-w-[300px]">
                        <p className="font-bold">Payment Information</p>
                        <p className="flex justify-between mt-3">
                          Amount Paid:{' '}
                          <span className="font-bold">
                            {data.Money_Amount.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between mt-3">
                          TransactionId:{' '}
                          <span className="font-bold">
                            {data.TransactionId}
                          </span>
                        </p>
                        <p className="flex justify-between mt-3">
                          DateTime:{' '}
                          <span className="font-bold">
                            {parseDateTime(data.PayDate).toLocaleString(
                              'vi-VN'
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 my-2">No data available.</p>
                )}
                <div className="py-10 text-center">
                  <NavLink
                    to="/deposit"
                    className="px-12 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5"
                  >
                    Back To Deposit
                  </NavLink>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="flex justify-center mb-5 mt-5">
                  <FaRegTimesCircle className="w-10 h-10 text-red-500"></FaRegTimesCircle>
                </div>
                <h3 className="md:text-2xl text-red-500 text-base font-semibold text-center">
                  {statusFailed(data.VnPayMessage)}
                </h3>
                <h3 className="md:text-2xl text-red-500 text-base font-semibold text-center mb-3">
                  {reasonFailed(data.VnPayMessage)}
                </h3>
                <p className="text-gray-600 my-2">
                  Thank you for using the online payment service.
                </p>
                <p> Have a great day! </p>
                <hr className="pt-5 mt-5" />
                <div className="flex justify-center items-center">
                  <div className="min-w-[300px]">
                    <p className="font-bold">Payment Information</p>
                    <p className="flex justify-between mt-3">
                      Amount To Be Paid:{' '}
                      <span className="font-bold">
                        {data.Money_Amount.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        })}
                      </span>
                    </p>
                    <p className="flex justify-between mt-3">
                      DateTime:{' '}
                      <span className="font-bold">
                        {parseDateTime(data.PayDate).toLocaleString('vi-VN')}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="py-10 text-center">
                  <NavLink
                    to="/deposit"
                    className="px-12 bg-blue-600 hover-bg-blue-500 rounded-2xl text-white font-semibold py-1.5"
                  >
                    Back To Deposit
                  </NavLink>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default DepositResult;
