import React, { useEffect, useState } from 'react';
import { CChart } from '@coreui/react-chartjs';
import StatisticalService from '../../services/StatisticalService';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker } from 'antd';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'DD/MM/YYYY';

function ChartOrderMeal() {
  const statisticalService = new StatisticalService();
  const [dataStatisticOrderMeal, setDataStatisticOrderMeal] = useState([]);

  useEffect(() => {
    // Initial data fetch with default dates set to today
    const today = dayjs();
    const yesterday = today.subtract(1, 'day').endOf('day');
    getStatisticalOrderMeal(
      yesterday.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      today.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    );
  }, []);

  const getStatisticalOrderMeal = async (startDate, endDate) => {
    try {
      const response = await statisticalService.statisticalOrderMeal(
        startDate,
        endDate
      );
      if (response && response.code === 200) {
        setDataStatisticOrderMeal(response.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const coldHue = Math.random() * 120 + 180;
      const saturation = 70;
      const lightness = 60;

      colors.push(`hsl(${coldHue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  const convertDateStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .startOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    );
  };

  const convertDateEndStrings = (dateStrings) => {
    return dateStrings.map((dateString) =>
      dayjs(dateString, dateFormat)
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    );
  };
  const handleDateRangeChange = (dates, dateStrings) => {
    const convertedDates = convertDateStrings(dateStrings);
    const convertedEndDates = convertDateEndStrings(dateStrings);
    getStatisticalOrderMeal(convertedDates[0], convertedEndDates[1]);
  };

  const mealData = dataStatisticOrderMeal.map((meal) => ({
    mealName: meal.mealName,
    quantity: meal.quantity,
  }));

  const numLabels = mealData.length;
  const colors = generateColors(numLabels);

  const chartData = {
    labels: mealData.map((meal) => meal.mealName),
    datasets: [
      {
        label: 'Quantity',
        data: mealData.map((meal) => meal.quantity),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Statistics number of meals required',
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <div>
        <CChart type="bar" data={chartData} options={chartOptions}/>
      </div>
      <div className="mt-5 flex justify-start">
        <div className="flex justify-start items-center px-8 mb-4">
          <p className="text-[14px] me-2 font-semibold"> Date Range: </p>
          <RangePicker
            size="small"
            defaultValue={[dayjs().subtract(1, 'day'), dayjs()]}
            disabled={[false, false]}
            format={dateFormat}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default ChartOrderMeal;
