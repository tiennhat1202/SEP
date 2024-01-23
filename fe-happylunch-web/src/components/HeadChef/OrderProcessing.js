import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import OrderService from '../../services/OrderService';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast, ToastContainer } from 'react-toastify';
import { Dropdown } from 'flowbite-react';
import { FaCheck } from 'react-icons/fa';
import { useMealReadyContext } from '../../store/MealReadyContext';
import OrderWaitingComponent from '../Subcomponents/OrderWaiting';
import StatusServiceMealingComponent from '../Subcomponents/SetServiceMeal';
import OrderProcessingSummaryComponent from '../Subcomponents/OrderProcessingSummary';
import { Select } from 'antd';

function OrderProcessingComponent() {
  document.title = 'Order Processing';
  const [selectedList, setSelectedList] = useState(0);
  const [sortOption, setSortOption] = useState('Ascending');
  const [listOrder, setListOrder] = useState([]);
  const orderService = new OrderService();
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [listSearch, setListSearch] = useState([]);
  const { mealReady, updateMealReady } = useMealReadyContext();
  const options = ['Ascending', 'Descending'];

  useEffect(() => {
    getProcessingOrderHeadchef();

    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/orderlist', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    hubConnection.start();

    hubConnection.on('Add Order', (newOrder) => {
      const newOjb = JSON.parse(newOrder);
      setListOrder((preOrder) => [newOjb, ...preOrder]);
    });

    hubConnection.on('Cancel Order', (orderId) => {
      setListOrder((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
    });
    return () => {
      hubConnection.stop();
    };
  }, [selectedList]);

  useEffect(() => {
    sortListOrder();
  }, [sortOption]);

  const getProcessingOrderHeadchef = async () => {
    try {
      const res = await orderService.getProcessingOrderHeadchef(0);
      if (res && res.code === 200) {
        setListOrder(res.response.data);
      }
    } catch (error) {
      toast.error('Get List Order Failed', error);
    }
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
      setListOrder([...listOrder].sort((a, b) => a.orderIndex - b.orderIndex));
    } else if (sortOption === 'Descending') {
      setListOrder([...listOrder].sort((a, b) => b.orderIndex - a.orderIndex));
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const response = await orderService.handleOrderCanteenManager(orderId, 2);
      if (response.code === 200) {
        toast.success('Order Waiting');

        const completedOrder = listOrder.find(
          (order) => order.orderId === orderId
        );
        if (completedOrder && completedOrder.listMealOrder) {
          const updatedMealReady = { ...mealReady };

          completedOrder.listMealOrder.forEach((subMealOrder) => {
            const { mealId, quantity } = subMealOrder;
            if (updatedMealReady[mealId]) {
              updatedMealReady[mealId] -= quantity;
            }
          });

          updateMealReady(updatedMealReady);
        }

        setListOrder((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setListSearch((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
      }
    } catch (error) {
      toast.error('Update Order Failed');
    }
  };
  const handleRejectOrder = async (orderId) => {
    try {
      const response = await orderService.rejectOrderCanteenManager(
        orderId,
        -1
      );
      console.log(response);
      if (response.code === 200) {
        toast.success('Reject Order Success');
        setListOrder((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
        setListSearch((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId)
        );
      }
    } catch (error) {
      toast.error('Reject Order Failed');
    }
  };

  const paginatedList = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listOrder.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (!searchQuery) {
      setListSearch([]);
    } else {
      const filteredOrders = listOrder.filter((order) =>
        order.orderIndex.toString().includes(searchQuery)
      );
      setListSearch(filteredOrders);
    }
  }, [searchQuery]);

  const checkAllMealsReady = (listMealOrder) => {
    return listMealOrder.every(
      (subMealOrder) => mealReady[subMealOrder.mealId] >= subMealOrder.quantity
    );
  };

  return (
    <>
      {/* <Header />
      <SideBar /> */}

      <h2 className=" mb-2 font-bold text-2xl">Order Processing</h2>
      <div className=" p-4 border-[1px] border-gray-200 border-solid rounded-lg md:min-h-[70vh] relative">
        <div className="pb-2 flex items-center justify-between">
          <div>
            <button
              onClick={() => setSelectedList(0)}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedList === 0 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setSelectedList(1)}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedList === 1 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setSelectedList(2)}
              className={`me-1 py-1 px-3 min-w-[96px] border-[1px] font-semibold text- ${
                selectedList === 2 ? 'bg-blue-500 text-white' : ''
              }`}
            >
              Waiting
            </button>
          </div>
        </div>

        <div className="md:min-h-[65vh]">
          {selectedList === 0 ? (
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
                        <div
                          className={`p-2 ${
                            checkAllMealsReady(item.listMealOrder)
                              ? 'bg-[#60cd60]'
                              : 'bg-[#f25c41]'
                          }`}
                        >
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
                                {mealReady[subMealOrder.mealId] >=
                                subMealOrder.quantity ? (
                                  <FaCheck className="text-[#60cd60]" />
                                ) : (
                                  <></>
                                )}
                              </div>
                            ))}
                        </div>
                        <div className="flex">
                          <div
                            className={`bg-[#60cd60] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center  ${
                              checkAllMealsReady(item.listMealOrder)
                                ? 'cursor-pointer'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (checkAllMealsReady(item.listMealOrder)) {
                                handleUpdateOrder(item.orderId);
                              }
                            }}
                          >
                            Waiting
                          </div>
                          <div
                            className="bg-[#f25c41] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center cursor-pointer"
                            onClick={() => handleRejectOrder(item.orderId)}
                          >
                            Reject
                          </div>
                        </div>
                      </div>
                    ))
                  : paginatedList() &&
                    paginatedList().map((item, index) => (
                      <div key={index} className="w-full border-[1px]">
                        <div
                          className={`p-2 ${
                            checkAllMealsReady(item.listMealOrder)
                              ? 'bg-[#60cd60]'
                              : 'bg-[#f25c41]'
                          }`}
                        >
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
                                {mealReady[subMealOrder.mealId] >=
                                subMealOrder.quantity ? (
                                  <FaCheck className="text-[#60cd60]" />
                                ) : (
                                  <></>
                                )}
                              </div>
                            ))}
                        </div>
                        <div className="flex">
                          <div
                            className={`bg-[#60cd60] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center ${
                              checkAllMealsReady(item.listMealOrder)
                                ? 'cursor-pointer'
                                : 'opacity-50 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (checkAllMealsReady(item.listMealOrder)) {
                                handleUpdateOrder(item.orderId);
                              }
                            }}
                          >
                            Waiting
                          </div>
                          <div
                            className="bg-[#f25c41] text-white font-semibold text-[14px] py-2 px-2 w-full flex items-center justify-center cursor-pointer"
                            onClick={() => handleRejectOrder(item.orderId)}
                          >
                            Reject
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </>
          ) : selectedList === 1 ? (
            <OrderProcessingSummaryComponent data={listOrder} />
          ) : selectedList === 2 ? (
            <OrderWaitingComponent />
          ) : (
            <StatusServiceMealingComponent />
          )}
        </div>
        {selectedList === 0 && (
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pb-4 pt-5 ps-0 pe-0 "
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(
                  itemsPerPage * (currentPage - 1) + 1,
                  listOrder.length
                )}
              </span>{' '}
              -{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {Math.min(itemsPerPage * currentPage, listOrder.length)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {listOrder.length}
              </span>
            </span>

            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <a
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${
                    currentPage === 1 ? 'disabled' : ''
                  }`}
                >
                  Previous
                </a>
              </li>
              {Array.from(
                { length: Math.ceil(listOrder.length / itemsPerPage) },
                (_, index) => (
                  <li key={index}>
                    <a
                      onClick={() => setCurrentPage(index + 1)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer ${
                        index + 1 === currentPage
                          ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      }`}
                    >
                      {index + 1}
                    </a>
                  </li>
                )
              )}
              <li>
                <a
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(listOrder.length / itemsPerPage)
                      )
                    )
                  }
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer ${
                    currentPage === Math.ceil(listOrder.length / itemsPerPage)
                      ? 'disabled'
                      : ''
                  }`}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default OrderProcessingComponent;
