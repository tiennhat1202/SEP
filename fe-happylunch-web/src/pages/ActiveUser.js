import React from 'react';
import Header from '../components/Auth/LoginHeader';
import ActiveAccountUser from '../components/Auth/ActiveUser';
import LoginFooterComponent from '../components/Auth/LoginFooter';

function ActiveUser() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-5 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Header
          heading="Welcome To HLS"
          paragraph="Please enter your account to activated."
        />
        <ActiveAccountUser />
        <LoginFooterComponent
          paragraph="Already have an account? &nbsp;"
          linkName="Login"
          linkUrl="/signin_employee"
        />
      </div>
    </div>
  );
}
export default ActiveUser;
