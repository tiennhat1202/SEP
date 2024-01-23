import React, { useState, useEffect } from 'react';
import FeedbackWaiting from '../Subcomponents/FeedbackManagementWaiting';
import FeedbackResponsed from '../Subcomponents/FeedbackManagementResponsed';

function FeedBackManagement() {
  document.title = 'Manage Feedback'

  const [selectedStatus, setSelectedStatus] = useState(0);

  return (
    <div>
      <h2 className="mb-2 font-bold text-2xl">FeedBack Management</h2>
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
              Waiting
            </button>
            <button
              onClick={() => {
                setSelectedStatus(1);
              }}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedStatus === 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Responsed
            </button>
          </div>
        </div>
        {selectedStatus === 0 ? <FeedbackWaiting /> : <FeedbackResponsed />}
    </div>
  );
}

export default FeedBackManagement;
