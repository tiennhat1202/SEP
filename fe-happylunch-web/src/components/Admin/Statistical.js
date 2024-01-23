import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import StatisticalService from '../../services/StatisticalService';

const Statistical = () => {
  const statisticalService = new StatisticalService();
  const [totalMoneySumThisMonth, setTotalMoneySumThisMonth] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [firstDayOfFD, setFirstDayOfFD] = useState(null);
  const [endDayOfFD, setEndDayOfFD] = useState(null);
  const [prevFD, setPrevFD] = useState(null);
  const [prevED, setPrevED] = useState(null);
  const [totalMoneyByDayCash, setTotalMoneyByDayCash] = useState(0);
  /* const [totalMoneyByMonthCash, setTotalMoneyByMonthCash] = useState(0); */
  const [totalMoneyByDayWallet, setTotalMoneyByDayWallet] = useState(0);
  /* const [totalMoneyByMonthWallet, setTotalMoneyByMonthWallet] = useState(0); */
  const [totalMoneyByDayVnPay, setTotalMoneyByDayVnPay] = useState(0);
  const [totalMoneyByDay, setTotalMoneyByDay] = useState(0);
  const [totalMoneyPrevByDay, setTotalMoneyPrevByDay] = useState(0);
  const [profitMoneyByDay, setProfitMoneyByDay] = useState(0);
  useEffect(() => {
    const today = dayjs();
    const firstDayOfFirstDay = today.startOf('day');
    const endDayOfFirstDay = today.subtract(0, 'day').endOf('day');
    const previousFDay = today.subtract(1, 'day').startOf('day');
    const previousEDay = today.subtract(1, 'day').endOf('day');
    setFirstDayOfFD(firstDayOfFirstDay.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    setEndDayOfFD(endDayOfFirstDay.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    setPrevFD(previousFDay.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    setPrevED(previousEDay.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
    setIsReady(true);
  }, []);
  console.log('firstDayOfFD: ', firstDayOfFD);
  console.log('endDayOfFD: ', endDayOfFD);

  useEffect(() => {
    if (isReady) {
      getTotalMoneyByDay(true, firstDayOfFD, endDayOfFD);
      getTotalMoneyPrevByDay(true, prevFD, prevED);
      getTotalMoneyByDayPaymentCash(firstDayOfFD, endDayOfFD, 1, true);
      /* getTotalMoneyByMonthPaymentCash(firstDayOfFD, endDayOfFD, 1, false); */
      getTotalMoneyByDayPaymentWallet(firstDayOfFD, endDayOfFD, 2, true);
      /* getTotalMoneyByMonthPaymentWallet(firstDayOfFD, endDayOfFD, 2, false); */
      getTotalMoneyByDayPaymentVnPay(firstDayOfFD, endDayOfFD, 3, true);
    }
  }, [isReady, firstDayOfFD, endDayOfFD, prevFD, prevED]);

  const getTotalMoneyByDay = async (byDay, startTime, endTime) => {
    try {
      const response = await statisticalService.statisticalOrderTotalMoney(
        byDay,
        startTime,
        endTime
      );
      if (response && response.code === 200) {
        response.response.data.map((item) => {
          setTotalMoneyByDay(item.totalMoney);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getTotalMoneyPrevByDay = async (byDay, startTime, endTime) => {
    try {
      const response = await statisticalService.statisticalOrderTotalMoney(
        byDay,
        startTime,
        endTime
      );
      if (response && response.code === 200) {
        response.response.data.map((item) => {
          setTotalMoneyPrevByDay(item.totalMoney);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  /* const getTotalMoneyThisMonth = async (byDay, startTime, endTime) => {
    try {
      const response = await statisticalService.statisticalOrderTotalMoney(
        byDay,
        startTime,
        endTime
      );
      if (response && response.code === 200) {
        const totalMoneyArray = response.response.data.map(
          (item) => item.totalMoney
        );
        // Tính tổng của mảng totalMoneyArray
        setTotalMoneySumThisMonth(
          totalMoneyArray.reduce((sum, value) => sum + value, 0)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }; */
  const getTotalMoneyByDayPaymentCash = async (
    startTime,
    endTime,
    paymentMethod,
    byDay
  ) => {
    try {
      const response =
        await statisticalService.statisticOrderTotalMoneyByMethodPayment(
          startTime,
          endTime,
          paymentMethod,
          byDay
        );
      if (response.code === 200) {
        response.response.data.map((item) => {
          setTotalMoneyByDayCash(item.totalMoney);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getTotalMoneyByDayPaymentWallet = async (
    startTime,
    endTime,
    paymentMethod,
    byDay
  ) => {
    try {
      const response =
        await statisticalService.statisticOrderTotalMoneyByMethodPayment(
          startTime,
          endTime,
          paymentMethod,
          byDay
        );
      if (response.code === 200) {
        response.response.data.map((item) => {
          setTotalMoneyByDayWallet(item.totalMoney);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getTotalMoneyByDayPaymentVnPay = async (
    startTime,
    endTime,
    paymentMethod,
    byDay
  ) => {
    try {
      const response =
        await statisticalService.statisticOrderTotalMoneyByMethodPayment(
          startTime,
          endTime,
          paymentMethod,
          byDay
        );
      if (response.code === 200) {
        response.response.data.map((item) => {
          setTotalMoneyByDayVnPay(item.totalMoney);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const percentageProfit =
      ((totalMoneyByDay - totalMoneyPrevByDay) / totalMoneyPrevByDay) * 100;
    setProfitMoneyByDay(percentageProfit);
  }, [totalMoneyByDay, totalMoneyPrevByDay]);
  return (
    <>
      <div className='xl:grid lg:grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 lg:grid-col-2 2xl:gap-7.5'>
        {/* Total Order */}
        <div className='relative border border-1 flex flex-col min-w-0 mb-6 break-words  bg-white shadow-lg rounded-2xl bg-clip-border'>
          <div className='flex-auto p-4'>
            <div className='flex flex-wrap -mx-3 justify-around'>
              <div className='w-2/3 max-w-full '>
                <div className='ml-2'>
                  <p className='mb-0 font-sans font-semibold leading-normal text-sm'>
                    Today&apos;s Money
                  </p>
                  <div className='flex'>
                    <h5 className='mb-0 font-bold'>
                      {totalMoneyByDay.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                    </h5>
                    <div className='leading-normal text-sm font-weight-bolder text-lime-500'>
                      <div className='flex'>
                        <span>
                          {profitMoneyByDay > 0 ? (
                            <FaCaretUp
                              color='green'
                              className='me-1'
                              size={20}
                            />
                          ) : (
                            <FaCaretDown color='red' className='me-1' />
                          )}
                        </span>
                        <span>
                          {profitMoneyByDay > 0 ? (
                            <span className='text-green-500 font-bold'>
                              {Math.abs(profitMoneyByDay).toFixed(2)}%
                            </span>
                          ) : (
                            <span className='text-red-600 font-bold'>
                              -{Math.abs(profitMoneyByDay).toFixed(2)}%
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex-1 pl-2'>
                  <p className='mb-0 font-sans font-semibold leading-normal text-sm'>
                    Yesterday&apos;s Money
                  </p>
                  <h5 className='mb-0 font-bold'>
                    {totalMoneyPrevByDay.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </h5>
                </div>
              </div>
              <div className='max-w-full pr-3 text-right mt-4'>
                <div className='inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-700 to-blue-400 shadow-xl'>
                  <svg
                    width='30px'
                    height='30px'
                    viewBox='-0.5 0 25 25'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='ml-2.5 mt-2'
                  >
                    <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                    <g
                      id='SVGRepo_tracerCarrier'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <path
                        d='M12.8702 16.97V18.0701C12.8702 18.2478 12.7995 18.4181 12.6739 18.5437C12.5482 18.6694 12.3778 18.74 12.2001 18.74C12.0224 18.74 11.852 18.6694 11.7264 18.5437C11.6007 18.4181 11.5302 18.2478 11.5302 18.0701V16.9399C11.0867 16.8668 10.6625 16.7051 10.2828 16.4646C9.90316 16.2241 9.57575 15.9097 9.32013 15.54C9.21763 15.428 9.16061 15.2817 9.16016 15.1299C9.16006 15.0433 9.17753 14.9576 9.21155 14.8779C9.24557 14.7983 9.29545 14.7263 9.35809 14.6665C9.42074 14.6067 9.49484 14.5601 9.57599 14.5298C9.65713 14.4994 9.7436 14.4859 9.83014 14.49C9.91602 14.4895 10.0009 14.5081 10.0787 14.5444C10.1566 14.5807 10.2254 14.6338 10.2802 14.7C10.6 15.1178 11.0342 15.4338 11.5302 15.6099V13.0701C10.2002 12.5401 9.53015 11.77 9.53015 10.76C9.55019 10.2193 9.7627 9.70353 10.1294 9.30566C10.4961 8.9078 10.9929 8.65407 11.5302 8.59009V7.47998C11.5302 7.30229 11.6007 7.13175 11.7264 7.0061C11.852 6.88045 12.0224 6.81006 12.2001 6.81006C12.3778 6.81006 12.5482 6.88045 12.6739 7.0061C12.7995 7.13175 12.8702 7.30229 12.8702 7.47998V8.58008C13.2439 8.63767 13.6021 8.76992 13.9234 8.96924C14.2447 9.16856 14.5226 9.43077 14.7402 9.73999C14.8284 9.85568 14.8805 9.99471 14.8901 10.1399C14.8928 10.2256 14.8783 10.3111 14.8473 10.3911C14.8163 10.4711 14.7696 10.5439 14.7099 10.6055C14.6502 10.667 14.5787 10.7161 14.4998 10.7495C14.4208 10.7829 14.3359 10.8001 14.2501 10.8C14.1607 10.7989 14.0725 10.7787 13.9915 10.7407C13.9104 10.7028 13.8384 10.648 13.7802 10.5801C13.5417 10.2822 13.2274 10.054 12.8702 9.91992V12.1699L13.1202 12.27C14.3902 12.76 15.1802 13.4799 15.1802 14.6299C15.163 15.2399 14.9149 15.8208 14.4862 16.2551C14.0575 16.6894 13.4799 16.9449 12.8702 16.97ZM11.5302 11.5901V9.96997C11.3688 10.0285 11.2298 10.1363 11.1329 10.2781C11.0361 10.4198 10.9862 10.5884 10.9902 10.76C10.9984 10.93 11.053 11.0945 11.1483 11.2356C11.2435 11.3767 11.3756 11.4889 11.5302 11.5601V11.5901ZM13.7302 14.6599C13.7302 14.1699 13.3902 13.8799 12.8702 13.6599V15.6599C13.1157 15.6254 13.3396 15.5009 13.4985 15.3105C13.6574 15.1202 13.74 14.8776 13.7302 14.6299V14.6599Z'
                        fill='#ffffff'
                      />{' '}
                      <path
                        d='M12.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V11.8999'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                      <path
                        d='M21.9998 2.91992L16.3398 8.57992'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                      <path
                        d='M20.8698 8.5798H16.3398V4.0498'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Total Cash */}
        <div className='relative border border-1 flex flex-col min-w-0 mb-6 break-words  bg-white shadow-lg rounded-2xl bg-clip-border'>
          <div className='flex-auto p-4'>
            <div className='flex flex-wrap -mx-3 justify-around'>
              <div className='flex justify-around w-2/3 max-w-full '>
                <div className='flex-1 pl-2 mt-4'>
                  <p className='mb-0 font-sans font-semibold leading-normal text-sm'>
                    Cash&apos;s Money
                  </p>
                  <h5 className='mb-0 font-bold'>
                    {totalMoneyByDayCash.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </h5>
                </div>
              </div>
              <div className='max-w-full pr-3 text-right mt-4'>
                <div className='inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-700 to-blue-400 shadow-xl'>
                  <svg
                    className='ml-2.5 mt-2'
                    width='30px'
                    height='30px'
                    viewBox='0 0 48 48'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='#ffffff'
                  >
                    <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                    <g
                      id='SVGRepo_tracerCarrier'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <g id='Layer_2' data-name='Layer 2'>
                        {' '}
                        <g id='invisible_box' data-name='invisible box'>
                          {' '}
                          <rect width={48} height={48} fill='none' />{' '}
                        </g>{' '}
                        <g id='Icons'>
                          {' '}
                          <g>
                            {' '}
                            <path d='M42.2,31.7a4.6,4.6,0,0,0-4-1.1l-9.9,1.7A4.7,4.7,0,0,0,26.9,29l-7.1-7H5a2,2,0,0,0,0,4H18.2l5.9,5.9a.8.8,0,0,1,0,1.1.9.9,0,0,1-1.2,0l-3.5-3.5a2.1,2.1,0,0,0-2.8,0,2.1,2.1,0,0,0,0,2.9l3.5,3.4a4.5,4.5,0,0,0,3.4,1.4,5.7,5.7,0,0,0,1.8-.3h0l13.6-2.4a1,1,0,0,1,.8.2,1.1,1.1,0,0,1,.3.7,1,1,0,0,1-.8,1L20.6,39.8,9.7,30.9H5a2,2,0,0,0,0,4H8.3L19.4,44l20.5-3.7A4.9,4.9,0,0,0,44,35.4,4.6,4.6,0,0,0,42.2,31.7Z' />{' '}
                            <path d='M34.3,20.1h0a6.7,6.7,0,0,1-4.1-1.3,2,2,0,0,0-2.8.6,1.8,1.8,0,0,0,.3,2.6A10.9,10.9,0,0,0,32,23.8V26a2,2,0,0,0,4,0V23.8a6.3,6.3,0,0,0,3-1.3,4.9,4.9,0,0,0,2-4h0c0-3.7-3.4-4.9-6.3-5.5s-3.5-1.3-3.5-1.8.2-.6.5-.9a3.4,3.4,0,0,1,1.8-.4,6.3,6.3,0,0,1,3.3.9,1.8,1.8,0,0,0,2.7-.5,1.9,1.9,0,0,0-.4-2.8A9.1,9.1,0,0,0,36,6.3V4a2,2,0,0,0-4,0V6.2c-3,.5-5,2.5-5,5.2s3.3,4.9,6.5,5.5,3.3,1.3,3.3,1.8S35.7,20.1,34.3,20.1Z' />{' '}
                          </g>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Total Wallet */}
        <div className='relative border border-1 flex flex-col min-w-0 mb-6 break-words  bg-white shadow-lg rounded-2xl bg-clip-border'>
          <div className='flex-auto p-4'>
            <div className='flex flex-wrap -mx-3 justify-around'>
              <div className='flex justify-around w-2/3 max-w-full '>
                <div className='flex-1 pl-2 mt-4'>
                  <p className='mb-0 font-sans font-semibold leading-normal text-sm'>
                    Wallet&apos;s Money
                  </p>
                  <p className='text-[2vh] font-bold text-black'>
                    {totalMoneyByDayWallet.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
              </div>
              <div className='max-w-full pr-3 text-right mt-4'>
                <div className='inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-700 to-blue-400 shadow-xl'>
                  <svg
                    className='mt-2.5 ml-2'
                    width='30px'
                    height='30px'
                    viewBox='-0.5 0 25 25'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                    <g
                      id='SVGRepo_tracerCarrier'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <path
                        d='M18 2.91992V10.9199'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                      <path
                        d='M21.2008 7.71997L18.0008 10.92L14.8008 7.71997'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                      <path
                        d='M10.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V13.8999'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                      <path
                        d='M2 9.96997H5.37006C6.16571 9.96997 6.92872 10.286 7.49133 10.8486C8.05394 11.4112 8.37006 12.1743 8.37006 12.97C8.37006 13.7656 8.05394 14.5287 7.49133 15.0913C6.92872 15.6539 6.16571 15.97 5.37006 15.97H2'
                        stroke='#ffffff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />{' '}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Total VNPay */}
        <div className='relative border border-1 flex flex-col min-w-0 mb-6 break-words  bg-white shadow-lg rounded-2xl bg-clip-border'>
          <div className='flex-auto p-4'>
            <div className='flex flex-wrap -mx-3 justify-around'>
              <div className='flex justify-around w-2/3 max-w-full '>
                <div className='flex-1 pl-2 mt-4'>
                  <p className='mb-0 font-sans font-semibold leading-normal text-sm'>
                    VnPay&apos;s Money
                  </p>
                  <p className='text-[2vh] font-bold text-black'>
                    {totalMoneyByDayVnPay.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })}
                  </p>
                </div>
              </div>
              <div className='max-w-full pr-3 text-right mt-4'>
                <div className='inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-blue-700 to-blue-400 shadow-xl'>
                  <svg
                    className='mt-2 ml-2'
                    width='35px'
                    height='35px'
                    viewBox='0 0 48 48'
                    id='b'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='#ffffff'
                  >
                    <g id='SVGRepo_bgCarrier' strokeWidth={0} />
                    <g
                      id='SVGRepo_tracerCarrier'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <g id='SVGRepo_iconCarrier'>
                      {' '}
                      <defs>
                        {' '}
                        <style
                          dangerouslySetInnerHTML={{
                            __html:
                              '.c{stroke-linecap:round;}.c,.d{fill:none;stroke:#ffffff;stroke-linejoin:round;}',
                          }}
                        />{' '}
                      </defs>{' '}
                      <path
                        className='d'
                        d='m28.6222,37.7222l14.4444-14.4444c.5778-.5778.5778-1.7333,0-2.3111l-8.6667-8.6667c-.5778-.5778-1.7333-.5778-2.3111,0l-6.3556,6.3556-9.2444-9.2444c-.5778-.5778-1.7333-.5778-2.3111,0l-9.2444,9.2444c-.5778.5778-.5778,1.7333,0,2.3111l16.7556,16.7556c1.7333,1.7333,5.2,1.7333,6.9333,0Z'
                      />{' '}
                      <path
                        className='c'
                        d='m25.7333,18.6556l-8.0889,8.0889c-2.3111,2.3111-4.6222,2.3111-6.9333,0'
                      />{' '}
                      <g>
                        {' '}
                        <path
                          className='c'
                          d='m18.2222,30.7889c-1.1556,1.1556-2.3111,1.1556-3.4667,0m22.5333-15.6c-1.262-1.1556-2.8889-.5778-4.0444.5778l-15.0222,15.0222'
                        />{' '}
                        <path
                          className='c'
                          d='m18.2222,15.7667c-4.6222-4.6222-10.4,1.1556-5.7778,5.7778l5.2,5.2-5.2-5.2'
                        />{' '}
                        <path
                          className='c'
                          d='m23.4222,20.9667l-4.0444-4.0444'
                        />{' '}
                        <path
                          className='c'
                          d='m21.6889,22.7l-4.6222-4.6222c-.5778-.5778-1.4444-1.4444-2.3111-1.1556'
                        />{' '}
                        <path
                          className='c'
                          d='m14.7556,20.3889c-.5778-.5778-1.4444-1.4444-1.1556-2.3111m5.7778,6.9333l-4.6222-4.6222'
                        />{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistical;
