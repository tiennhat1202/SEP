import React, { useState, createContext } from 'react';
import Cookies from 'js-cookie';
import { decodeAccessToken } from '../utils/jwtDecode';

const UserContext = createContext({
  name: '',
  roleName: '',
  customerId: '',
  auth: false,
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    roleName: '',
    customerId: '',
    auth: false,
  });

  const loginContext = (data) => {
    Cookies.set('accessToken', data.accessToken, {
      expires: 1800000,
    });
    Cookies.set('refreshToken', data.refreshToken, {
      expires: 1800000,
    });

    const decodedToken = decodeAccessToken();
    if (decodedToken && !decodedToken.RoleName) {
      setUser((user) => ({
        name: decodedToken.name,
        roleName: 'RL_Customer',
        customerId: decodedToken.CustomerId,
        auth: true,
      }));
    } else {
      setUser((user) => ({
        name: decodedToken.name,
        roleName: decodedToken.RoleName,
        customerId: decodedToken.CustomerId,
        auth: true,
      }));
    }
  };

  const setDataReloadPage = () => {
    const decodedToken = decodeAccessToken();
    if (decodedToken) {
      if (!decodedToken.RoleName) {
        setUser((user) => ({
          name: decodedToken.name || '',
          roleName: 'RL_Customer',
          customerId: decodedToken.CustomerId || '',
          auth: true,
        }));
      } else {
        setUser((user) => ({
          name: decodedToken.name || '',
          roleName: decodedToken.RoleName || '',
          customerId: decodedToken.UserId || '',
          auth: true,
        }));
      }
    } else {
      // Handle the case when decodedToken is null
      setUser((user) => ({
        name: '',
        roleName: '',
        customerId: '',
        auth: false,
      }));
    }
  };

  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('mealReady');
    localStorage.setItem('CartLocalStorage', JSON.stringify([]));
    localStorage.setItem('pathCart', false);
    setUser((user) => ({
      name: '',
      roleName: '',
      customerId: '',
      auth: false,
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, loginContext, logout, setDataReloadPage }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
