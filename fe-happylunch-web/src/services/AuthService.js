import axios from 'axios';
import { baseUrl, baseUrlUnAuthorized } from './BaseService.js';

const endpoint = {
  signinCustomer: '/common/signin-customer',
  changePasswordCustomer: '/common/change-password-customer',
  resetCustomerPassword: '/common/reset-customer-password',
  changePassword: '/common/change-password-customer',
  refreshTokenCustomer: '/common/refresh-token-customer',
  activeAccountCustomer: '/common/active-account-customer',
  activeAccountUser: '/common/active-account-user',
  signupCustomer: '/common/signup-customer',
  signinUser: '/common/signin-user',
};

class AuthService {
  async signinCustomer(email, password) {
    try {
      const response = await baseUrlUnAuthorized.post(
        endpoint.signinCustomer,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async signinUser(email, password) {
    try {
      const response = await axios.post(
        'https://doan.local:7154/api/v1' + endpoint.signinUser,
        {
          email,
          password,
        },
        {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async changePasswordCustomer(
    userId,
    oldPassword,
    newPassword,
    confirmNewPassword
  ) {
    try {
      const response = await baseUrl.post(endpoint.changePasswordCustomer, {
        userId,
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async refreshTokenCustomer(refreshToken, accessToken) {
    try {
      const response = await baseUrlUnAuthorized.post(
        endpoint.refreshTokenCustomer,
        {
          refreshToken,
          accessToken,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async activeAccountCustomer(email, password, confirmPassword) {
    try {
      const response = await baseUrlUnAuthorized.post(
        endpoint.activeAccountCustomer,
        {
          email,
          password,
          confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async activeAccountUser(email, password, confirmPassword) {
    try {
      const response = await baseUrlUnAuthorized.post(
        endpoint.activeAccountUser,
        {
          email,
          password,
          confirmPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async resetCustomerPassword(email, phoneNumber) {
    console.log(email, phoneNumber);
    try {
      const response = await baseUrlUnAuthorized.post(
        endpoint.resetCustomerPassword,
        {
          email,
          phoneNumber,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

export default AuthService;
