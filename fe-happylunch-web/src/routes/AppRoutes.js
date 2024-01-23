import React from 'react';
import UserRoutes from './UserRoutes';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './privateRoutes';

import { Routes, Route } from 'react-router-dom';
import UserLogin from '../pages/Login';
import UserHome from '../components/User/OrderListMeal';
import UserDeposit from '../components/User/Deposit';
import UserPayment from '../components/User/PaymentOrders';
import UserChangePassword from '../components/User/ChangePassword';
import UserTranferMoney from '../components/User/TransferMoney';
import UserDepositResult from '../components/User/DepositResult';
import UserOrderHistory from '../components/User/OrderHistory';
import UserOrderHistoryDetail from '../components/User/OrderHistoryDetails';
import UserActiveAccount from '../pages/ActiveAccount';
import AdminActiveAccount from '../pages/ActiveUser'
import UserResetPassword from '../pages/ResetPassword';
import UserNavbar from '../components/User/Navbar';
import UserReport from '../components/User/Report';

import CounterOrderListMeal from '../components/Counter/OrderListMeal';
import CounterPaymentResult from '../components/Counter/PaymentResult';
import CounterChangePassword from '../components/Counter/ChangePassword';

import AdminLogin from '../pages/AdminLogin';
import AdminChangePassword from '../components/Admin/ChangePassword';
import AdminOrderManager from '../components/Admin/OrderManagementContent';
import AdminOrderProcessing from '../components/HeadChef/OrderProcessing';
import AdminReport from '../components/Admin/ReportManagementContent';
import AdminReportDetail from '../components/Subcomponents/ReportDetailContent';
import AdminManageServe from '../components/Subcomponents/SetServiceMeal';

import MenuManagement from '../components/HeadChef/MenuManagementContent';
import MenuManagement_Canteen from '../components/CanteenManager/MenuManagementContent';
import MenuCateManagement from '../components/HeadChef/MenuCateMngContent';
import MealManagement from '../components/HeadChef/MealManagementContent';
import MealCateManagement from '../components/HeadChef/MealCateMngContent';
import CreateMealCate from '../components/HeadChef/CreateMealCateContent';
import Dashboard from '../components/Admin/DashBoardContent';
import CreateMenu from '../components/HeadChef/CreateMenuContent';
import MenuDetails from '../components/HeadChef/MenuDetailsContent';
import MealDetailByCate from '../components/HeadChef/MealDetailByCate';
import UpdateMenu from '../components/HeadChef/UpdateMenuContent';
import CreateMeal from '../components/HeadChef/CreateMealContent';
import UpdateMeal from '../components/HeadChef/UpdateMealContent';
import CreateMenuCate from '../components/HeadChef/CreateMenuCateContent';
import FeedBackManagement from '../components/Admin/FeedBackManagementContent';
import AccountManagement from '../components/Admin/AccountManagementContent';
import AccountUpdate from '../components/Admin/UpdateAccountContent';
import RoleManagement from '../components/Admin/RoleManagementContent';
import AdminFeedbackDetailContent from '../components/Admin/FeedbackDetailContent';
import ToDoMenu from '../components/HeadChef/ToDoMenu';
import CreateMenuInfo from '../components/HeadChef/CreateMenuInfo';
import AccountManagementContent from '../components/Admin/AccountManagementContent';
import AdminLayout from '../components/DefaultLayout/AdminLayout';

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Login */}
        <Route
          path='/signin'
          element={
            <PublicRoutes>
              <UserLogin />
            </PublicRoutes>
          }
        />
        <Route path='/signin_employee' element={<AdminLogin />} />
        <Route path='/activatedCustomer' element={<UserActiveAccount />} />
        <Route path='/activatedUser' element={<AdminActiveAccount />} />
        <Route path='/resetpassword' element={<UserResetPassword />} />
        <Route path='/report' element={<UserReport />} />
        {/* Routes User Start */}
        <Route
          path='/'
          element={
            <PublicRoutes>
              <UserHome />
            </PublicRoutes>
          }
        />
        <Route
          path='/deposit'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserDeposit />
            </UserRoutes>
          }
        />
        <Route
          path="/payment"
          element={
            <PublicRoutes>
              <UserPayment />
            </PublicRoutes>
          }
        />
        <Route
          path='/changePassword'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserChangePassword />
            </UserRoutes>
          }
        />
        <Route
          path='/transfermoney'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserTranferMoney />
            </UserRoutes>
          }
        />
        <Route
          path='/deposit/result'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserDepositResult />
            </UserRoutes>
          }
        />
        <Route
          path='/orderhistory'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserOrderHistory />
            </UserRoutes>
          }
        />
        <Route
          path='/orderhistory/:orderId'
          element={
            <UserRoutes>
              <UserNavbar />
              <UserOrderHistoryDetail />
            </UserRoutes>
          }
        />
        {/* Counter */}
        <Route
          path='/counter_staff/orderlistmeal'
          element={
            <PrivateRoutes>
              <CounterOrderListMeal />
            </PrivateRoutes>
          }
        />
        <Route
          path='/counter_staff/orderlistmeal/payment'
          element={
            <PrivateRoutes>
              <CounterPaymentResult />
            </PrivateRoutes>
          }
        />
        <Route
          path='/counter_staff/changepassword'
          element={
            <PrivateRoutes>
              <CounterChangePassword />
            </PrivateRoutes>
          }
        />
        {/* Routes CanteenManager Start */}
        <Route
          path='/admin/ordermanagement'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AdminOrderManager}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/orderprocessing'
          element={
            <PrivateRoutes>
              <AdminLayout
                initialComponent={AdminOrderProcessing}
              ></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/serve_meal'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AdminManageServe}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management_canteen_manager'
          element={
            <PrivateRoutes>
              <AdminLayout
                initialComponent={MenuManagement_Canteen}
              ></AdminLayout>
            </PrivateRoutes>
          }
        />

        {/* Routes CanteenManager End */}

        {/* Routes Admin  */}
        <Route
          path='/admin/dashboard'
          element={
              <PrivateRoutes>
                <AdminLayout initialComponent={Dashboard}></AdminLayout>
              </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={MenuManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/create_menu'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMenu}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/menu_details'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={MenuDetails}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/update_menu'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={UpdateMenu}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_category/create_menu_category'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMenuCate}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_category'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={MenuCateManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/meal_management/create_meal'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMeal}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/meal_management/update_meal'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={UpdateMeal}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/mealCate_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={MealCateManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/meal_detail_by_cate'
          element={
            <PrivateRoutes>
              {' '}
              <AdminLayout initialComponent={MealDetailByCate}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/meal_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={MealManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/mealCate_management/create_meal_category'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMealCate}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/feedback'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={FeedBackManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/feedback/:orderId'
          element={
            <PrivateRoutes>
              <AdminLayout
                initialComponent={AdminFeedbackDetailContent}
              ></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/account_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AccountManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/update_account'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AccountUpdate}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/role_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={RoleManagement}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/user_management'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AccountManagementContent}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/todo_menu'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={ToDoMenu}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/report'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AdminReport}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/report/:reportId'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AdminReportDetail}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/create_menuInfo'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMenuInfo}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/menu_management/create_menuInfo'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={CreateMenuInfo}></AdminLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path='/admin/changepassword'
          element={
            <PrivateRoutes>
              <AdminLayout initialComponent={AdminChangePassword}></AdminLayout>
            </PrivateRoutes>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
