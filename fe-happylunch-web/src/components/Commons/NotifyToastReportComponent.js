import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import { HiExclamation } from 'react-icons/hi';
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

function Notify() {
  const [reportId, setMessage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://doan.local:7154/reporthub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    hubConnection.start();

    hubConnection.on('Report', (reportId) => {
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
        setMessage(reportId);
        setShowToast(true);
      }
    });
    return () => {
      hubConnection.stop();
    };
  }, [reportId]);

  const showReportDetail = () => {
    setShowToast(false);
    navigate(`/admin/report/${reportId}`);
  };

  return (
    <>
      {showToast == true && (
        <Toast
          className="absolute bottom-10 right-10 z-60 h-20 bg-gray-100 cursor-pointer hover:scale-105"
          onClick={showReportDetail}
        >
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <HiExclamation className="h-5 w-5" />
          </div>
          <div>
            <div className="ml-3 text-sm font-normal">
              You receive a new report
            </div>
          </div>
          <Toast.Toggle />
        </Toast>
      )}
    </>
  );
}

export default Notify;
