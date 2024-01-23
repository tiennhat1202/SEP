import React, { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Select, Table, Space } from 'antd';
import StatisticalService from '../../services/StatisticalService';
import { useEffect } from 'react';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
function StatisticalByMonth() {
  const statisticalService = new StatisticalService();
  const monthFormat = 'MM/YYYY';
  const formattedDate = 'dd/MM/YYYY';
  const options = ['Cash', 'Wallet', 'VNPay'];
  const [sortOption, setSortOption] = useState(options[0]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(1);
  const [firstMonth, setFirstMonth] = useState(
    dayjs().subtract(1, 'month').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  );
  const [secondMonth, setSecondMonth] = useState(
    dayjs().endOf('month').format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  );
  const [firstDay, setFirstDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  /* const [checkSelect, setCheckSelect] = useState(false);
  const [checkMonth, setCheckMonth] = useState(false); */
  const [totalMoneyByMonth, setTotalMoneyByMonth] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [date, setDate] = useState(null);

  const handleMonthRangeChange = (dates, dateStrings) => {
    if (dates === null) {
      setFirstMonth(null);
      setSecondMonth(null);
      setDate(dates);
      setTotalMoneyByMonth([]);
    } else {
      const extractedMonths = dateStrings.map((dateString) =>
        dayjs(dateString, monthFormat).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      );
      /* statisticalOrderTotalMoneyByMonth(
      false,
      extractedMonths[0],
      extractedMonths[1]
    ); */
      setFirstMonth(extractedMonths[0]);
      setSecondMonth(extractedMonths[1]);
      if (firstDay !== null) {
        setFirstDay(null);
        setStartMonth(null);
      }
    }
  };
  const getTotalMoneyByMonthPaymentMethod = async (
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
        setTotalMoneyByMonth(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const columns = [
  {
    title: 'OrderTime',
    dataIndex: 'orderTime',
    //...
  },
  {
    title: 'Total Money',
    dataIndex: 'totalMoney',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.totalMoney - b.totalMoney,
    render: (text) => (
      <span>
        {new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(text).replace(/\./g, ',')}
      </span>
    ),
  },
];
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
  const handleSelectChange = (value, option) => {
    const index = option.index + 1;
    setSelectedOptionIndex(index);
    setSortOption(value);
  };
  const onChangeDateByDay = (date, dateString) => {
    if (date === null) {
      setTotalMoneyByMonth([]);
      setFirstDay(null);
      setEndDay(null);
      setDate(null);
    } else {
      const fDay = dayjs(date, formattedDate)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      const eDay = dayjs(date, formattedDate)
        .startOf('day')
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      setFirstDay(fDay);
      setEndDay(eDay);
      setFirstMonth(null);
      setSecondMonth(null);
      setStartMonth(null);
      setEndMonth(null);
    }
  };

  const onChangeDateByMonth = (date, monthString) => {
    if (date === null) {
      setStartMonth(null);
      setEndMonth(null);
      setDate(null);
      setTotalMoneyByMonth([]);
    } else {
      const sMonth = dayjs(date, monthFormat)
        .startOf('month')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      const eMonth = dayjs(date, monthFormat)
        .startOf('month')
        .endOf('month')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');
      setStartMonth(sMonth);
      setEndMonth(eMonth);
      setFirstDay(null);
      setEndDay(null);
      setFirstMonth(null);
      setSecondMonth(null);
    }
  };

  useEffect(() => {
    if (firstMonth && secondMonth && selectedOptionIndex) {
      getTotalMoneyByMonthPaymentMethod(
        firstMonth,
        secondMonth,
        selectedOptionIndex,
        false
      );
    }
  }, [firstMonth, secondMonth, selectedOptionIndex]);

  useEffect(() => {
    if (firstDay && endDay && selectedOptionIndex) {
      getTotalMoneyByMonthPaymentMethod(
        firstDay,
        endDay,
        selectedOptionIndex,
        true
      );
    }
  }, [firstDay, endDay, selectedOptionIndex]);

  useEffect(() => {
    if (startMonth && endMonth && selectedOptionIndex) {
      getTotalMoneyByMonthPaymentMethod(
        startMonth,
        endMonth,
        selectedOptionIndex,
        true
      );
    }
  }, [startMonth, endMonth, selectedOptionIndex]);

  const formattedTotalMoneyByMonth = totalMoneyByMonth.map(item => ({
    ...item,
    orderTime: dayjs(item.orderTime).format('DD-MM-YYYY'),
  }));

  console.log('totalMoneyByMonth: ', totalMoneyByMonth);
  return (
    <div>
      <h2 className='text-center text-[#666666] font-bold'>
        Statistic Money By Month
      </h2>
      <div className='flex gap-2 mt-3'>
        <label className='mt-1.5 '>Search month: </label>
        <RangePicker
          value={
            firstMonth && secondMonth
              ? [dayjs(firstMonth), dayjs(secondMonth)]
              : date
          }
          defaultValue={[dayjs().subtract(1, 'month'), dayjs().endOf('month')]}
          size='small'
          picker='month'
          bordered={true}
          format={monthFormat}
          onChange={handleMonthRangeChange}
          allowClear={true}
          placeholder={['Search start month', 'Search end month']}
        />
        <div>
          <Select
            mode='single'
            placeholder='Inserted are removed'
            value={sortOption === '' ? setSortOption('Cash') : sortOption}
            onChange={handleSelectChange}
            style={{ width: '200px' }}
            options={options.map((item, i) => ({
              value: item,
              label: item,
              index: i,
            }))}
          />
        </div>
      </div>
      <div className='flex mt-2 gap-2'>
        <label className='mt-1.5'>Search by day: </label>
        <div>
          <Space direction='vertical'>
            <DatePicker
              value={firstDay ? dayjs(firstDay) : date}
              onChange={onChangeDateByDay}
              placeholder={'Search by day'}
            />
          </Space>
        </div>
        <label className='mt-1.5'>Search in month: </label>
        <div>
          <Space direction='vertical'>
            <DatePicker
              value={startMonth ? dayjs(startMonth) : date}
              onChange={onChangeDateByMonth}
              picker={'month'}
              placeholder={'Search in month'}
            />
          </Space>
        </div>
      </div>
      <div className='mt-2'>
        <Table
          columns={columns}
          dataSource={formattedTotalMoneyByMonth}
          onChange={onChange}
          pagination={{
            pageSize: pageSize,
          }}
        />
      </div>
    </div>
  );
}

export default StatisticalByMonth;
