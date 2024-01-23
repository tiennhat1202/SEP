import React, { useEffect, useState } from 'react';
import { CChart } from '@coreui/react-chartjs';
import StatisticalService from '../../services/StatisticalService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const monthFormat = 'MM/YYYY';

function ChartTotalMoney() {
  const statisticalService = new StatisticalService();
  const [dataStatisticOrderMealDaily, setDataStatisticOrderMealDaily] =
    useState([]);
  const [dataStatisticOrderMealMonthly, setDataStatisticOrderMealMonthly] =
    useState([]);
  const [dateRangeValue, setDateRangeValue] = useState([
    dayjs().startOf('month').endOf('day'),
    dayjs(),
  ]);
  const [monthRangeValue, setMonthRangeValue] = useState([]);

  useEffect(() => {
    fetchData();
  }, [dateRangeValue, monthRangeValue]);

  const fetchData = async () => {
    if (dateRangeValue?.length > 0) {
      /* const today = dayjs();
      const firstDayOfMonth = dayjs().startOf('month').endOf('day'); */
      await statisticalOrderTotalMoney(
        true,
        dateRangeValue[0],
        dateRangeValue[1]
      );
    } else if (monthRangeValue?.length > 0) {
      await statisticalOrderTotalMoneyByMonth(
        false,
        monthRangeValue[0].startOf('month').endOf('day'),
        monthRangeValue[1].endOf('month').endOf('day')
      );
    }
  };

  const statisticalOrderTotalMoney = async (byDay, startTime, endTime) => {
    try {
      const response = await statisticalService.statisticalOrderTotalMoney(
        byDay,
        startTime,
        endTime
      );
      if (response && response.code === 200) {
        const formattedData = response.response.data.map((item) => ({
          ...item,
          orderTime: new Date(item.orderTime)
            .toLocaleDateString('vi-VN')
            .split('T')[0],
        }));
        setDataStatisticOrderMealDaily(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const statisticalOrderTotalMoneyByMonth = async (
    byDay,
    startTime,
    endTime
  ) => {
    try {
      const response = await statisticalService.statisticalOrderTotalMoney(
        byDay,
        startTime,
        endTime
      );
      if (response && response.code === 200) {
        const formattedData = response.response.data.map((item) => ({
          ...item,
          orderTime: new Date(item.orderTime)
            .toLocaleDateString('vi-VN')
            .split('T')[0],
        }));
        setDataStatisticOrderMealMonthly(formattedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    setDateRangeValue(dates);
    setMonthRangeValue([]); // Reset monthRangeValue when handling date range change
  };

  const handleMonthRangeChange = (dates, dateStrings) => {
    setMonthRangeValue(dates);
    setDateRangeValue([]); // Reset dateRangeValue when handling month range change
  };

  const orderTimes = dataStatisticOrderMealDaily.map((data) => data.orderTime);
  const totalMoneyValues = dataStatisticOrderMealDaily.map(
    (data) => data.totalMoney
  );
  const orderTimesMonthly = dataStatisticOrderMealMonthly.map(
    (data) => data.orderTime
  );
  const totalMoneyValuesMonthly = dataStatisticOrderMealMonthly.map(
    (data) => data.totalMoney
  );

  // ...

  return (
    <div>
      <div>
        <CChart
          type='line'
          data={{
            labels:
              dateRangeValue?.length > 0
                ? orderTimes
                : monthRangeValue?.length > 0
                ? orderTimesMonthly
                : [],
            datasets: [
              {
                label: 'Total',
                backgroundColor: 'rgba(220, 220, 220, 0.2)',
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                pointBorderColor: '#fff',
                data:
                  dateRangeValue?.length > 0
                    ? totalMoneyValues
                    : monthRangeValue?.length > 0
                    ? totalMoneyValuesMonthly
                    : [],
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Statistics Money',
              },
            },
          }}
        />
      </div>

      <div className='mt-5 flex justify-start'>
        <div className='flex justify-start items-center px-8 mb-4'>
          <p className='text-[14px] me-4 font-semibold'> Date Range: </p>
          <RangePicker
            size='small'
            value={dateRangeValue}
            defaultValue={[dayjs().startOf('month').endOf('day'), dayjs()]}
            disabled={[false, false]}
            format={dateFormat}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>
      <div className='mt-2 flex justify-start'>
        <div className='flex justify-start items-center px-8 mb-4'>
          <p className='text-[14px] me-2 font-semibold'> Month Range: </p>
          <RangePicker
            size='small'
            value={monthRangeValue}
            picker='month'
            bordered={true}
            format={monthFormat}
            onChange={handleMonthRangeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ChartTotalMoney;
