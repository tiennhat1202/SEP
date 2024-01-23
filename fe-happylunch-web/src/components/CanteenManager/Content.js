import React from 'react';
import OptionHeaderComponent from './OptionHeader'
import PaginationComponent from '../Commons/Pagination'
import TableListComponent from './TableList';
function Content() {
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <div className="pt-24 pb-4">
          <h2 className="font-bold text-2xl">Menu Management</h2>
        </div>
        <OptionHeaderComponent></OptionHeaderComponent>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <TableListComponent></TableListComponent>
        </div>
      </div>
      <div className="absolute right-6">
        <PaginationComponent></PaginationComponent>
      </div>
    </div>
  );
}

export default Content;