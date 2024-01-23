import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../store/UserContext';
import { Navigate } from 'react-router-dom';

const UserRoutes = (props) => {
  const { user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!user) {
      setRedirect(true);
    }

    const delay = setTimeout(() => {
      if (user && !user.auth) {
        setRedirect(true);
      }
    }, 1000);

    return () => clearTimeout(delay);
  }, [user]);

  // Render children if the cookie is not null and user is authenticated
  return redirect ? (
    <Navigate to="/signin" replace={true} />
  ) : (
    <>{props.children}</>
  );
};

export default UserRoutes;
