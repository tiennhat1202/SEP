import React from 'react';
import SearchFieldComponent from '../Commons/SearchField';
import DatePickerComponent from '../Commons/DatePicker';
function OptionHeader() {
  return (
    <div className="pb-4 lg:flex md:flex sm:flex gap-4 max-sm:flex place-items-center">
      <div className=" sm:mr-0 w-80">
        <SearchFieldComponent
          titlePlaceholder="Search..."
          componentName="Search"
        ></SearchFieldComponent>
      </div>
      <div className="md:text-end lg:text-left">
        <DatePickerComponent></DatePickerComponent>
      </div>
    </div>
  );
}

export default OptionHeader;
