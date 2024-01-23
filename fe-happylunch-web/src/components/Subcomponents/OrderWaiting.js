import React, { useEffect, useState } from 'react';
import OrderService from '../../services/OrderService';
import { toast, ToastContainer } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { Select } from 'antd';

function OrderWaiting() {
  const orderService = new OrderService();
  const [listOrderWaiting, setListOrderWaiting] = useState([]);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [listSearch, setListSearch] = useState([]);
  const options = ['Ascending', 'Descending'];
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Ascending');

  useEffect(() => {
    getListOrderWaiting();
  }, []);


  useEffect(() => {
    sortListOrder();
  }, [sortOption]);

  const getListOrderWaiting = async () => {
    try {
      const res = await orderService.getProcessingOrderHeadchef(2);
      if (res && res.code === 200) {
        console.log(res.response.data);
        setListOrderWaiting(res.response.data);
      }
    } catch (error) {
      toast.error('Get List Order Failed', error);
    }
  };

  const paginatedList = () => {
    if (listOrderWaiting && listOrderWaiting.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return listOrderWaiting.slice(startIndex, endIndex);
    }
    return [];
  };

  function parseDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  const sortListOrder = () => {
    if (sortOption === 'Ascending') {
      setListOrderWaiting(
        [...listOrderWaiting].sort((a, b) => a.orderIndex - b.orderIndex)
      );
    } else if (sortOption === 'Descending') {
      setListOrderWaiting(
        [...listOrderWaiting].sort((a, b) => b.orderIndex - a.orderIndex)
      );
    }
  };

  const updateStatusOrder = async (orderId) => {
    try {
      const response = await orderService.handleOrderCanteenManager(orderId, 3);
      if (response.code === 200) {
        toast.success('Order Completed');

        setListOrderWaiting((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setListOrderWaiting((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
      }
    } catch (error) {
      toast.error('Update Order Failed');
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setListSearch([]);
    } else {
      const filteredOrders = listOrderWaiting.filter((order) =>
        order.orderIndex.toString().includes(searchQuery)
      );
      setListSearch(filteredOrders);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="pb-3 mt-2 flex justify-between">
      <input
          className="ps-3 pe-4 border-[1px] rounded-[8px] text-[13px] py-1 full focus:outline-1 focus:outline-offset-0 focus:outline-blue-500 "
          placeholder="Search Order Index"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        <Select
          mode="single"
          placeholder="Inserted are removed"
          value={sortOption}
          onChange={setSortOption}
          style={{ width: '300px' }}
          options={options.map((item) => ({
            value: item,
            label: item,
          }))}
        />
      </div>
      <div className="grid grid-cols-5 gap-4">
        {listSearch && listSearch.length > 0
          ? listSearch.map((item, index) => (
              <div key={index} className="w-full border-[1px]">
                <div className="p-2 bg-[#60cd60]">
                  <div className="flex font-semibold text-[14px] text-white">
                    {parseDateTime(item.orderDate) === '0:00' ? (
                      <span>Online</span>
                    ) : (
                      parseDateTime(item.orderDate)
                    )}
                  </div>
                  <div className="flex font-semibold text-[14px] text-white">
                    Order: #{item.orderIndex}
                  </div>
                </div>
                <div className="max-h-[200px] min-h-[200px] overflow-auto">
                  {item.listMealOrder &&
                    item.listMealOrder.map((subMealOrder, index) => (
                      <div
                        key={index}
                        className="flex bg-white pt-2 pb-2 pe-2 mx-3 justify-between items-center"
                      >
                        <div className="flex">
                          <span className="me-2 text-[13px] font-semibold text-black">
                            x{subMealOrder.quantity}
                          </span>
                          <p className="mx-2 text-[13px] font-semibold text-black">
                            {subMealOrder.mealName}
                          </p>
                        </div>
                        <FaCheck className="text-[#60cd60]" />
                      </div>
                    ))}
                </div>
                <div className="flex">
                  <div
                    className="bg-[#60cd60] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center cursor-pointer"
                    onClick={() => updateStatusOrder(item.orderId)}
                  >
                    Complete
                  </div>
                </div>
              </div>
            ))
          : paginatedList() &&
            paginatedList().map((item, index) => (
              <div key={index} className="w-full border-[1px]">
                <div className="p-2 bg-[#60cd60] ">
                  <div className="flex font-semibold text-[14px] text-white">
                    {parseDateTime(item.orderDate) === '0:00' ? (
                      <span>Online</span>
                    ) : (
                      parseDateTime(item.orderDate)
                    )}
                  </div>
                  <div className="flex font-semibold text-[14px] text-white">
                    Order: #{item.orderIndex}
                  </div>
                </div>
                <div className="max-h-[200px] min-h-[200px] overflow-auto">
                  {item.listMealOrder &&
                    item.listMealOrder.map((subMealOrder, index) => (
                      <div
                        key={index}
                        className="flex bg-white pt-2 pb-2 pe-2 mx-3 justify-between items-center"
                      >
                        <div className="flex">
                          <span className="me-2 text-[13px] font-semibold text-black">
                            x{subMealOrder.quantity}
                          </span>
                          <p className="mx-2 text-[13px] font-semibold text-black">
                            {subMealOrder.mealName}
                          </p>
                        </div>
                        <FaCheck className="text-[#60cd60]" />
                      </div>
                    ))}
                </div>
                <div className="flex">
                  <div
                    className="bg-[#60cd60] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center cursor-pointer"
                    onClick={() => updateStatusOrder(item.orderId)}
                  >
                    Complete
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}

export default OrderWaiting;
