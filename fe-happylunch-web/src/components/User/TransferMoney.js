import React, { useState, useEffect } from 'react';
import imgVNPAY from '../../assets/images/vnpay.svg';
import PaymentService from '../../services/PaymentService';
import { decodeAccessToken } from '../../utils/jwtDecode';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';

function TransferMoney() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([
    '50,000',
    '100,000',
    '200,000',
    '500,000',
    '1,000,000',
  ]);
  const [openModal, setOpenModal] = useState(false);

  const [receiverId, setReceiverId] = useState(null);
  const [accountEmail, setAccountEmail] = useState('');
  const decodedToken = decodeAccessToken();
  const customerId = decodedToken ? decodedToken.CustomerId : null;
  const emailStorage = decodedToken ? decodedToken.name : null;
  const paymentService = new PaymentService();
  const [isEmailExit, setIsEmailExit] = useState(false);
  const [emailNull, setEmailNull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState(false);
  const [validateValue, setValidateValue] = useState(false);
  const [myEmail, setEmail] = useState(false);

  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  useEffect(() => {
    document.title = 'Transfer Money';
  }, []);

  const getReceiverIdByEmail = async () => {
    setEmailNull(true);
    try {
      const response = await paymentService.getReceiverIdByEmail(accountEmail);
      if (response.code === 200) {
        if (response.response.data !== null) {
          setReceiverId(response.response.data);
          setIsEmailExit(true);
        } else {
          setIsEmailExit(false);
          setReceiverId(null);
          toast.warning('Email not found');
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const handleEmailChange = (e) => {
    setAccountEmail(e.target.value);
    if (e.target.value === emailStorage) {
      setEmail(true);
    } else {
      setEmail(false);
    }

    setIsEmailExit(false);
    if (e.target.value === '') {
      setIsEmailExit(false);
      setEmailNull(false);
      setReceiverId(null);
    }
  };

  const handleInputChange = (event) => {
    let value = event.target.value;
    value = value.replace(/,/g, '');

    if (value === '' || isNaN(value)) {
      setSuggestions(['50,000', '100,000', '200,000', '500,000', '1,000,000']);
      setInputValue('');
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
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSelectedSuggestion(suggestion);
    setValidate(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleTransferMoney = async (inputmoney) => {
    // Call API or perform further actions here
    if (receiverId !== null && inputValue !== '') {
      setLoading(true);
      try {
        const response = await paymentService.transferMoney(
          customerId,
          inputmoney,
          receiverId
        );
        if (response.code === 200) {
          toast.success(response.response.data);
          setOpenModal(false);
        }
      } catch (error) {
        toast.error(error.data.response.data);
      } finally {
        setLoading(false);
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
          <form onSubmit={handleSubmit} style={{ marginLeft: '0px' }}>
            <div className="border bg-white p-4 md:px-8 md:py-14 max-w-[420px] md:min-w-[420px]">
              <div className="flex items-center justify-center ">
                <span className="text-[#000000] font-semibold text-2xl">
                  Transfer Money
                </span>
              </div>
              <div className="mt-6">
                <div className="font-semibold">Email Account</div>
                <div className="mb-2 relative">
                  <input
                    className={`mt-1 w-full rounded-[4px] border p-2 ${
                      isEmailExit === false && emailNull === true
                        ? 'border-red-500 text-red-500'
                        : isEmailExit === false && emailNull === false
                        ? 'border-[#A0ABBB]'
                        : 'border-green-500'
                    }`}
                    type="email"
                    name="email"
                    placeholder="Enter email address!"
                    value={accountEmail}
                    onChange={handleEmailChange}
                  />
                  <span
                    className="absolute top-4 right-3 cursor-pointer flex items-center"
                    onClick={getReceiverIdByEmail}
                  >
                    {isEmailExit === true && myEmail === false ? (
                      <CheckOutlined className="text-green-500" />
                    ) : myEmail === true ? (
                      <CloseOutlined className="text-red-500" />
                    ) : (
                      <SearchOutlined className="text-black" />
                    )}
                  </span>

                  <span
                    className={`${
                      myEmail === true
                        ? 'text-red-500 text-[12px] block mt-2 font-bold italic'
                        : 'hidden'
                    }`}
                  >
                    You cannot transfer it to yourself!
                  </span>
                </div>
                {/* <div className="font-semibold">ReceiverId</div>
                <div className="mb-2">
                  <input
                    className='mt-1 w-full rounded-[4px] border border-[#A0ABBB] p-2'
                    type='text'
                    name='receiverId'
                    value={receiverId}
                    placeholder='xxxx-xxxx-xxxx-xxxx'
                    readOnly={true}
                  />
                </div> */}
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
                    placeholder="Enter the amount!"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9,]/g, '');
                    }}
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
                <div className="flex justify-start flex-wrap mb-3">
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
                    validateValue === true && isEmailExit === true
                      ? 'bg-blue-600'
                      : 'bg-gray-500'
                  }`}
                  onClick={() => {
                    if (
                      receiverId !== null &&
                      inputValue !== '' &&
                      validateValue
                    ) {
                      setOpenModal(true);
                    }
                  }}
                >
                  {loading === true ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300 mr-1"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to transfer money to {accountEmail}?
            </h3>
            <div className="flex justify-center gap-4 mb-5">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false); // Đóng modal trước khi gọi API
                  if (receiverId !== null && inputValue !== '') {
                    handleTransferMoney(inputValue.replace(/,/g, ''));
                  }
                }}
              >
                Yes, I`&apos;m sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default TransferMoney;
