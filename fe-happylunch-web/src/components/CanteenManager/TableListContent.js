import React from 'react'
import TableListReview from './TableListReview'
import CommentText from './CommentText'
import ApproveBtn from '../Commons/Button'
import RejectBtn from '../Commons/RejectBtn'
import BackMenuComponent from '../Commons/BackMenu'
function TableListContent() {
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <div className="pt-24 pb-4">
          <h2 className="font-bold text-2xl">Menu Review</h2>
        </div>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <TableListReview></TableListReview>
          <div className="mt-2">
            <CommentText></CommentText>
            <div className="text-end mt-2 grid grid-cols-3">
              <BackMenuComponent linkUrl="/MenuManagement_Canteen"></BackMenuComponent>
              <div className="col-span-2 justify-end flex gap-3">
                <div>
                  <ApproveBtn linkUrl="#" linkName="Approve"></ApproveBtn>
                </div>
                <div>
                  <RejectBtn linkUrl="#" linkName="Reject"></RejectBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableListContent