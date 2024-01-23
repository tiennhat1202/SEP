import React from 'react';
import LoginHeaderComponent from '../components/Auth/LoginHeader';
import LoginComponent from '../components/Auth/Login';
import LoginFooterComponent from '../components/Auth/LoginFooter';

function Login() {
  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-5 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginHeaderComponent
            heading="Welcome To Happy Lunch"
            paragraph="Welcome back! Please enter your account."
          ></LoginHeaderComponent>
          <LoginComponent />
          {/* <LoginFooterComponent
            paragraph="You have an account that needs to be activated? &nbsp;"
            linkName="Active Account"
            linkUrl="/activeAccount"
          /> */}
          <LoginFooterComponent
            linkName="Login as Employee"
            linkUrl="/signin_employee"
          />
        </div>
      </div>
    </>
  );
}
export default Login;
