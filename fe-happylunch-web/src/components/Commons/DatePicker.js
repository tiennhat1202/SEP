import React, { useEffect, useState } from 'react';
import DatePickers from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ onSelectedDatePicker, getADate }) => {
  const [startDate, setStartDate] = useState(null); // Set initial state to null
  const [selectedDateTime, setSelectedDateTime] = useState('');

  const handleChange = (selectedData) => {
    if (selectedData) {
      // Extract the date and time components from the selected date
      const selectedDate = new Date(selectedData);

      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const day = selectedDate.getDate();
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const seconds = selectedDate.getSeconds();
      const milliseconds = selectedDate.getMilliseconds();

      // Format the date and time in the desired format
      const formattedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}Z`;

      /* console.log(formattedDateTime); */
      setSelectedDateTime(formattedDateTime); // Update selectedDateTime state with the new date and time
    } else {
      setSelectedDateTime(null); // If the selectedData is null, set selectedDateTime to null
    }

    setStartDate(selectedData); // Update the input field with the selected date or null
  };
  useEffect(() => {
    if (getADate) {
      // Extract the date and time components from the getADate
      const selectedDate = new Date(getADate);

      // Set initial startDate when the component is mounted
      setStartDate(selectedDate);
    }
  }, [getADate]);

  useEffect(() => {
    onSelectedDatePicker(selectedDateTime); // Call the callback in useEffect after state update
  }, [selectedDateTime, onSelectedDatePicker]);

  return (
    <div className="flex  max-sm:w-40 ">
      <DatePickers
        className='w-56 h-9 rounded-md'
        selected={startDate}
        onChange={handleChange}
        placeholderText="Select Date" // Set a placeholder text
        isClearable={true} // Enable the clear date feature
        dateFormat="yyyy-MM-dd:HH:mm:ss" // Set the date and time format
        showTimeSelect
        timeIntervals={1} // Set time interval if needed
      />
    </div>
  );
};

export default DatePicker;
