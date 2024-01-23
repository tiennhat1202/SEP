import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../store/UserContext';
import Forbidden from '../components/Error/Forbidden';
import { Navigate } from 'react-router-dom';

const CanteenManagerRoutes = (props) => {
  const { user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const RL_Admin = 'RL_Admin';
  const RL_HeadChef = 'RL_HeadChef';
  const RL_Counter = 'RL_Counter';
  const RL_CanteenManager = 'RL_CanteenManager';

  useEffect(() => {
    if (!user) {
      setRedirect(true);
    }
    const delay = setTimeout(() => {
      if (user.roleName === RL_CanteenManager) {
        setAuthorized(true);
      } else if (user.roleName === RL_Counter) {
        setAuthorized(true);
      } else if (user.roleName === RL_HeadChef) {
        setAuthorized(true);
      } else if (user.roleName === RL_Admin) {
        setAuthorized(true);
      } else {
        setRedirect(true);
        setAuthorized(false);
      }
    }, 100);
    return () => clearTimeout(delay);
  }, [user]);

  if (redirect) {
    return <Navigate to='/signin_employee' replace={true} />;
  }

  if (authorized) {
    return <>{props.children}</>;
  }
  // else {
  //   return <Forbidden />;
  // }
};

export default CanteenManagerRoutes;
