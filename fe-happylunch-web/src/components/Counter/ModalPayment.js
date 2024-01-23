import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import {
  FaIdCard,
  FaCcVisa,
  FaMoneyBillAlt,
  FaUserSlash,
  FaUserCheck,
  FaUserTimes,
} from 'react-icons/fa';

import OrderService from '../../services/OrderService';
import { useNavigate } from 'react-router-dom';

function ModalPayment({
  openModal,
  setOpenModal,
  onOpenModal,
  data,
  clearCart,
  onPaymentSuccess,
}) {
  const [modalSize, setModalSize] = useState('4xl');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState('Employee ID Card');
  const [cardId, setInputValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const totalMoney = data && data.totalMoney;
  const inputRef = useRef(null);
  const fieldOrder = ['userId', 'cardId', 'totalMoney', 'orderDetails'];
  const orderService = new OrderService();
  const navigate = useNavigate();

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setInputValue('');
  };

  useEffect(() => {
    if (selectedPaymentMethod === 'Employee ID Card' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (isInvalid) {
      const timeoutId = setTimeout(() => {
        setInputValue('');
        setIsInvalid(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isInvalid]);

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (value.trim() === '' || value.length > 10) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }

    setInputValue(value);
  };

  const newData = { ...data, cardId };

  const newDataOrdered = {};
  fieldOrder.forEach((fieldName) => {
    if (fieldName in newData) {
      newDataOrdered[fieldName] = newData[fieldName];
    }
  });

  for (const fieldName in newData) {
    if (!fieldOrder.includes(fieldName)) {
      newDataOrdered[fieldName] = newData[fieldName];
    }
  }

  const paymentOrder = async (newDataOrdered) => {
   
    if (
      selectedPaymentMethod === 'Employee ID Card' ||
      selectedPaymentMethod === 'Cash'
    ) {
      console.log('data', newDataOrdered);
      try {
        const res = await orderService.counterPaymentByCash(newDataOrdered);
        if (res && res.code === 200) {
          onPaymentSuccess();
          localStorage.removeItem('cartItems');
          navigate('payment', { state: { data: res.response.data } });
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (selectedPaymentMethod === 'VNPAY') {
      const { cardId, totalMoney, userId, ...newDataWithoutCardId } =
        newDataOrdered;

      const data = {
        customerId: null,
        userId: userId,
        total: totalMoney,
        ...newDataWithoutCardId,
      };
      try {
        const res = await orderService.counterPaymentByQR(data);
        if (res && res.code === 200) {
          localStorage.setItem('dataCartVNPAY', JSON.stringify(data));
          window.location.href = res.response.data;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Modal
        show={openModal}
        size={modalSize}
        onClose={() => {
          setOpenModal(false);
          setInputValue('');
          setSelectedPaymentMethod('Employee ID Card');
        }}
      >
        <Modal.Header className="uppercase">Comfirm Checkout</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400 flex">
              <div className="uppercase text-black">Total: </div>
              <div className="uppercase mx-3 text-red-500">
                {' '}
                {totalMoney &&
                  totalMoney.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  })}
              </div>
            </div>
            <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <div className="uppercase text-black">Payment Method</div>
            </div>
            <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <div className="flex my-1 items-center max-w-[400px]">
                  <label
                    htmlFor="cardid"
                    className={` ${
                      selectedPaymentMethod === 'Employee ID Card'
                        ? 'px-2 py-2 border-[1px] border-red-500 rounded-md flex items-center min-w-[400px] cursor-pointer'
                        : 'px-2 py-2 border-[1px] border-gray rounded-md flex items-center min-w-[400px] cursor-pointer'
                    }`}
                  >
                    <input
                      id="cardid"
                      type="radio"
                      name="paymentMethod"
                      className="me-2 my-2 ms-3"
                      onChange={() =>
                        handlePaymentMethodChange('Employee ID Card')
                      }
                      checked={selectedPaymentMethod === 'Employee ID Card'}
                    ></input>
                    <FaIdCard className="w-10 h-10 text-sky-300 ms-4"></FaIdCard>
                    <div className="uppercase text-black mx-4">
                      Employee ID Card
                    </div>
                  </label>
                  {selectedPaymentMethod === 'Employee ID Card' && (
                    <>
                      <input
                        autoFocus
                        className="w-1 z-[-10]"
                        ref={inputRef}
                        value={cardId}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                </div>
                <div className="w-full h-full flex justify-center">
                  {selectedPaymentMethod === 'Employee ID Card' && (
                    <>
                      {cardId.trim() === '' ? (
                        <div className="px-2 py-2 border-[1px] border-gray-600 rounded-lg mx-2 min-w-[400px] flex items-center justify-center bg-gray-100">
                          <FaUserSlash className="w-10 h-10 text-gray-500"></FaUserSlash>
                          <p className="px-3 text-gray-500">Card Empty</p>
                        </div>
                      ) : cardId.length > 10 ? (
                        <div className="px-2 py-2 border-[1px] border-red-600 rounded-lg mx-2 min-w-[400px] flex items-center justify-center bg-red-100">
                          <FaUserTimes className="w-10 h-10 text-red-500"></FaUserTimes>
                          <p className="px-3 text-red-500">Swipe card failed</p>
                        </div>
                      ) : (
                        <div className="px-2 py-2 border-[1px] border-green-600 rounded-lg mx-2 min-w-[400px] flex items-center justify-center bg-green-100">
                          <FaUserCheck className="w-10 h-10 text-emerald-500"></FaUserCheck>
                          <p className="px-3 text-emerald-500">
                            Swipe card successfully
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex my-1 items-center">
                <label
                  htmlFor="qr"
                  className={` ${
                    selectedPaymentMethod === 'VNPAY'
                      ? 'px-2 py-2 border-[1px] border-red-500 rounded-md flex items-center min-w-[400px] cursor-pointer'
                      : 'px-2 py-2 border-[1px] border-gray rounded-md flex items-center min-w-[400px] cursor-pointer'
                  }`}
                >
                  <input
                    id="qr"
                    type="radio"
                    name="paymentMethod"
                    className="me-2 my-2 ms-3"
                    onChange={() => handlePaymentMethodChange('VNPAY')}
                  ></input>
                  <FaCcVisa className="w-10 h-10 text-sky-300 ms-4"></FaCcVisa>
                  <div className="uppercase text-black mx-4">VNPay</div>
                </label>
              </div>
              <div className="flex my-1 items-start">
                <label
                  htmlFor="cash"
                  className={` ${
                    selectedPaymentMethod === 'Cash'
                      ? 'px-2 py-2 border-[1px] border-red-500 rounded-md flex items-center min-w-[400px] cursor-pointer'
                      : 'px-2 py-2 border-[1px] border-gray rounded-md flex items-center min-w-[400px] cursor-pointer'
                  }`}
                >
                  <input
                    id="cash"
                    type="radio"
                    name="paymentMethod"
                    className="me-2 my-2 ms-3"
                    onChange={() => handlePaymentMethodChange('Cash')}
                  ></input>
                  <FaMoneyBillAlt className="w-10 h-10 text-sky-300 ms-4"></FaMoneyBillAlt>
                  <div className="uppercase text-black mx-4">Cash</div>
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="blue"
            className={`${
              totalMoney === 0
                ? 'enabled bg-blue-300 enabled:hover:bg-blue-300 enabled:outline-none enabled:focus:outline-none focus:ring-0'
                : ''
            }`}
            onClick={() => {
              if (totalMoney !== 0) {
                paymentOrder(newDataOrdered);
                onOpenModal && onOpenModal();
                setOpenModal(false);
                setIsInvalid(true);
              }
            }}
          >
            Confirm
          </Button>

          <Button
            color="red"
            onClick={() => {
              setOpenModal(false);
              setInputValue('');
              setSelectedPaymentMethod('Employee ID Card');
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalPayment;
