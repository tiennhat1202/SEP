import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../store/UserContext';
import Forbidden from '../components/Error/Forbidden';
import { Navigate } from 'react-router-dom';

const CounterRoutes = (props) => {
  const { user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      setRedirect(true);
    }
    const delay = setTimeout(() => {
      if (user.roleName === 'RL_Counter') {
        setAuthorized(true);
      } else {
        setRedirect(true);
        setAuthorized(false);
      }
    }, 0);
    return () => clearTimeout(delay);
  }, [user]);

  if (redirect) {
    return <Navigate to="/signin_employee" replace={true} />;
  }

  if (authorized) {
    return <>{props.children}</>;
  }
  // else {
  //   return <Forbidden />;
  // }
};

export default CounterRoutes;
