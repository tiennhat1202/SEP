import React, { useState, useEffect } from 'react';
import imgVNPAY from '../../assets/images/vnpay.svg';
import PaymentService from '../../services/PaymentService';
import { ToastContainer, toast } from 'react-toastify';
import { decodeAccessToken } from '../../utils/jwtDecode';

function Deposit() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    '50,000',
    '100,000',
    '200,000',
    '500,000',
    '1,000,000',
  ]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const decodedToken = decodeAccessToken();
  const customerId = decodedToken ? decodedToken.CustomerId : null;
  const [validate, setValidate] = useState(false);
  const [validateValue, setValidateValue] = useState(false);

  useEffect(() => {
    document.title = 'Deposit';
  }, []);

  const handleInputChange = (event) => {
    let value = event.target.value;
    value = value.replace(/,/g, '');

    if (value === '' || isNaN(value)) {
      setSuggestions(['50,000', '100,000', '200,000', '500,000', '1,000,000']);
      setInputValue('');
      setValidate(false);
      setValidateValue(false);
    } else if (!isNaN(value)) {
      if (value >= 100000000) {
        setValidate(true);
      } else if (value <= 10000) {
        setValidate(true);
      } else {
        setValidate(false);
      }
      if (value >= 10000 && value <= 10000000) {
        setValidateValue(true);
      } else {
        setValidateValue(false);
      }
      setInputValue(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
    } else {
      setSuggestions([]);
      setValidate(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSelectedSuggestion(suggestion);
    setValidate(false);
  };

  const handlePayClick = async (e) => {
    e.preventDefault();
  };

  const handleDeposit = async () => {
    const requestData = {
      customerId: customerId,
      money: inputValue.replace(/,/g, ''),
    };

    if (requestData.money >= 10000 && requestData.money <= 10000000) {
      try {
        const paymentService = new PaymentService();
        const response = await paymentService.depositMoney(
          requestData.customerId,
          requestData.money
        );
        if (response.code === 200) {
          window.location.href = response.response.data;
        }
      } catch (error) {
        if (error === 'Request failed with status code 404') {
          toast.error('Request Payment Not Found');
        }
      }
    }
  };

  return (
    <>
      <div className="min-h-[90vh] h-fit bg-gray-100 pt-5">
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 md:my-12 lg:my-16 xl:my-20">
          <div className="md:w-2/5 bg-white flex justify-center items-center border">
            <img
              src={imgVNPAY}
              style={{
                width: '45vw',
                maxHeight: '45vh',
                objectFit: 'contain',
                paddingRight: '1rem',
                paddingLeft: '1rem',
              }}
            />
          </div>
          <form onSubmit={handlePayClick} style={{ marginLeft: '0px' }}>
            <div className="border bg-white p-4 md:px-8 md:py-14 max-w-[420px] md:min-w-[420px]">
              <div className="flex items-center justify-center ">
                <span className="text-[#000000] font-semibold text-2xl">
                  Deposit Money
                </span>
              </div>
              <div className="mt-6">
                <div className="font-semibold">
                  How much money do you want to deposit?
                </div>
                <div className="mb-2">
                  <input
                    className={`mt-1 w-full rounded-[4px] border ${
                      validate === true
                        ? 'border-red-500 text-red-600 focus:border-red-600 focus:ring-red-500'
                        : 'border-[#A0ABBB]'
                    }  p-2`}
                    type="text"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9,]/g, '');
                    }}
                    placeholder="Enter the amount"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <span
                    className={`${
                      validate === true
                        ? 'text-red-500 text-[12px] block mt-2 font-bold italic'
                        : 'hidden'
                    }`}
                  >
                    Value not less than 10,000 and not more than 10,000,000
                  </span>
                </div>
                <div className="flex justify-start flex-wrap">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className={`mt-[14px] ${
                        index < suggestions.length - 1 ? 'mr-3' : ''
                      } cursor-pointer truncate rounded-[4px] border ${
                        selectedSuggestion === item
                          ? 'border-[#1c64f2] bg-[#1c64f2] text-white'
                          : 'border-[#E7EAEE]'
                      } p-2 text-[#191D23]`}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-12">
                <button
                  className={`w-full cursor-pointer rounded-[4px]  px-3 py-[6px] text-center font-semibold text-white flex items-center justify-center ${
                    validate || !validateValue ? 'bg-gray-500' : 'bg-blue-600'
                  }`}
                  onClick={handleDeposit}
                >
                  Pay
                </button>
              </div>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
export default Deposit;
