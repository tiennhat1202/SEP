import React, { useEffect, useContext } from 'react';
import { UserContext } from './store/UserContext';
import Cookies from 'js-cookie';
import AppRoutes from './routes/AppRoutes';
import NotifyFeedback from './components/Commons/NotifyToastComponent';
import NitifyReport from './components/Commons/NotifyToastReportComponent';
import { MealReadyProvider } from './store/MealReadyContext';

function App() {
  const { user, setDataReloadPage } = useContext(UserContext);

  useEffect(() => {
    if (Cookies.get('accessToken')) {
      setDataReloadPage();
    }
  }, []);

  console.log('>User', user);

  return (
    <MealReadyProvider>
      <div className="app">
        <div className="min-h-[100vh] relative">
          <AppRoutes />
          <NotifyFeedback />
          <NitifyReport />
        </div>
      </div>
    </MealReadyProvider>
  );
}

export default App;
