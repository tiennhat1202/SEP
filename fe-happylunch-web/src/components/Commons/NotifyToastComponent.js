import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import { FaComments } from 'react-icons/fa';
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import FeedbackService from '../../services/FeedbackService';

function Notify() {
  const [orderId, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const showToastRef = useRef(false);
  const newMessageReceivedRef = useRef(false);
  const navigate = useNavigate();
  const feedbackService = new FeedbackService();

  useEffect(() => {
   
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/feedbacklist', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    hubConnection.start();

    hubConnection.on('Feedback', (orderId) => {
      const token = Cookies.get('accessToken');
      let user = null;
      
      if (token) {
        try {
          user = jwt_decode(token);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
  
      if (user.RoleName === 'RL_CanteenManager') {
        console.log('Show Toast', showToast);
        setMessage(orderId);
        newMessageReceivedRef.current = true;
        showToastRef.current = true;

        setTimeout(() => {
          if (newMessageReceivedRef.current) {
            setShowToast(true);
          } else {
            setShowToast(false);
          }
        }, 5000);
      }
    });

    return () => {
      hubConnection.stop();
    };
  }, []);

  const showFeedbackDetail = () => {
    setShowToast(false);
    setStatusNotification(orderId)
    navigate(`/admin/feedback/${orderId}`);
  };

  const setStatusNotification = async (orderId) => {
    try {
      await feedbackService.updateStatusNoti(orderId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setShowToast(showToastRef.current);
  }, []);

  return (
    <>
      {showToast == true && (
        <Toast
          className="absolute bottom-10 right-10 z-60 h-20 bg-gray-100 cursor-pointer hover:scale-105"
          onClick={showFeedbackDetail}
        >
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-400 text-white dark-bg-cyan-800 dark-text-cyan-200">
            <FaComments className="h-5 w-5" />
          </div>
          <div>
            <div className="ml-3 text-sm font-normal">
              You receive a new feedback
            </div>
          </div>
          <Toast.Toggle />
        </Toast>
      )}
    </>
  );
}

export default Notify;
