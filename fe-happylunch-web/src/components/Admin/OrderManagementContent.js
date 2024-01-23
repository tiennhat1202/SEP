import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import OrderTodo from '../Subcomponents/OrderManagementTodo';
import OrderCompleted from '../Subcomponents/OrderManagementCompleted';
import OrderCancelled from '../Subcomponents/OrderManagementCancelled';

function OrderManagementContent() {
  const [selectedStatus, setSelectedStatus] = useState(0);
  document.title = 'Manage Order'

  return (
    <div>
      <h2 className="mb-2 font-bold text-2xl">Order Management</h2>
      <div className="p-4 border-[1px] border-gray-200 border-solid rounded-lg">
        <div className="pb-2 flex items-center justify-between">
          <div>
            <button
              onClick={() => {
                setSelectedStatus(0);
              }}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedStatus === 0 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => {
                setSelectedStatus(3);
              }}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedStatus === 3 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Complete
            </button>
            <button
              onClick={() => {
                setSelectedStatus(-1);
              }}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedStatus === -1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
        {selectedStatus === 0 ? (
          <OrderTodo />
        ) : selectedStatus === 3 ? (
          <OrderCompleted />
        ) : (
          <OrderCancelled />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default OrderManagementContent;
