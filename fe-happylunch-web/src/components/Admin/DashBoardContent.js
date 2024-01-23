import React from 'react';
import ChartTotalMoney from './ChartTotalMoney';
import ChartOrderMeal from './ChartOrderMeal';
import Statistical from './Statistical';
import StatisticalByMonth from './StatisticalByMonth';
function DashBoardContent() {
  document.title = 'Dashboard';
  return (
    <>
      <h2 className='mb-2 font-bold text-2xl'>Dashboard</h2>
      <div className='xl:grid xl:grid-cols-2 gap-4 '>
        <div className='mt-2 sm:p-6 p-4'>
          <Statistical></Statistical>
        </div>
        <div className='shadow-md mt-2 sm:p-6 p-4 border-[1px] border-gray-200 border-solid rounded-lg dark:border-gray-700'>
          <StatisticalByMonth></StatisticalByMonth>
        </div>
        <div className='shadow-md mt-2 sm:p-6 p-4 border-[1px] border-gray-200 border-solid rounded-lg dark:border-gray-700'>
          <ChartOrderMeal></ChartOrderMeal>
        </div>
        <div className='mt-2 shadow-md sm:p-6 p-4 border-[1px] border-gray-200 border-solid rounded-lg dark:border-gray-700'>
          <ChartTotalMoney></ChartTotalMoney>
        </div>
      </div>
    </>
  );
}

export default DashBoardContent;
