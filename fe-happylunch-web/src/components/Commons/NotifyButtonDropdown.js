import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';
import { Dropdown } from 'flowbite-react';
import { FaComments, FaCircle, FaBell } from 'react-icons/fa';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import FeedbackService from '../../services/FeedbackService';

export default function NotifyButtonDropdown() {
  const [activeButton, setActiveButton] = useState('all');
  const [dot, setDot] = useState(false);
  const messageIdRef = useRef('');
  const messageContentRef = useRef('');
  const [listNoti, setListNoti] = useState([]);
  const navigate = useNavigate();
  const feedbackService = new FeedbackService();
  const token = Cookies.get('accessToken');
  const user = token ? jwt_decode(token) : null;
  const [receiveId, setReceiveId] = useState(user ? user.UserId : null);

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/feedbacklist', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    hubConnection.start();

    hubConnection.on('Feedback', (orderId, messageId) => {
      // setData(data);
      messageContentRef.current = orderId;
      messageIdRef.current = messageId;
      setReceiveId(receiveId);
      setTimeout(() => {
        getRecienoti();
      }, 500);
      setDot(true);
      getListContent();
    });

    return () => {
      hubConnection.stop();
    };
  }, []);

  const getRecienoti = async () => {
    try {
      const res = await feedbackService.getRecieveNoti(
        messageIdRef.current,
        receiveId,
        messageContentRef.current
      );
      if (res.code === 200) {
        console.log('Success');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListContent = async () => {
    try {
      const res = await feedbackService.getListNoti(receiveId);
      if (res.code === 200) {
        setListNoti(res.response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirectToOrderFeedback = (orderId) => {
    setStatusNotification(orderId);
    navigate(`/admin/feedback/${orderId}`);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const handleRemoveDot = () => {
    getListContent();
    setDot(false);
  };

  const setStatusNotification = async (orderId) => {
    try {
      await feedbackService.updateStatusNoti(orderId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dropdown
        size="sm"
        className="max-h-[80vh] overflow-y-auto"
        renderTrigger={() => (
          <div className="relative pr-5">
            <div className="absolute left-3 top-1 ">
              {dot == true && (
                <FaCircle className="text-red-500 w-3 h-3"></FaCircle>
              )}
            </div>
            <FaBell
              className="mt-3 mb-4 w-5 h-5 hover:text-blue-500 cursor-pointer"
              onClick={() => handleRemoveDot()}
            ></FaBell>
          </div>
        )}
      >
        <Dropdown.Header>
          <div className="min-w-[360px]">
            <div className="font-extrabold text-black text-xl py-1">
              Notifications
            </div>
            <div className="flex mt-2">
              <button
                className={`min-w-[72px] ${
                  activeButton === 'all'
                    ? 'bg-sky-100 hover:bg-sky-200 text-blue-600 font-medium py-2 px-3 me-2 rounded-full'
                    : 'font-medium py-2 px-3 me-2 rounded-full hover:bg-gray-200'
                }`}
                onClick={() => handleButtonClick('all')}
              >
                Everything
              </button>
              <button
                className={`min-w-[72px] ${
                  activeButton === 'unread'
                    ? 'bg-sky-100 hover:bg-sky-200 text-blue-600 font-medium py-2 px-3 me-2 rounded-full'
                    : 'font-medium py-2 px-3 me-2 rounded-full hover:bg-gray-200'
                }`}
                onClick={() => handleButtonClick('unread')}
              >
                No response yet
              </button>
            </div>
          </div>
        </Dropdown.Header>
        {listNoti &&
          listNoti.map((item, index) => (
            <Dropdown.Item
              onClick={() => handleRedirectToOrderFeedback(item.messageContent)}
              key={index}
            >
              <div className="min-w-[360px]">
                <div className="flex my-3">
                  <div className="flex items-center">
                    <FaComments className="w-6 h-6 text-blue-600"></FaComments>
                  </div>
                  <div className="max-w-[300px] text-start ms-4">
                    You received a new feedback to Order{' '}
                    <span className="tex-black font-bold uppercase">
                      {item.messageContent}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {item.status ? (
                      <></>
                    ) : (
                      <FaCircle className="text-blue-600"></FaCircle>
                    )}
                  </div>
                </div>
              </div>
            </Dropdown.Item>
          ))}
      </Dropdown>
    </>
  );
}
