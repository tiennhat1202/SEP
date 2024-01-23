import React from 'react';
import LoginHeaderComponent from '../components/Auth/LoginHeader';
import LoginComponent from '../components/Auth/AdminLogin';
import LoginFooterComponent from '../components/Auth/LoginFooter';

function AdminLogin() {
  document.title = 'Login Admin';
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginHeaderComponent
          heading="Welcome Employee"
          paragraph="Welcome back! Please enter your employee account."
        ></LoginHeaderComponent>
        <LoginComponent />
        {/* <LoginFooterComponent
          paragraph="You have an account that needs to be activated? &nbsp;"
          linkName="Active Account"
          linkUrl="/activeAccount"
        /> */}
        <LoginFooterComponent linkName="Login as Customer" linkUrl="/signin" />
      </div>
    </div>
  );
}
export default AdminLogin;
