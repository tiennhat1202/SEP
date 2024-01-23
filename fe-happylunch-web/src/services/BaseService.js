import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

let accessToken = Cookies.get('accessToken');
let refreshToken = Cookies.get('refreshToken');

const baseUrl = axios.create({
  baseURL: 'https://doan.local:7154/api/v1',
  headers: { Authorization: `Bearer ${accessToken}`}
});

const baseUrlUnAuthorized = axios.create({
  baseURL: 'https://doan.local:7154/api/v1',
});


baseUrl.interceptors.request.use(
  async (config) => {
    if (!accessToken) {
      accessToken = Cookies.get('accessToken');
      refreshToken = Cookies.get('refreshToken');
      config.headers['Content-Type'] = 'application/json';
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const user = jwt_decode(Cookies.get('accessToken'));
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return config;

    if (user.CustomerId) {
      try {
        const response = await axios.post(
          'https://doan.local:7154/api/v1/common/refresh-token-customer',
          {
            accessToken: Cookies.get('accessToken'),
            refreshToken: Cookies.get('refreshToken'),
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );
        if (response.data.code === 200) {
          Cookies.set('accessToken', response.data.response.data.accessToken, {
            expires: 1800000,
          });
          Cookies.set(
            'refreshToken',
            response.data.response.data.refreshToken,
            {
              expires: 1800000,
            }
          );
          config.headers.Authorization = `Bearer ${response.data.response.data.accessToken}`;
        }
      } catch (error) {
        const errorStatus = error.response.data;
        if (
          errorStatus.code === 400 &&
          errorStatus.response.data === 'Invalid access token or refresh token'
        ) {
          window.location.href = '/Login';
        }
      }
    } else if (user.UserId) {
      try {
        const response = await axios.post(
          'https://doan.local:7154/api/v1/common/refresh-token-user',
          {
            accessToken: Cookies.get('accessToken'),
            refreshToken: Cookies.get('refreshToken'),
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            },
          }
        );

        if (response.data.code === 200) {
          Cookies.set('accessToken', response.data.response.data.accessToken, {
            expires: 1800000,
          });
          Cookies.set(
            'refreshToken',
            response.data.response.data.refreshToken,
            {
              expires: 1800000,
            }
          );
          config.headers.Authorization = `Bearer ${response.data.response.data.accessToken}`;
        }
      } catch (error) {
        const errorStatus = error.response.data;
        if (
          errorStatus.code === 400 &&
          errorStatus.response.data === 'Invalid access token or refresh token'
        ) {
          window.location.href = '/AdminLogin';
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response chung
baseUrl.interceptors.response.use(
  (response) => {
    // Thực hiện xử lý phản hồi chung ở đây nếu cần thiết
    return response;
  },
  (error) => {
    if (error.response) {
      // Check for 4xx or 5xx errors and handle them
      if (error.response.status >= 400 && error.response.status < 600) {
        // Handle the error as needed, e.g., show a message or perform a specific action
      }
    }
    return Promise.reject(error);
  }
);

export { baseUrl, baseUrlUnAuthorized };
